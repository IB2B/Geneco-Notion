import type { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import type { FotovoltaicoFormInput } from "@/lib/forms/sopralluogo-fotovoltaico/schema";
import { fotovoltaicoFormConfig } from "@/lib/forms/sopralluogo-fotovoltaico/config";

const rt = (value: string | undefined) =>
  value ? [{ type: "text" as const, text: { content: value } }] : [];

/**
 * Build the Note Appuntamento body. Bundles:
 * - free-form survey note
 * - Commerciale name (Notion DB has it as a relation; staff link manually until lookup wired)
 * - free-text overrides for "Altro" selections on Tipo Edificio / Locale Tecnico
 */
function buildNote(input: FotovoltaicoFormInput): string {
  const lines: string[] = [];
  if (input.noteSopralluogo) lines.push(input.noteSopralluogo);
  lines.push(`Commerciale: ${input.commerciale}`);
  if (input.tipoEdificio === "Altro" && input.tipoEdificioAltro) {
    lines.push(`Tipo edificio (Altro): ${input.tipoEdificioAltro}`);
  }
  if (input.localeTecnico === "Altro" && input.localeTecnicoAltro) {
    lines.push(`Locale tecnico (Altro): ${input.localeTecnicoAltro}`);
  }
  return lines.join("\n");
}

export function fotovoltaicoToNotionProperties(
  input: FotovoltaicoFormInput,
): CreatePageParameters["properties"] {
  return Object.freeze({
    [fotovoltaicoFormConfig.titlePropertyName]: {
      title: [{ type: "text", text: { content: input.nomeCognomeCliente } }],
    },
    "Mq. Copertura": { number: input.mqCopertura },
    "Tipo Edificio": { multi_select: [{ name: input.tipoEdificio }] },
    "Geometria Copertura": { select: { name: input.geometriaCopertura } },
    "Tipologia Copertura": { select: { name: input.tipologiaCopertura } },
    "Accesso al tetto": { select: { name: input.accessoTetto } },
    "Numero Piani": { number: input.numeroPiani },
    "Locale Tecnico": { select: { name: input.localeTecnico } },
    "Opere Provvisionali Sicurezza": { select: { name: input.opereProvvisionali } },
    "Linea Vita Presente": { select: { name: input.lineaVitaPresente } },
    "Certificazione Prev. Incendi": { select: { name: input.certificazioneIncendi } },
    "4 Motivi Autonomia Energetica": { rich_text: rt(input.quattroMotiviAutonomia) },
    "3 Motivi di difficoltà": { rich_text: rt(input.treMotiviDifficolta) },
    "Tetto già pronto": { rich_text: rt(input.tettoPronto) },
    "Strategia Finanziaria": { rich_text: rt(input.strategiaFinanziaria || undefined) },
    "Tempistiche accensione impianto": { rich_text: rt(input.tempisticheAttivazione) },
    "Nome Decisore": { rich_text: rt(input.nomeDecisore) },
    "Persona chiave": { rich_text: rt(input.nomePersonaChiave) },
    "Nomi collaboratori": { rich_text: rt(input.nomiCollaboratori || undefined) },
    ...(input.numeroSoci !== undefined ? { "Numero Soci": { number: input.numeroSoci } } : {}),
    ...(input.fatturato !== undefined ? { "Fatturato ": { number: input.fatturato } } : {}),
    "% di Successo": { number: Number(input.percentualeSuccesso) },
    "Note Appuntamento": { rich_text: rt(buildNote(input)) },
  });
}
