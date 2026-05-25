export const fotovoltaicoFormConfig = {
  slug: "sopralluogo-fotovoltaico" as const,
  databaseId: "b8a6ff37-5208-45ea-ac56-70a42e59fde7",
  databaseLabel: "Schede S. Fotovoltaico",
  titlePropertyName: "Nome e Cognome Cliente",
  pagePath: "/sopralluogo-fotovoltaico",
  apiPath: "/api/leads/sopralluogo-fotovoltaico",
  ui: {
    title: "Sopralluogo Fotovoltaico",
    subtitle:
      "Carica i dati del primo sopralluogo per ottenere il preventivo dal BackOffice.",
    submitLabel: "Salva sopralluogo",
    successMessage: "Scheda salvata.",
  },
} as const;
