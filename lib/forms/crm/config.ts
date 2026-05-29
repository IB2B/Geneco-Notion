export const crmFormConfig = {
  slug: "crm" as const,
  databaseLabel: "CRM",
  titlePropertyName: "Nome e Cognome",
  pagePath: "/crm",
  apiPath: "/api/leads/crm",
  ui: {
    title: "Anagrafica cliente / lead CRM",
    subtitle: "Inserisci i dati anagrafici del cliente o del lead.",
    submitLabel: "Salva nel CRM",
    successMessage: "Lead salvato correttamente.",
  },
} as const;
