import type { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import type { CrmFormInput } from "@/lib/forms/crm/schema";
import { crmFormConfig } from "@/lib/forms/crm/config";
import { lookupCommercialeId, lookupCommercialeUserId } from "@/lib/notion/commerciali";
import { normalizeItalianPhone } from "@/lib/utils/phone";

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

// Combine separate date (YYYY-MM-DD) + time (HH:mm) into a Notion date value
// pinned to Europe/Rome. The form collects appointment times in the user's
// local time (Italy); without an explicit time_zone Notion interpreted the
// naive string as UTC and the stored value shifted by the CET offset on
// display. Setting time_zone makes the value DST-aware (CET in winter,
// CEST in summer) and stable regardless of viewer location.
function toNotionDate(date: string, time: string): { start: string; time_zone: string } {
  return { start: `${date}T${time}:00`, time_zone: "Europe/Rome" };
}

export function crmToNotionProperties(input: CrmFormInput): CreatePageParameters["properties"] {
  const commercialeId = lookupCommercialeId(input.commercialeRiferimento);
  const commercialeUserId = lookupCommercialeUserId(input.commercialeRiferimento);
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
    "Numero di telefono": { phone_number: normalizeItalianPhone(input.telefono) },
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
    ...(commercialeUserId
      ? { "Account Commerciale": { people: [{ id: commercialeUserId }] } }
      : {}),
    "Note Per Consulente": { rich_text: rt(buildNote(input, commercialeId !== null)) },
  });
  return props;
}
