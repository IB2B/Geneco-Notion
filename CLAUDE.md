@AGENTS.md

## Local Dev Setup (once env vars are filled in)

```bash
npm install
cp .env.example .env.local            # fill in NOTION_TOKEN (Internal Integration), PREVIEW_PASSWORD, NOTION_DB_* ids
npm run dev                           # http://localhost:3000 (or 3001 if 3000 is busy)
npx tsc --noEmit && npm run lint      # before every commit (no "typecheck" script exists in package.json)
```

Re-sync form option lists from live Notion (do periodically until dynamic dropdowns ship):

```bash
node ../scripts/discovery/audit-crm.mjs  # prints current Notion select/multi_select options
# paste into lib/forms/crm/schema.ts (RIFERIMENTO_SEGNALATORE, DOVE_CI_HA_CONOSCIUTO)
```
