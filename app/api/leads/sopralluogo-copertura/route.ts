import type { NextRequest } from "next/server";
import { ZodError } from "zod";
import { notion } from "@/lib/notion/client";
import { withNotionRetry } from "@/lib/notion/errors";
import { coperturaSchema } from "@/lib/forms/sopralluogo-copertura/schema";
import { coperturaFormConfig } from "@/lib/forms/sopralluogo-copertura/config";
import { coperturaToNotionProperties } from "@/lib/notion/adapters/sopralluogo-copertura";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // TODO(auth): gate this route via proxy.ts when the auth provider is chosen.
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ ok: false, code: "bad_request", message: "Invalid JSON body" }, 400);
  }

  const parsed = coperturaSchema.safeParse(raw);
  if (!parsed.success) {
    return json(
      { ok: false, code: "validation_error", issues: flattenZod(parsed.error) },
      400,
    );
  }

  if (parsed.data.honeypot) {
    return json({ ok: true, accepted: true }, 200);
  }

  const properties = coperturaToNotionProperties(parsed.data);
  const result = await withNotionRetry(() =>
    notion().pages.create({
      parent: { database_id: coperturaFormConfig.databaseId },
      properties,
    }),
  );

  if (!result.ok) {
    return json(
      {
        ok: false,
        code: result.outcome.code,
        message: result.outcome.message,
      },
      result.outcome.retriable ? 503 : 502,
    );
  }

  return json(
    {
      ok: true,
      pageId: result.value.id,
      pageUrl: "url" in result.value ? result.value.url : null,
    },
    201,
  );
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function flattenZod(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}
