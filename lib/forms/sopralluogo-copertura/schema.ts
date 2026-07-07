// Sopralluogo Copertura — derived from the destination Notion DB schema
// (DB 17a76cd0-4b67-80cc-93dd-f5e395bc9380, "Scheda Sopralluogo Copertura")
// since no Tally form exists for this sopralluogo (the existing flow uses a
// Notion native form embedded inside the workspace). Field list is a
// conservative subset of writable DB properties; the client should review
// and tell us which to add/remove.

import { z } from "zod";

// Re-use the Sopralluogo Termico commerciale list — Copertura DB doesn't
// have a Tally-source dropdown so this is the same staff roster.
export const COMMERCIALE_COPERTURA = [
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
  "Vivaldo Giorgia",
  "Launova Andrea",
  "Colla Stefano",
  "Carraro Ferruccio",
  "Menescalchi Maurizio Massimo",
  "Luise Diego",
  "Buscemi Marco",
  "Delle Donne Sagar",
  "Cifarelli Tonino",
  "Covato Manuel",
  "Malagutti Gabriele",
  "Crestanello Andrea",
  "Del Sordo Corrado",
  "Frigerio Giordano",
  "Direzionale",
  "Daniele Tuffanelli",
  "Cannizzaro Alessio",
  "Mormandi Leonardo",
  "Tuzza Erik",
  "Colombo Luca",
] as const;

export const TIPOLOGIA_EDIFICIO_COPERTURA = [
  "Civile grande",
  "Civile piccola",
  "Rurale",
  "Commerciale",
  "Industriale",
  "Pubblico",
] as const;

export const TIPOLOGIA_DELLA_COPERTURA = [
  "Copertura piana",
  "Copertura a falda",
  "Copertura a volta",
  "Copertura a coppelle",
  "Copertura a Shed",
] as const;

export const STATO_CONSERVAZIONE = ["Buona", "Discreta", "Scadente"] as const;

export const STRUTTURA_PORTANTE = [
  "Tegoli in C.A.P.",
  "Latero/Cemento",
  "Carpenteria metallica / Legno",
  "Grecate autoportanti",
  "Soletta Generica",
  "Da valutare",
] as const;

export const MATERIALE_COPERTURA_ESISTENTE = [
  "Amianto/Cemento",
  "Fibrocemento ecologico",
  "Grecata",
  "Sandwich",
  "Guaina",
  "Sovracopertura Metallica",
  "Controsoffitto",
  "Presenza di Lana coibentante",
  "Da valutare",
] as const;

export const TIPOLOGIA_INTERVENTO = [
  "Smaltimento eternit (solo in caso di tetto in Amianto)",
  "Smaltimento fibrocemento",
  "Sovracopertura",
  "Copertura",
  "Da valutare",
] as const;

export const TIPOLOGIA_NUOVA_COPERTURA = [
  "Pannello Sandwich",
  "Lastra Greca singola",
  "Da valutare",
] as const;

export const SUPPORTI_NUOVA_COPERTURA = [
  "Listelli di legno",
  "Omega Metallici",
  "Piedini telescopici",
  "Da valutare",
] as const;

export const SPESSORE_PANNELLO_SANDWICH = [
  "1cm",
  "3cm",
  "4cm",
  "10cm",
  "12cm (65%)",
  "L. 4cm + lam 8/10",
  "L. 8cm + lam 8/10",
  "L. 12cm + lam 8/10",
  "L. 20cm (65%) + lam 8/10",
  "Da valutare",
] as const;

export const LATTONERIA = [
  "Da mantenere",
  "Colmi/scossaline",
  "Gronde",
  "Cappellotti",
  "Pluviali",
] as const;

export const TIPO_ISOLAMENTO = [
  "PIR",
  "PUR",
  "Lana di vetro",
  "Lana di roccia",
  "Da Valutare",
] as const;

export const MATERIALE_LUCERNARI = ["Policarbonato", "Vetroresina", "Da valutare"] as const;

export const TIPOLOGIA_PUNTI_LUCE = [
  "Solatube",
  "Fissi con basamento in acciaio zincato isolato",
  "Aperture elettriche",
  "Aperture manuali",
  "E.F.C.",
  "Da valutare",
] as const;

export const ACCESSIBILITA_MEZZI = ["Buona", "Discreta", "Scadente"] as const;

export const OPERE_PROVVISIONALI_COPERTURA = [
  "Parapetti",
  "Ponteggio",
  "Reti anticaduta",
  "Linea vita provvisoria",
  "Da valutare",
] as const;

export const DISPONIBILITA = [
  "Corrente elettrica",
  "Acqua",
  "Servizi igenici",
  "Stoccaggio materiale",
] as const;

export const SI_NO = ["Si", "No"] as const;
export const SI_NO_DA_VERIFICARE = ["Si", "No", "Da verificare"] as const;

// ============================================================================

function isFullName(value: string): boolean {
  return /\S\s+\S/.test(value.trim());
}

const optionalText = (max = 1000) => z.string().trim().max(max).optional().or(z.literal(""));
const optionalNumber = z.number().int().min(0).max(1_000_000).optional();

const uploadedFile = z.object({
  fileUploadId: z.string().uuid(),
  filename: z.string().min(1).max(300),
});
const uploadList = z.array(uploadedFile).max(20).optional();

export const coperturaSchema = z
  .object({
    // Step 1
    commerciale: z.enum(COMMERCIALE_COPERTURA, {
      message: "Seleziona il commerciale",
    }),
    // Step 2
    nomeCognomeCliente: z
      .string()
      .trim()
      .min(2, "Inserisci nome e cognome")
      .max(120)
      .refine(isFullName, "Inserisci nome e cognome completi"),

    // Step 3 — Edificio + copertura
    tipologiaEdificio: z.enum(TIPOLOGIA_EDIFICIO_COPERTURA, {
      message: "Seleziona la tipologia edificio",
    }),
    tipologiaDellaCopertura: z.enum(TIPOLOGIA_DELLA_COPERTURA, {
      message: "Seleziona la tipologia della copertura",
    }),
    mqCopertura: z.number().int().min(0).max(99999, "Valore troppo alto"),
    altezzaPianoCalpestio: optionalNumber,
    statoConservazione: z.enum(STATO_CONSERVAZIONE, {
      message: "Seleziona lo stato di conservazione",
    }),
    strutturaPortante: z.array(z.enum(STRUTTURA_PORTANTE)).min(1, "Seleziona la struttura"),
    materialeCoperturaEsistente: z
      .array(z.enum(MATERIALE_COPERTURA_ESISTENTE))
      .min(1, "Seleziona il materiale"),
    materialeInterno: optionalText(200),
    materialeEsterno: optionalText(200),

    // Intervento
    tipologiaIntervento: z.array(z.enum(TIPOLOGIA_INTERVENTO)).optional(),
    tipologiaNuovaCopertura: z.array(z.enum(TIPOLOGIA_NUOVA_COPERTURA)).optional(),
    supportiNuovaCopertura: z.array(z.enum(SUPPORTI_NUOVA_COPERTURA)).optional(),
    spessorePannelloSandwich: z.array(z.enum(SPESSORE_PANNELLO_SANDWICH)).optional(),
    lattoneria: z.array(z.enum(LATTONERIA)).optional(),

    // Coibentazione + amianto
    tipologiaLanaCoibentante: z.array(z.enum(SI_NO_DA_VERIFICARE)).optional(),
    presenzaControsoffittoAmianto: z.array(z.enum(SI_NO_DA_VERIFICARE)).optional(),
    tipoIsolamento: z.array(z.enum(TIPO_ISOLAMENTO)).optional(),

    // Lucernari + punti luce
    presenzaLucernari: z.enum(SI_NO, { message: "Indica presenza lucernari" }),
    materialeLucernari: z.array(z.enum(MATERIALE_LUCERNARI)).optional(),
    tipologiaPuntiLuce: z.array(z.enum(TIPOLOGIA_PUNTI_LUCE)).optional(),

    // Sotto-copertura + soletta
    edificioRiscaldato: z.enum(SI_NO, { message: "Indica se l'edificio sottostante è riscaldato" }),
    solettaPedonabile: z.enum(SI_NO, { message: "Indica se la soletta è pedonabile" }),
    presenzaPluviali: z.array(z.enum(SI_NO)).optional(),
    presenzaParapetti: z.array(z.enum(SI_NO)).optional(),

    // Accesso + sicurezza
    presenzaLineaVita: z.enum(SI_NO, { message: "Indica presenza linea vita" }),
    accessoCopertura: z.array(z.enum(SI_NO)).optional(),
    specificaMetodoAccesso: optionalText(300),
    accessibilitaMezzi: z.array(z.enum(ACCESSIBILITA_MEZZI)).optional(),
    opereProvvisionali: z.array(z.enum(OPERE_PROVVISIONALI_COPERTURA)).optional(),
    praticaPaesaggistica: z.array(z.enum(SI_NO)).optional(),

    // Benefici fiscali + disponibilità
    bandoAmianto: z.array(z.enum(SI_NO)).optional(),
    detrazioniFiscali: z.array(z.enum(SI_NO)).optional(),
    disponibilita: z.array(z.enum(DISPONIBILITA)).optional(),

    // Note
    noteAggiuntive: optionalText(2000),

    // Allegati
    uploadInternoCopertura: uploadList,
    uploadEsternoCopertura: uploadList,
    uploadParetiEsterneEdificio: uploadList,
    uploadAreaEsternaEdificio: uploadList,

    // honeypot
    honeypot: z.string().optional(),
  })
  .strict();

export type CoperturaFormInput = z.infer<typeof coperturaSchema>;
