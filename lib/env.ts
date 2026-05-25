import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env var: ${name}. Set it in .env.local (dev) or Vercel project env (prod).`,
    );
  }
  return value;
}

export const env = {
  notionToken: () => required("NOTION_TOKEN"),
};
