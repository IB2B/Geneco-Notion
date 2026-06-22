import { z } from "zod";

// ============================================================================
// Option lists — synced from the live Notion CRM DB select/multi_select options
// (run scripts/discovery/audit-crm.mjs to re-extract). Re-sync if Notion's
// option list shifts. Names must match Notion's exactly — case + spacing — or
// the API will silently auto-create polluted duplicates.
// ============================================================================

export const RIFERIMENTO_SEGNALATORE = [
  "Chiara Moles",
  "Launova Andrea",
  "Manuel Covato",
  "Gabriele Malagutti",
  "Lucini Maurizio",
  "Del Sordo Corrado",
  "Moresca De Luca",
  "Ravaioli Claudio",
  "Roberta Ciccotti",
  "Vitalici di Gregori Cristina",
  "Tonino Cifarelli",
  "Zani Giovanni",
  "Crestanello Andrea",
  "Sguaitzer Nicola",
  "Tuzza Erik",
  "Frigerio Giordano",
  "Daniele Tuffanelli",
  "Alessio Cannizzaro",
  "Alice Farella Monti",
  "Rosa Casella",
  "Restructura",
  "Felice Gadda",
  "Delle Donne Sagar",
  "Carraro Ferruccio",
  "Luise Diego",
  "Direzionale",
  "Malagutti Gabriele",
  "Cifarelli Tonino",
  "Nessun Segnalatore",
  "Studio Prosperi Snc",
  "Petteni Diego",
  "Risi Pieritalo",
  "Colombo Luca",
  "Rosso Diego",
  "Martina Spatafora",
] as const;

export const COMMERCIALE_RIFERIMENTO = [
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
  "Covato Manuel",
  "Cifarelli Tonino",
  "Crestanello Andrea",
  "Del Sordo Corrado",
  "Frigerio Giordano",
  "Delle Donne Sagar",
  "Oggianu Mario (mirko leone)",
  "Piscitelli Domenico",
  "Rebosio Mauro",
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
  "Gabriele Malagutti",
  "Direzionale",
  "Tuffanelli Daniele",
  "Cannizzaro Alessio",
  "Gadda Felice",
  "Papeo Stefano",
  "Risi Pieritalo",
  "Colombo Luca",
  "Moles Chiara",
  "Spatafora Martina",
  "Mormandi Leonardo",
] as const;

export const IMPIANTI_INTERESSE = [
  "Impianto Fotovoltaico",
  "Impianto Termico",
  "Mobilità elettrica (colonnine)",
  "Rimozione amianto",
  "Batterie",
] as const;

export const DOVE_CI_HA_CONOSCIUTO = [
  "Contatto Porta a Porta",
  "Sito",
  "Referenza del consulente",
  "Referenziato da cliente",
  "Advisor/Foto",
  "Turbo pubblicità",
  "CER Comuni",
  "Lista Costruttori",
  "Fiere",
  "Eventi sul territorio",
  "Lista Advisor",
  "Social",
  "Lista Aziende",
  "Bigliettini tappetista",
  "Lista Architetti",
  "Foto/Cliente",
  "Social FB",
  "Lista Geometri",
  "Lista Ingegneri",
  "Social IG",
  "Social TikTok",
  "La Termotecnica",
  "Campagna Lead Google",
  "Cliente esistente",
  "Campagna Lead Meta",
  "Call inbound",
  "Offerte non finalizzate",
  "Riccardo Zampini",
  "General Contractor",
  "Lista Lab",
  "Energia Cer-ta",
  "Bando Amianto",
  "Whatsapp",
  "Newsletter",
  "Lead GG",
  "Lead IE",
  "fotovoltaico.it",
] as const;

export const REFERENZA_TRIGGERS: ReadonlyArray<(typeof DOVE_CI_HA_CONOSCIUTO)[number]> = [
  "Referenziato da cliente",
];

export const TIPO_CONTATTO = ["Privato", "Azienda"] as const;
export type TipoContatto = (typeof TIPO_CONTATTO)[number];

// ============================================================================
// Validation helpers
// ============================================================================

/**
 * Validate the Italian P.IVA (Partita IVA) using the official checksum algorithm.
 * 11 digits where the last is a check digit computed with Luhn-like odd/even doubling.
 */
export function isValidPIva(value: string): boolean {
  if (!/^\d{11}$/.test(value)) return false;
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    let n = Number.parseInt(value[i]!, 10);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

/** Strip phone formatting (spaces, dashes, dots, parentheses) and keep digits + optional leading +. */
function normalisePhone(value: string): string {
  return value.replace(/[\s\-.() ]/g, "");
}

/** Italian (or international) phone: optional leading +, then 6–15 digits. */
function isValidPhone(value: string): boolean {
  const stripped = normalisePhone(value);
  return /^\+?\d{6,15}$/.test(stripped);
}

/** Two words minimum, separated by whitespace. Used for full names. */
function isFullName(value: string): boolean {
  return /\S\s+\S/.test(value.trim());
}

/** Date string (YYYY-MM-DD) is today or in the future, in local time. */
function isFutureDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map((s) => Number.parseInt(s, 10));
  const candidate = new Date(y!, m! - 1, d!);
  if (Number.isNaN(candidate.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return candidate.getTime() >= today.getTime();
}

const optional = (max = 300) => z.string().trim().max(max).optional().or(z.literal(""));

// ============================================================================
// Schema
// ============================================================================

export const crmFormSchema = z
  .object({
    // Step 1
    riferimentoSegnalatore: z.enum(RIFERIMENTO_SEGNALATORE, {
      message: "Seleziona il segnalatore",
    }),
    // Step 2
    tipoContatto: z.enum(TIPO_CONTATTO, {
      message: "Seleziona Privato o Azienda",
    }),
    // Step 3
    nomeCognomeReferente: z
      .string()
      .trim()
      .min(2, "Inserisci nome e cognome")
      .max(120, "Massimo 120 caratteri")
      .refine(isFullName, "Inserisci nome e cognome completi (almeno due parole)"),
    ragioneSociale: optional(200),
    sedeLegaleAzienda: optional(300),
    pIva: optional(20),
    // Step 4
    email: z
      .string()
      .trim()
      .min(1, "Inserisci la mail del cliente")
      .email("Inserisci un'email valida")
      .max(200, "Massimo 200 caratteri"),
    // Step 5
    telefono: z
      .string()
      .trim()
      .min(1, "Inserisci il numero di telefono")
      .max(30, "Numero di telefono troppo lungo")
      .refine(isValidPhone, "Numero di telefono non valido (solo cifre, eventuale prefisso +)"),
    // Step 6
    indirizzoInstallazione: z
      .string()
      .trim()
      .min(2, "Inserisci l'indirizzo")
      .max(300, "Massimo 300 caratteri"),
    citta: z
      .string()
      .trim()
      .min(2, "Inserisci la città")
      .max(120, "Massimo 120 caratteri")
      .regex(/^[\p{L}\s'’\-]+$/u, "La città può contenere solo lettere, spazi e apostrofi"),
    cap: z
      .string()
      .trim()
      .regex(/^\d{5}$/, "Il CAP deve essere di 5 cifre")
      .refine(
        (v) => {
          const n = Number.parseInt(v, 10);
          return n >= 10 && n <= 99999;
        },
        "CAP non valido",
      ),
    // Step 7
    commercialeRiferimento: z.enum(COMMERCIALE_RIFERIMENTO, {
      message: "Seleziona il commerciale di riferimento",
    }),
    // Step 8
    dataAppuntamento: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Data non valida (formato AAAA-MM-GG)")
      .refine(isFutureDate, "La data dell'appuntamento deve essere oggi o futura"),
    oraAppuntamento: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Ora non valida (formato HH:mm)"),
    // Step 9 — multi-select, optional
    impiantiInteresse: z.array(z.enum(IMPIANTI_INTERESSE)).optional(),
    // Step 10
    note: optional(1000),
    // Step 11
    doveCiHaConosciuto: z.enum(DOVE_CI_HA_CONOSCIUTO, {
      message: "Seleziona la provenienza del contatto",
    }),
    nomeReferenza: optional(120),
    // honeypot
    honeypot: z.string().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    // Azienda branch: ragione sociale, sede legale, P.IVA all required + P.IVA checksum
    if (data.tipoContatto === "Azienda") {
      if (!data.ragioneSociale)
        ctx.addIssue({
          code: "custom",
          path: ["ragioneSociale"],
          message: "Obbligatorio per Azienda",
        });
      if (!data.sedeLegaleAzienda)
        ctx.addIssue({
          code: "custom",
          path: ["sedeLegaleAzienda"],
          message: "Obbligatorio per Azienda",
        });
      if (!data.pIva) {
        ctx.addIssue({
          code: "custom",
          path: ["pIva"],
          message: "Obbligatorio per Azienda",
        });
      } else if (!/^\d{11}$/.test(data.pIva)) {
        ctx.addIssue({
          code: "custom",
          path: ["pIva"],
          message: "La P.IVA deve essere di 11 cifre",
        });
      } else if (!isValidPIva(data.pIva)) {
        ctx.addIssue({
          code: "custom",
          path: ["pIva"],
          message: "P.IVA non valida (checksum errato)",
        });
      }
    }
    // Referenza name required when "Referenziato da cliente" is chosen
    if (REFERENZA_TRIGGERS.includes(data.doveCiHaConosciuto)) {
      if (!data.nomeReferenza) {
        ctx.addIssue({
          code: "custom",
          path: ["nomeReferenza"],
          message: "Indica chi ha dato la referenza",
        });
      } else if (!isFullName(data.nomeReferenza)) {
        ctx.addIssue({
          code: "custom",
          path: ["nomeReferenza"],
          message: "Inserisci nome e cognome completi",
        });
      }
    }
  });

export type CrmFormInput = z.infer<typeof crmFormSchema>;
