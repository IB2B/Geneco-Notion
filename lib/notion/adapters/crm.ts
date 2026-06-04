import type { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import type { CrmFormInput } from "@/lib/forms/crm/schema";
import { crmFormConfig } from "@/lib/forms/crm/config";
import { lookupCommercialeId } from "@/lib/notion/commerciali";

const rt = (value: string | undefined) =>
  value ? [{ type: "text" as const, text: { content: value } }] : [];

// Build a single rich_text block for Note Per Consulente that bundles:
// - The free-form note from the form
// - Commerciale name as fallback when we can't resolve the relation page ID
// - Nome di chi ha dato la referenza (until we wire Referenze relation lookup)
function buildNote(input: CrmFormInput, commercialeResolved: boolean): string {
  const lines: string[] = [];
  if (input.note) lines.push(input.note);
  if (!commercialeResolved) lines.push(`Commerciale: ${input.commercialeRiferimento}`);
  if (input.nomeReferenza) lines.push(`Referenza: ${input.nomeReferenza}`);
  lines.push(`Tipo contatto: ${input.tipoContatto}`);
  return lines.join("\n");
}

// Combine separate date (YYYY-MM-DD) + time (HH:mm) into ISO 8601 with local TZ offset.
// Italy is +01:00 (winter) / +02:00 (summer). For simplicity we emit naive local time
// and rely on Notion to interpret it in workspace TZ.
function toNotionDate(date: string, time: string): { start: string } {
  return { start: `${date}T${time}:00` };
}

export function crmToNotionProperties(input: CrmFormInput): CreatePageParameters["properties"] {
  const commercialeId = lookupCommercialeId(input.commercialeRiferimento);
  const props: CreatePageParameters["properties"] = Object.freeze({
    // Title — the Notion DB title is "Nome e Cognome" (the title prop).
    // We use the referente name here, matching the existing Tally→Make mapping.
    [crmFormConfig.titlePropertyName]: {
      title: [{ type: "text", text: { content: input.nomeCognomeReferente } }],
    },
    "Nome Referente": { rich_text: rt(input.nomeCognomeReferente) },
    "Ragione Sociale": { rich_text: rt(input.ragioneSociale || undefined) },
    "Sede Legale Azienda": { rich_text: rt(input.sedeLegaleAzienda || undefined) },
    "P.Iva": { rich_text: rt(input.pIva || undefined) },
    "Email": { email: input.email },
    "Numero di telefono": { phone_number: input.telefono },
    "Indirizzo": { rich_text: rt(input.indirizzoInstallazione) },
    "Città": { rich_text: rt(input.citta) },
    "CAP": { number: Number(input.cap) },
    "Nominativo Segnalatore": { select: { name: input.riferimentoSegnalatore } },
    "Data primo app": { date: toNotionDate(input.dataAppuntamento, input.oraAppuntamento) },
    // NOTE: the Notion property name has a trailing space — verified via API
    "Da Dove Arriva ": { multi_select: [{ name: input.doveCiHaConosciuto }] },
    "Impianto di interesse": {
      multi_select: (input.impiantiInteresse ?? []).map((name) => ({ name })),
    },
    ...(commercialeId
      ? { "Commerciale di riferimento": { relation: [{ id: commercialeId }] } }
      : {}),
    "Note Per Consulente": { rich_text: rt(buildNote(input, commercialeId !== null)) },
  });
  return props;
}
