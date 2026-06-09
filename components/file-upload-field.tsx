"use client";

import { useId, useRef, useState } from "react";
import imageCompression from "browser-image-compression";

export type UploadedFile = {
  fileUploadId: string;
  filename: string;
};

type Props = {
  label: string;
  /** Allow uploading multiple files into this single property. Default: true */
  multiple?: boolean;
  /** Hint text shown under the label. */
  hint?: string;
  /** Current values (controlled). */
  value: ReadonlyArray<UploadedFile>;
  /** Called whenever the list of uploaded files changes. */
  onChange: (next: ReadonlyArray<UploadedFile>) => void;
  /** Restrict accepted MIME types. Default accepts common image/document types. */
  accept?: string;
};

type Pending = {
  key: string;
  filename: string;
  progress: number;
  error?: string;
};

const COMPRESS_OPTIONS = {
  maxSizeMB: 3.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  initialQuality: 0.82,
};

const HARD_MAX_BYTES = 4 * 1024 * 1024; // align with server `/api/uploads` cap

export function FileUploadField({
  label,
  multiple = true,
  hint,
  value,
  onChange,
  accept = "image/*,application/pdf",
}: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<ReadonlyArray<Pending>>([]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const picked = Array.from(files);

    if (inputRef.current) inputRef.current.value = "";

    const initial: Pending[] = picked.map((f) => ({
      key: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 8)}`,
      filename: f.name,
      progress: 0,
    }));
    setPending((prev) => [...prev, ...initial]);

    const uploaded: UploadedFile[] = [];

    for (let i = 0; i < picked.length; i++) {
      const file = picked[i]!;
      const key = initial[i]!.key;

      try {
        const prepared = await prepareForUpload(file);
        updatePending(setPending, key, { progress: 30 });

        const res = await uploadOne(prepared);

        updatePending(setPending, key, { progress: 100 });
        uploaded.push({ fileUploadId: res.fileUploadId, filename: res.filename });

        setTimeout(() => {
          setPending((prev) => prev.filter((p) => p.key !== key));
        }, 250);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Errore durante il caricamento";
        updatePending(setPending, key, { error: message, progress: 0 });
      }
    }

    if (uploaded.length > 0) {
      onChange(multiple ? [...value, ...uploaded] : uploaded.slice(0, 1));
    }
  }

  function removeUploaded(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function removePending(key: string) {
    setPending((prev) => prev.filter((p) => p.key !== key));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13.5px] font-medium text-fg">
          {label}
        </label>
        {hint ? (
          <span className="text-[11.5px] text-fg-subtle">{hint}</span>
        ) : null}
      </div>

      <div className="rounded-[12px] border border-dashed border-border-strong bg-surface-muted/40 px-4 py-3">
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onPick}
          className="block w-full text-[13px] text-fg-muted file:mr-3 file:cursor-pointer file:rounded-[8px] file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-[12.5px] file:font-medium file:text-primary-fg hover:file:bg-primary/90"
        />

        {value.length > 0 || pending.length > 0 ? (
          <ul className="mt-3 space-y-1.5">
            {value.map((f, i) => (
              <li
                key={`${f.fileUploadId}-${i}`}
                className="flex items-center justify-between gap-3 rounded-[8px] bg-surface px-3 py-1.5 text-[12.5px]"
              >
                <span className="flex items-center gap-2 truncate">
                  <span aria-hidden className="text-success">✓</span>
                  <span className="truncate text-fg">{f.filename}</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeUploaded(i)}
                  className="shrink-0 text-[11.5px] font-medium text-fg-subtle hover:text-error"
                  aria-label={`Rimuovi ${f.filename}`}
                >
                  Rimuovi
                </button>
              </li>
            ))}

            {pending.map((p) => (
              <li
                key={p.key}
                className="flex items-center justify-between gap-3 rounded-[8px] bg-surface px-3 py-1.5 text-[12.5px]"
              >
                <span className="flex flex-1 items-center gap-2 truncate">
                  <span aria-hidden className={p.error ? "text-error" : "text-primary"}>
                    {p.error ? "✕" : "↑"}
                  </span>
                  <span className="truncate text-fg">{p.filename}</span>
                  {p.error ? (
                    <span className="text-[11px] text-error">— {p.error}</span>
                  ) : (
                    <span className="text-[11px] text-fg-subtle">— caricamento…</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => removePending(p.key)}
                  className="shrink-0 text-[11.5px] font-medium text-fg-subtle hover:text-error"
                  aria-label={`Rimuovi ${p.filename}`}
                >
                  Rimuovi
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function updatePending(
  setPending: React.Dispatch<React.SetStateAction<ReadonlyArray<Pending>>>,
  key: string,
  patch: Partial<Pending>,
) {
  setPending((prev) => prev.map((p) => (p.key === key ? { ...p, ...patch } : p)));
}

async function prepareForUpload(file: File): Promise<File> {
  if (file.type.startsWith("image/")) {
    try {
      const compressed = await imageCompression(file, COMPRESS_OPTIONS);
      if (compressed.size <= HARD_MAX_BYTES) return compressed as File;
    } catch {
      // fall through to size check
    }
  }
  if (file.size > HARD_MAX_BYTES) {
    throw new Error(`File troppo grande (max ${Math.round(HARD_MAX_BYTES / 1024 / 1024)} MB)`);
  }
  return file;
}

async function uploadOne(file: File): Promise<{ fileUploadId: string; filename: string }> {
  const form = new FormData();
  form.append("file", file, file.name);

  const res = await fetch("/api/uploads", { method: "POST", body: form });

  if (!res.ok) {
    let message = "Caricamento non riuscito";
    try {
      const body = (await res.json()) as { message?: string; code?: string };
      if (body?.message) message = body.message;
    } catch {
      // ignore parse error
    }
    throw new Error(message);
  }

  return (await res.json()) as { fileUploadId: string; filename: string };
}
