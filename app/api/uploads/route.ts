import type { NextRequest } from "next/server";
import { env } from "@/lib/env";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024; // 4MB — under Vercel's 4.5MB request body cap
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
]);

export async function POST(request: NextRequest) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, code: "bad_request", message: "Multipart form-data expected" }, 400);
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return json({ ok: false, code: "missing_file", message: "Field 'file' is required" }, 400);
  }
  if (file.size === 0) {
    return json({ ok: false, code: "empty_file", message: "Empty file" }, 400);
  }
  if (file.size > MAX_BYTES) {
    return json(
      { ok: false, code: "file_too_large", message: `Massimo ${MAX_BYTES / 1024 / 1024}MB per file` },
      413,
    );
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return json(
      { ok: false, code: "unsupported_type", message: `Tipo non supportato: ${file.type}` },
      415,
    );
  }

  const token = env.notionToken();

  // Step 1 — create the file_upload to get an id + upload_url.
  const createRes = await fetch("https://api.notion.com/v1/file_uploads", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2026-03-11",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
      content_type: file.type,
    }),
  });

  if (!createRes.ok) {
    const detail = await safeText(createRes);
    return json(
      { ok: false, code: "notion_create_failed", message: detail.slice(0, 200) },
      502,
    );
  }

  const created = (await createRes.json()) as { id: string; upload_url: string };

  // Step 2 — forward the file bytes to the Notion-provided upload URL.
  const sendForm = new FormData();
  sendForm.append("file", file, file.name);

  const sendRes = await fetch(created.upload_url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2026-03-11",
    },
    body: sendForm,
  });

  if (!sendRes.ok) {
    const detail = await safeText(sendRes);
    return json(
      { ok: false, code: "notion_send_failed", message: detail.slice(0, 200) },
      502,
    );
  }

  return json({ ok: true, fileUploadId: created.id, filename: file.name }, 201);
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return `HTTP ${res.status}`;
  }
}
