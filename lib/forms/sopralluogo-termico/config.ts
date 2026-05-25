export const termicoFormConfig = {
  slug: "sopralluogo-termico" as const,
  databaseId: "b65a4836-6109-4b72-b4ea-ac729a8a8608",
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
