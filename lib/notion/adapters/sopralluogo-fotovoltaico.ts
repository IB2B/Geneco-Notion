import type { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import type { FotovoltaicoFormInput } from "@/lib/forms/sopralluogo-fotovoltaico/schema";
import { fotovoltaicoFormConfig } from "@/lib/forms/sopralluogo-fotovoltaico/config";
import { lookupCommercialeId, lookupCommercialeUserId } from "@/lib/notion/commerciali";

const rt = (value: string | undefined) =>
  value ? [{ type: "text" as const, text: { content: value } }] : [];

type FileRef = { fileUploadId: string; filename: string };

function filesProp(list: ReadonlyArray<FileRef> | undefined) {
  if (!list || list.length === 0) return undefined;
  return {
    files: list.map((f) => ({
      type: "file_upload" as const,
      file_upload: { id: f.fileUploadId },
      name: f.filename,
    })),
  };
}

function addFiles(
  props: Record<string, unknown>,
  notionPropertyName: string,
  list: ReadonlyArray<FileRef> | undefined,
) {
  const v = filesProp(list);
  if (v) props[notionPropertyName] = v;
}

function buildNote(input: FotovoltaicoFormInput, commercialeResolved: boolean): string {
  const lines: string[] = [];
  if (input.noteSopralluogo) lines.push(input.noteSopralluogo);
  if (!commercialeResolved) lines.push(`Commerciale: ${input.commerciale}`);
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
  const commercialeId = lookupCommercialeId(input.commerciale);
  const commercialeUserId = lookupCommercialeUserId(input.commerciale);
  const props: Record<string, unknown> = {
    [fotovoltaicoFormConfig.titlePropertyName]: {
      title: [{ type: "text", text: { content: input.nomeCognomeCliente } }],
    },
    ...(commercialeId ? { Commerciale: { relation: [{ id: commercialeId }] } } : {}),
    ...(commercialeUserId
      ? { "Account Commerciale": { people: [{ id: commercialeUserId }] } }
      : {}),
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
    "Note Appuntamento": { rich_text: rt(buildNote(input, commercialeId !== null)) },
  };

  addFiles(props, "Bolletta", input.uploadBolletta);
  addFiles(props, "Storico Annuo", input.uploadStoricoAnnuo);
  addFiles(props, "Foto Interno Copertura", input.uploadFotoInternoCopertura);
  addFiles(props, "Foto Esterno Copertura", input.uploadFotoEsternoCopertura);
  addFiles(props, "Foto Esterni Edificio", input.uploadFotoEsterniEdificio);
  addFiles(props, "Foto Possibile Locale Tecnico", input.uploadFotoPossibileLocaleTecnico);
  addFiles(props, "Foto Quadri Elettrici", input.uploadFotoQuadriElettrici);
  addFiles(props, "Foto Contatore", input.uploadFotoContatore);
  addFiles(props, "Foto Cabina di Media", input.uploadFotoCabinaDiMedia);

  return Object.freeze(props) as CreatePageParameters["properties"];
}
