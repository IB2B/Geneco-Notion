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
  notionDbCrm: () => required("NOTION_DB_CRM"),
  notionDbFotovoltaico: () => required("NOTION_DB_FOTOVOLTAICO"),
  notionDbTermico: () => required("NOTION_DB_TERMICO"),
  notionDbCopertura: () => required("NOTION_DB_COPERTURA"),
};
