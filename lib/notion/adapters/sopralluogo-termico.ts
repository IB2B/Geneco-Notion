import type { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";
import type { TermicoFormInput } from "@/lib/forms/sopralluogo-termico/schema";
import { termicoFormConfig } from "@/lib/forms/sopralluogo-termico/config";
import { lookupCommercialeId, lookupCommercialeUserId } from "@/lib/notion/commerciali";

const rt = (value: string | undefined) =>
  value ? [{ type: "text" as const, text: { content: value } }] : [];

function num(value: number | undefined) {
  return value === undefined ? undefined : { number: value };
}

function buildNote(input: TermicoFormInput, commercialeResolved: boolean): string {
  const lines: string[] = [];
  if (input.noteSopralluogo) lines.push(input.noteSopralluogo);
  if (!commercialeResolved) lines.push(`Commerciale: ${input.commerciale}`);
  if (input.altriLocaliPresenti === "Si" && input.altriLocaliDescrizione) {
    lines.push(`Altro locale: ${input.altriLocaliDescrizione}`);
  }
  return lines.join("\n");
}

// Build the properties object, skipping any optional number keys whose value
// is undefined so Notion doesn't receive empty number cells unnecessarily.
export function termicoToNotionProperties(
  input: TermicoFormInput,
): CreatePageParameters["properties"] {
  const commercialeId = lookupCommercialeId(input.commerciale);
  const commercialeUserId = lookupCommercialeUserId(input.commerciale);
  const props: Record<string, unknown> = {
    [termicoFormConfig.titlePropertyName]: {
      title: [{ type: "text", text: { content: input.nomeCognomeCliente } }],
    },
    ...(commercialeId ? { Commerciale: { relation: [{ id: commercialeId }] } } : {}),
    ...(commercialeUserId
      ? { "Account Commerciale": { people: [{ id: commercialeUserId }] } }
      : {}),

    // Riscaldamento
    "Tipologia Edificio": { select: { name: input.tipoEdificio } },
    "Interventi Migliorativi Fatti": {
      multi_select: (input.interventiMigliorativi ?? []).map((name) => ({ name })),
    },
    "APE - Legge 10": { select: { name: input.apeLegge10 } },

    // Abitazione
    "PT(mq)": { number: input.mqPianoTerra },
    "T pt °C": { number: input.tempPianoTerra },

    // Acqua Calda Sanitaria
    "n° Bagni": { number: input.nBagni },
    "n° Residenti": { number: input.nResidenti },
    "Ospiti frequenti": { select: { name: input.ospitiFrequenti } },
    "Uso Vasche": { select: { name: input.usoVasche } },
    "Lavatrice ACS": { select: { name: input.lavatriceAcs } },
    "Lavastoviglie ACS": { select: { name: input.lavastoviglieAcs } },

    // Impianto Principale
    "Caldaia Marca e Modello": { rich_text: rt(input.caldaiaMarcaModello) },
    "Condensazione": { select: { name: input.condensazione } },
    "Potenza kW": { number: input.potenzaKw },
    "Anno": { number: input.anno },
    "Combustibile Caldaia": { select: { name: input.combustibileCaldaia } },
    "Sistema Emissione": {
      multi_select: input.sistemaEmissione.map((name) => ({ name })),
    },
    "Materiale Radiatori": {
      multi_select: (input.materialeRadiatori ?? []).map((name) => ({ name })),
    },

    // Impianto Secondario
    "Utilizzo Gen. 2° Biomassa": { select: { name: input.generatoreBiomassa } },
    "Tipologia 2° Generatore": {
      multi_select: (input.tipologiaGen2 ?? []).map((name) => ({ name })),
    },

    // Energia Rinnovabile
    "Dispositivi Rinnovabili": { select: { name: input.dispositiviRinnovabili } },
    "Accumulo Solare": { select: { name: input.accumuloSolare } },

    // Centrale Termica
    "Centrale Termica": { select: { name: input.centraleTermica } },

    // Altre Informazioni
    "Ambienti Freddi da migliorare": { select: { name: input.ambientiFreddi } },
    "Nuovi Ambienti da riscaldare": { select: { name: input.nuoviAmbienti } },
    // NOTE: trailing space in property name (Notion gotcha)
    "Nuovi Ambienti Predisposizione ?": {
      select: { name: input.nuoviAmbientiPredisposizione },
    },

    // Boiler e Induzione
    "Induzione": { select: { name: input.induzione } },
    "Boiler Elettrico": { select: { name: input.boilerElettrico } },

    // Note Appuntamento
    "Note Appuntamento": { rich_text: rt(buildNote(input, commercialeId !== null)) },
  };

  // Optional numeric properties — only include when defined
  const optionalNumbers: Record<string, number | undefined> = {
    "P1(mq)": input.mq1Piano,
    "T p1 °C": input.temp1Piano,
    "P2(mq)": input.mq2Piano,
    "T p2 °C": input.temp2Piano,
    "P3(mq)": input.mq3Piano,
    "T p3 °C": input.temp3Piano,
    "Seminterrato (mq)": input.mqSeminterrato,
    "T Seminterrato °C": input.tempSeminterrato,
    "Garage/Magazzino (mq)": input.mqGarage,
    "T Garage/Magaz °C": input.tempGarage,
    "Altro (mq)": input.altriLocaliMq,
    "T Altro locale °C": input.altriLocaliTemp,
    "Utilizzo Vasche medio Sett.": input.utilizzoVascheSett,
    "n° Lavatrice ACS Sett.": input.nLavatriceSett,
    "n° Lavastoviglie ACS Sett.": input.nLavastovigliaSett,
    "Consumo Kg o Litri (Caldaia)": input.consumoCaldaia,
    "n° Radiatori": input.nRadiatori,
    "Copertura Radiatori (mq)": input.coperturaRadiatoriMq,
    "n° Fan Coil": input.nFanCoil,
    "Copertura Fan Coil (mq)": input.coperturaFanCoilMq,
    "Superficie Radiante Pav/Soffitto (mq)": input.superficiePavSoffittoMq,
    "Superficie Riscaldata 2° Gen (mq)": input.superficie2Gen,
    "Consumo annuale kg (2°gen)": input.consumoAnnuale2Gen,
    "Pdc kW": input.pdcKw,
    "Scaldacqua Pdc (litri)": input.scaldacquaPdcLitri,
    "Fotovoltaico kWp": input.fotovoltaicoKwp,
    "n° Pannelli Solari Termici": input.nPannelliSolari,
    "Capacità Accumulo (litri)": input.capacitaAccumulo,
    "mq Netti Centrale": input.mqCentrale,
    "Ambienti Freddi (mq)": input.mqAmbientiFreddi,
    "Ambienti Freddi (t°C attuale interna)": input.tempAmbientiFreddi,
    "Nuovi Ambienti (mq) ": input.mqNuoviAmbienti, // trailing space verified
    "n° Utilizzi (Giorno) Induzione ": input.nUtilizziInduzione, // trailing space verified
  };
  for (const [key, value] of Object.entries(optionalNumbers)) {
    const wrapped = num(value);
    if (wrapped) props[key] = wrapped;
  }

  // "Descrizione Altro" rich_text only when filled
  if (input.altriLocaliPresenti === "Si" && input.altriLocaliDescrizione) {
    props["Descrizione Altro"] = { rich_text: rt(input.altriLocaliDescrizione) };
  }

  return Object.freeze(props) as CreatePageParameters["properties"];
}
