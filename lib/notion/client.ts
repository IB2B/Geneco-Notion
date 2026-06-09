import "server-only";
import { Client } from "@notionhq/client";
import { env } from "@/lib/env";

let cached: Client | null = null;

export function notion(): Client {
  if (!cached) {
    cached = new Client({ auth: env.notionToken(), notionVersion: "2026-03-11" });
  }
  return cached;
}
