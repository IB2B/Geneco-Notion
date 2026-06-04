import type { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import type { CoperturaFormInput } from "@/lib/forms/sopralluogo-copertura/schema";
import { coperturaFormConfig } from "@/lib/forms/sopralluogo-copertura/config";
import { lookupCommercialeUserId } from "@/lib/notion/commerciali";

const rt = (value: string | undefined) =>
  value ? [{ type: "text" as const, text: { content: value } }] : [];

function buildNote(input: CoperturaFormInput, commercialeResolved: boolean): string {
  const lines: string[] = [];
  if (input.noteAggiuntive) lines.push(input.noteAggiuntive);
  if (!commercialeResolved) lines.push(`Commerciale: ${input.commerciale}`);
  return lines.join("\n");
}

export function coperturaToNotionProperties(
  input: CoperturaFormInput,
): CreatePageParameters["properties"] {
  const commercialeUserId = lookupCommercialeUserId(input.commerciale);
  const props: Record<string, unknown> = {
    [coperturaFormConfig.titlePropertyName]: {
      title: [{ type: "text", text: { content: input.nomeCognomeCliente } }],
    },
    ...(commercialeUserId
      ? { Commerciale: { people: [{ id: commercialeUserId }] } }
      : {}),

    // Edificio + copertura
    "Tipologia edificio": { multi_select: [{ name: input.tipologiaEdificio }] },
    "Tipologia della copertura": { multi_select: [{ name: input.tipologiaDellaCopertura }] },
    "Inserisci i mq della copertura": { number: input.mqCopertura },
    "Stato di conservazione copertura": { multi_select: [{ name: input.statoConservazione }] },
    "Struttura Portante": {
      multi_select: input.strutturaPortante.map((name) => ({ name })),
    },
    "Materiale copertura esistente": {
      multi_select: input.materialeCoperturaEsistente.map((name) => ({ name })),
    },

    // Intervento
    "Tipologia di copertura": {
      multi_select: (input.tipologiaIntervento ?? []).map((name) => ({ name })),
    },
    "Tipologia di nuova copertura": {
      multi_select: (input.tipologiaNuovaCopertura ?? []).map((name) => ({ name })),
    },
    "Supporti della nuova copertura": {
      multi_select: (input.supportiNuovaCopertura ?? []).map((name) => ({ name })),
    },
    "Spessore pannello Sandwich": {
      multi_select: (input.spessorePannelloSandwich ?? []).map((name) => ({ name })),
    },
    "Lattoneria": {
      multi_select: (input.lattoneria ?? []).map((name) => ({ name })),
    },

    // Coibentazione + amianto
    "Tipologia di copertura lana coibentante": {
      multi_select: (input.tipologiaLanaCoibentante ?? []).map((name) => ({ name })),
    },
    "Presenza di controsoffitto in amianto?": {
      multi_select: (input.presenzaControsoffittoAmianto ?? []).map((name) => ({ name })),
    },
    "Tipo di isolamento da preventivare": {
      multi_select: (input.tipoIsolamento ?? []).map((name) => ({ name })),
    },

    // Lucernari + punti luce
    "Presenza di lucernari": { multi_select: [{ name: input.presenzaLucernari }] },
    "Materiale dei lucernari": {
      multi_select: (input.materialeLucernari ?? []).map((name) => ({ name })),
    },
    "Tipologia punti luce": {
      multi_select: (input.tipologiaPuntiLuce ?? []).map((name) => ({ name })),
    },

    // Sotto-copertura + soletta
    "L’edificio sottostante è riscaldato?": {
      multi_select: [{ name: input.edificioRiscaldato }],
    },
    "La soletta è pedonabile?": { multi_select: [{ name: input.solettaPedonabile }] },
    "Presenza di pluviali": {
      multi_select: (input.presenzaPluviali ?? []).map((name) => ({ name })),
    },
    "Presenza di parapetti": {
      multi_select: (input.presenzaParapetti ?? []).map((name) => ({ name })),
    },

    // Accesso + sicurezza
    "Presenza di linea vita": { multi_select: [{ name: input.presenzaLineaVita }] },
    "Accesso alla copertura: (se si specificare\nmetodo di accesso)": {
      multi_select: (input.accessoCopertura ?? []).map((name) => ({ name })),
    },
    "Accessibilità ai mezzi di trasporto e viabilità (segnalare eventuali impedimenti):": {
      multi_select: (input.accessibilitaMezzi ?? []).map((name) => ({ name })),
    },
    "Opere Provvisionali di Sicurezza": {
      multi_select: (input.opereProvvisionali ?? []).map((name) => ({ name })),
    },
    "È presente una pratica paesaggistica?": {
      multi_select: (input.praticaPaesaggistica ?? []).map((name) => ({ name })),
    },

    // Benefici fiscali + disponibilità
    "Bando Amianto": {
      multi_select: (input.bandoAmianto ?? []).map((name) => ({ name })),
    },
    "Detrazioni fiscali per cliente": {
      multi_select: (input.detrazioniFiscali ?? []).map((name) => ({ name })),
    },
    "Disponibilità di:": {
      multi_select: (input.disponibilita ?? []).map((name) => ({ name })),
    },

    // Note bundle
    "Note aggiuntive": { rich_text: rt(buildNote(input, commercialeUserId !== null)) },
  };

  // Optional rich_text props
  if (input.materialeInterno) {
    props["Materiale interno"] = { rich_text: rt(input.materialeInterno) };
  }
  if (input.materialeEsterno) {
    props["Materiale esterno"] = { rich_text: rt(input.materialeEsterno) };
  }
  if (input.specificaMetodoAccesso) {
    props["Specifica il metodo di accesso"] = {
      rich_text: rt(input.specificaMetodoAccesso),
    };
  }

  if (input.altezzaPianoCalpestio !== undefined) {
    props["Altezza del piano di calpestio"] = { number: input.altezzaPianoCalpestio };
  }

  return Object.freeze(props) as CreatePageParameters["properties"];
}
