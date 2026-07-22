import { z } from "zod";

// ============================================================================
// Option lists (mirror Tally form 3qdexY)
// ============================================================================

export const COMMERCIALE_FOTOVOLTAICO = [
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
  "Penno Ivo",
  "Zurma Daniele",
  "Carpanelli Alberto",
  "Encore di Nolfi Massimo",
  "Raeli Davide",
  "Lucini Maurizio",
  "Diliddo Fabio",
  "Direzionale",
  "Tuffanelli Daniele",
  "Cannizzaro Alessio",
  "Gadda Felice",
  "Cornolti Fabrizio",
  "Papeo Stefano",
  "Risi Pieritalo",
  "Colombo Luca",
  "Moles Chiara",
  "Spatafora Martina",
  "Mormandi Leonardo",
  "Salvadore Matteo",
  "Gnuva Alberto",
  "Bellati Giuseppe",
] as const;

export const TIPO_EDIFICIO = [
  "Civile (grande costruzione)",
  "Civile (piccola costruzione)",
  "Rurale",
  "Commerciale",
  "Industriale",
  "Pubblico",
  "Altro",
] as const;

export const GEOMETRIA_COPERTURA = [
  "Piana",
  "A Falda",
  "A Volta",
  "A Coppelle",
  "A Shed",
] as const;

export const TIPOLOGIA_COPERTURA = ["Tegola", "Lamiera", "Guaina"] as const;

// Tally uses lowercase "Scala esterna"; Notion has both "Scala Esterna" and
// "Scala esterna" as duplicate options (typo). We mirror Tally exactly.
export const ACCESSO_TETTO = [
  "Velux",
  "Botole",
  "Lucernari",
  "Scala esterna",
  "Nessuno",
] as const;

export const LOCALE_TECNICO = [
  "Box",
  "Cantina",
  "Locale Tecnico",
  "Sotto-tetto",
  "Altro",
] as const;

export const OPERE_PROVVISIONALI = [
  "Parapetti",
  "Ponteggio",
  "Reti Anticaduta",
  "Linea Vita Provvisoria",
  "Non lo so",
] as const;

export const SI_NO = ["Si", "No"] as const;

export const PERCENTUALE_SUCCESSO = ["20", "40", "60", "80"] as const;

// ============================================================================
// Helpers
// ============================================================================

function isFullName(value: string): boolean {
  return /\S\s+\S/.test(value.trim());
}

const optional = (max = 300) => z.string().trim().max(max).optional().or(z.literal(""));
const optionalText = (max = 1000) => z.string().trim().max(max).optional().or(z.literal(""));

const uploadedFile = z.object({
  fileUploadId: z.string().uuid(),
  filename: z.string().min(1).max(300),
});
const uploadList = z.array(uploadedFile).max(20).optional();

// ============================================================================
// Schema — 4 wizard steps mirroring Tally 3qdexY (page 5 is the thank-you)
// ============================================================================

export const fotovoltaicoSchema = z
  .object({
    // Step 1
    commerciale: z.enum(COMMERCIALE_FOTOVOLTAICO, {
      message: "Seleziona il commerciale",
    }),
    // Step 2
    nomeCognomeCliente: z
      .string()
      .trim()
      .min(2, "Inserisci nome e cognome")
      .max(120, "Massimo 120 caratteri")
      .refine(isFullName, "Inserisci nome e cognome completi"),
    // Step 3 — dati tecnici
    mqCopertura: z
      .number({ message: "Inserisci i mq della copertura" })
      .int("Inserisci un numero intero")
      .positive("Deve essere positivo")
      .max(99999, "Valore troppo alto"),
    tipoEdificio: z.enum(TIPO_EDIFICIO, { message: "Seleziona la tipologia dell'edificio" }),
    tipoEdificioAltro: optional(200),
    geometriaCopertura: z.enum(GEOMETRIA_COPERTURA, { message: "Seleziona la geometria" }),
    tipologiaCopertura: z.enum(TIPOLOGIA_COPERTURA, { message: "Seleziona la tipologia di copertura" }),
    accessoTetto: z.enum(ACCESSO_TETTO, { message: "Seleziona l'accesso al tetto" }),
    numeroPiani: z
      .number({ message: "Inserisci il numero dei piani" })
      .int("Inserisci un numero intero")
      .min(0, "Non può essere negativo")
      .max(50, "Valore troppo alto"),
    localeTecnico: z.enum(LOCALE_TECNICO, { message: "Seleziona il locale tecnico" }),
    localeTecnicoAltro: optional(200),
    opereProvvisionali: z.enum(OPERE_PROVVISIONALI, { message: "Seleziona le opere provvisionali" }),
    lineaVitaPresente: z.enum(SI_NO, { message: "Indica se la linea vita è presente" }),
    certificazioneIncendi: z.enum(SI_NO, { message: "Indica la certificazione prevenzione incendi" }),
    noteSopralluogo: optionalText(2000),
    // Step 4 — qualificazione
    quattroMotiviAutonomia: z
      .string()
      .trim()
      .min(10, "Descrivi i quattro motivi")
      .max(2000, "Massimo 2000 caratteri"),
    treMotiviDifficolta: z
      .string()
      .trim()
      .min(10, "Descrivi i tre motivi")
      .max(2000, "Massimo 2000 caratteri"),
    tettoPronto: z
      .string()
      .trim()
      .min(2, "Compila questo campo")
      .max(500, "Massimo 500 caratteri"),
    strategiaFinanziaria: optional(500),
    tempisticheAttivazione: z
      .string()
      .trim()
      .min(2, "Inserisci la tempistica")
      .max(200, "Massimo 200 caratteri"),
    nomeDecisore: z
      .string()
      .trim()
      .min(2, "Inserisci il nome del decisore")
      .max(120, "Massimo 120 caratteri"),
    nomePersonaChiave: z
      .string()
      .trim()
      .min(2, "Inserisci la persona chiave")
      .max(120, "Massimo 120 caratteri"),
    nomiCollaboratori: optionalText(500),
    numeroSoci: z.number().int().min(0).max(10000).optional(),
    fatturato: z.number().int().min(0).max(1_000_000_000).optional(),
    percentualeSuccesso: z.enum(PERCENTUALE_SUCCESSO, {
      message: "Seleziona la percentuale di successo",
    }),
    // Allegati (Step 4) — ogni campo è opzionale, può contenere più file.
    uploadBolletta: uploadList,
    uploadStoricoAnnuo: uploadList,
    uploadFotoInternoCopertura: uploadList,
    uploadFotoEsternoCopertura: uploadList,
    uploadFotoEsterniEdificio: uploadList,
    uploadFotoPossibileLocaleTecnico: uploadList,
    uploadFotoQuadriElettrici: uploadList,
    uploadFotoContatore: uploadList,
    uploadFotoCabinaDiMedia: uploadList,
    // honeypot
    honeypot: z.string().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.tipoEdificio === "Altro" && !data.tipoEdificioAltro) {
      ctx.addIssue({
        code: "custom",
        path: ["tipoEdificioAltro"],
        message: "Specifica la tipologia di edificio",
      });
    }
    if (data.localeTecnico === "Altro" && !data.localeTecnicoAltro) {
      ctx.addIssue({
        code: "custom",
        path: ["localeTecnicoAltro"],
        message: "Specifica il locale tecnico",
      });
    }
  });

export type FotovoltaicoFormInput = z.infer<typeof fotovoltaicoSchema>;
