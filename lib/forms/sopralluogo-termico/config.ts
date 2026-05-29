export const termicoFormConfig = {
  slug: "sopralluogo-termico" as const,
  databaseLabel: "Schede S. Termico",
  titlePropertyName: "Nome e Cognome Cliente",
  pagePath: "/sopralluogo-termico",
  apiPath: "/api/leads/sopralluogo-termico",
  ui: {
    title: "Sopralluogo Termico",
    subtitle:
      "Carica i dati del primo sopralluogo per ottenere il preventivo dal BackOffice.",
    submitLabel: "Salva sopralluogo",
    successMessage: "Scheda salvata.",
  },
} as const;
