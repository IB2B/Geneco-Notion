import { APIErrorCode, APIResponseError } from "@notionhq/client";

export type NotionWriteOutcome =
  | { ok: true; pageId: string; pageUrl: string }
  | { ok: false; code: NotionErrorCode; retriable: boolean; message: string };

export type NotionErrorCode =
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "rate_limited"
  | "conflict"
  | "validation_error"
  | "unknown";

export function classifyNotionError(err: unknown): NotionWriteOutcome {
  if (err instanceof APIResponseError) {
    switch (err.code) {
      case APIErrorCode.Unauthorized:
        return { ok: false, code: "unauthorized", retriable: false, message: err.message };
      case APIErrorCode.RestrictedResource:
        return { ok: false, code: "forbidden", retriable: false, message: err.message };
      case APIErrorCode.ObjectNotFound:
        return { ok: false, code: "not_found", retriable: false, message: err.message };
      case APIErrorCode.RateLimited:
        return { ok: false, code: "rate_limited", retriable: true, message: err.message };
      case APIErrorCode.ConflictError:
        return { ok: false, code: "conflict", retriable: true, message: err.message };
      case APIErrorCode.ValidationError:
        return { ok: false, code: "validation_error", retriable: false, message: err.message };
      default:
        return { ok: false, code: "unknown", retriable: false, message: err.message };
    }
  }
  return {
    ok: false,
    code: "unknown",
    retriable: false,
    message: err instanceof Error ? err.message : "Unknown error",
  };
}

export async function withNotionRetry<T>(
  op: () => Promise<T>,
  { maxAttempts = 3, baseDelayMs = 400 }: { maxAttempts?: number; baseDelayMs?: number } = {},
): Promise<{ ok: true; value: T } | { ok: false; outcome: Exclude<NotionWriteOutcome, { ok: true }> }> {
  let lastOutcome: Exclude<NotionWriteOutcome, { ok: true }> | null = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const value = await op();
      return { ok: true, value };
    } catch (err) {
      const outcome = classifyNotionError(err);
      if (outcome.ok) continue;
      lastOutcome = outcome;
      if (!outcome.retriable || attempt === maxAttempts) break;
      const jitter = Math.random() * 200;
      await new Promise((r) => setTimeout(r, baseDelayMs * 2 ** (attempt - 1) + jitter));
    }
  }
  return { ok: false, outcome: lastOutcome ?? { ok: false, code: "unknown", retriable: false, message: "Exhausted retries" } };
}
