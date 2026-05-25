export const crmFormConfig = {
  slug: "crm" as const,
  databaseId: "93928311-758d-471e-8e93-162195062f5b",
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
