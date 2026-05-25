import { z } from "zod";

// ============================================================================
// Option lists (Tally form 3EPrvN)
// ============================================================================

export const COMMERCIALE_TERMICO = [
  "Petteni Diego",
  "Bazzo Davide",
  "Colombo Barbara",
  "Contini Andrea",
  "Dedè Ruggero",
  "Dell'Oro Giancarlo",
  "Emar srl",
  "Gervasoni Michele",
  "Latella Fabio",
  "Lezzi Christian",
  "Magnani Massimo",
  "Morabito Karim",
  "Noè Alberto",
  "Pinato Fabio",
  "Podetti Luca",
  "Ramponi Marco",
  "Ravaioli Claudio",
  "Rossi Marco",
  "Olivieri Rodolfo",
  "Kreslikova Zuzana",
  "Perregrini Pamela",
  "Vivaldo Giorgia",
  "Launova Andrea",
  "Rosso Niccolò",
  "Colla Stefano",
  "Carraro Ferruccio",
  "Menescalchi Maurizio Massimo",
  "Luise Diego",
  "Buscemi Marco",
  "Delle Donne Sagar",
  "Cifarelli Tonino",
  "Covato Manuel",
  "Malagutti Gabriele",
  "Luigi Littamè",
  "Crestanello Andrea",
  "Del Sordo Corrado",
  "Frigerio Giordano",
  "Iemma Riccardo Umberto",
  "Merlini Giuseppe",
  "Oggianu Mario (mirko leone)",
  "Piscitelli Domenico",
  "Rebosio Mauro",
  "Reverberi Luca",
  "Rosso Diego",
  "Sguaitzer Nicola",
  "Tuzza Erik",
  "Gregori Cristina",
  "Zani Giovanni",
  "Carpanelli Alberto",
  "Raeli Davide",
  "Lucini Maurizio",
  "Diliddo Fabio",
  "Direzionale",
  "Daniele Tuffanelli",
  "Cannizzaro Alessio",
  "Gadda Felice",
  "Cornolti Fabrizio",
  "Papeo Stefano",
  "Risi Pieritalo",
  "Colombo Luca",
  "Moles Chiara",
  "Spatafora Martina",
  "Mormandi Leonardo",
] as const;

export const TIPO_EDIFICIO_TERMICO = [
  "Casa singola",
  "A Schiera",
  "Condominio",
  "Capannone",
  "Ufficio",
] as const;

export const INTERVENTI_MIGLIORATIVI = [
  "Cappotto",
  "Serramenti",
  "Isolamento Solaio",
  "Isolamento Tetto",
  "Nessun intervento",
] as const;

export const SI_NO = ["Si", "No"] as const;

export const COMBUSTIBILE_CALDAIA = [
  "Metano",
  "GPL",
  "Legna",
  "Pellet",
  "Gasolio",
  "Da installare",
] as const;

export const SISTEMA_EMISSIONE = [
  "Radiatori",
  "Fan Coil",
  "Radiante a Pavimento/Soffitto",
] as const;

export const MATERIALE_RADIATORI = ["Ghisa", "Alluminio", "Acciaio", "Non presenti"] as const;

export const TIPOLOGIA_GEN_2 = ["Camino", "Stufa", "Caldaia", "Non presente"] as const;

export const BOILER_ELETTRICO = ["Uso parziale", "Uso totale", "Non presente"] as const;

// ============================================================================
// Helpers
// ============================================================================

function isFullName(value: string): boolean {
  return /\S\s+\S/.test(value.trim());
}

const optionalText = (max = 1000) => z.string().trim().max(max).optional().or(z.literal(""));
const optionalNumber = z.number().int().min(0).max(1_000_000).optional();
const optionalSignedNumber = z.number().int().min(-50).max(100).optional();

// ============================================================================
// Schema — 3 wizard steps mirroring Tally 3EPrvN (page 4 is the thank-you)
// ============================================================================

export const termicoSchema = z
  .object({
    // Step 1
    commerciale: z.enum(COMMERCIALE_TERMICO, {
      message: "Seleziona il commerciale",
    }),
    // Step 2
    nomeCognomeCliente: z
      .string()
      .trim()
      .min(2, "Inserisci nome e cognome")
      .max(120, "Massimo 120 caratteri")
      .refine(isFullName, "Inserisci nome e cognome completi"),

    // ---- Step 3 — big technical step ----

    // Riscaldamento
    tipoEdificio: z.enum(TIPO_EDIFICIO_TERMICO, {
      message: "Indica la tipologia di edificio",
    }),
    interventiMigliorativi: z.array(z.enum(INTERVENTI_MIGLIORATIVI)).optional(),
    apeLegge10: z.enum(SI_NO, { message: "Indica APE - Legge 10" }),

    // Abitazione — Piano Terra obbligatori, altri piani opzionali
    mqPianoTerra: z.number().int().min(0).max(99999, "Valore troppo alto"),
    tempPianoTerra: z.number().int().min(-50).max(100),
    mq1Piano: optionalNumber,
    temp1Piano: optionalSignedNumber,
    mq2Piano: optionalNumber,
    temp2Piano: optionalSignedNumber,
    mq3Piano: optionalNumber,
    temp3Piano: optionalSignedNumber,

    // Locali di Servizio
    mqSeminterrato: optionalNumber,
    tempSeminterrato: optionalSignedNumber,
    mqGarage: optionalNumber,
    tempGarage: optionalSignedNumber,
    altriLocaliPresenti: z.enum(SI_NO, {
      message: "Indica se sono presenti altri locali",
    }),
    altriLocaliDescrizione: optionalText(200),
    altriLocaliMq: optionalNumber,
    altriLocaliTemp: optionalSignedNumber,

    // Acqua Calda Sanitaria
    nBagni: z.number().int().min(0).max(50),
    nResidenti: z.number().int().min(0).max(100),
    ospitiFrequenti: z.enum(SI_NO, { message: "Indica se ospiti frequenti" }),
    usoVasche: z.enum(SI_NO, { message: "Indica uso vasche" }),
    utilizzoVascheSett: optionalNumber,
    lavatriceAcs: z.enum(SI_NO, { message: "Indica se la lavatrice è ACS" }),
    nLavatriceSett: optionalNumber,
    lavastoviglieAcs: z.enum(SI_NO, { message: "Indica se la lavastoviglie è ACS" }),
    nLavastovigliaSett: optionalNumber,

    // Impianto di Riscaldamento Principale
    caldaiaMarcaModello: z.string().trim().min(2, "Inserisci marca e modello").max(200),
    condensazione: z.enum(SI_NO, { message: "Indica la condensazione" }),
    potenzaKw: z.number().int().min(0).max(100000),
    anno: z.number().int().min(1900).max(2100),
    combustibileCaldaia: z.enum(COMBUSTIBILE_CALDAIA, {
      message: "Seleziona il combustibile",
    }),
    consumoCaldaia: optionalNumber,
    sistemaEmissione: z
      .array(z.enum(SISTEMA_EMISSIONE))
      .min(1, "Seleziona almeno un sistema di emissione"),
    nRadiatori: optionalNumber,
    coperturaRadiatoriMq: optionalNumber,
    materialeRadiatori: z.array(z.enum(MATERIALE_RADIATORI)).optional(),
    nFanCoil: optionalNumber,
    coperturaFanCoilMq: optionalNumber,
    superficiePavSoffittoMq: optionalNumber,

    // Impianto di Riscaldamento Secondario
    generatoreBiomassa: z.enum(SI_NO, { message: "Indica il generatore secondario" }),
    tipologiaGen2: z.array(z.enum(TIPOLOGIA_GEN_2)).optional(),
    superficie2Gen: optionalNumber,
    consumoAnnuale2Gen: optionalNumber,

    // Energia Rinnovabile
    dispositiviRinnovabili: z.enum(SI_NO, {
      message: "Indica se ci sono dispositivi rinnovabili",
    }),
    pdcKw: optionalNumber,
    scaldacquaPdcLitri: optionalNumber,
    fotovoltaicoKwp: optionalNumber,
    nPannelliSolari: optionalNumber,
    accumuloSolare: z.enum(SI_NO, { message: "Indica accumulo solare" }),
    capacitaAccumulo: optionalNumber,

    // Centrale Termica
    centraleTermica: z.enum(SI_NO, { message: "Indica centrale termica" }),
    mqCentrale: optionalNumber,

    // Altre Informazioni
    ambientiFreddi: z.enum(SI_NO, { message: "Indica ambienti freddi" }),
    mqAmbientiFreddi: optionalNumber,
    tempAmbientiFreddi: optionalSignedNumber,
    nuoviAmbienti: z.enum(SI_NO, { message: "Indica nuovi ambienti" }),
    mqNuoviAmbienti: optionalNumber,
    nuoviAmbientiPredisposizione: z.enum(SI_NO, {
      message: "Indica predisposizione nuovi ambienti",
    }),

    // Boiler e Induzione
    induzione: z.enum(SI_NO, { message: "Indica induzione" }),
    nUtilizziInduzione: optionalNumber,
    boilerElettrico: z.enum(BOILER_ELETTRICO, { message: "Indica il boiler elettrico" }),

    // Note
    noteSopralluogo: z
      .string()
      .trim()
      .min(2, "Inserisci una nota")
      .max(2000, "Massimo 2000 caratteri"),

    // honeypot
    honeypot: z.string().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    // If altri locali = Si, then descrizione is required
    if (data.altriLocaliPresenti === "Si" && !data.altriLocaliDescrizione) {
      ctx.addIssue({
        code: "custom",
        path: ["altriLocaliDescrizione"],
        message: "Descrivi il locale aggiuntivo",
      });
    }
  });

export type TermicoFormInput = z.infer<typeof termicoSchema>;
