export const coperturaFormConfig = {
  slug: "sopralluogo-copertura" as const,
  databaseId: "17a76cd0-4b67-80cc-93dd-f5e395bc9380",
  databaseLabel: "Scheda Sopralluogo Copertura",
  titlePropertyName: "Nome e cognome Cliente",
  pagePath: "/sopralluogo-copertura",
  apiPath: "/api/leads/sopralluogo-copertura",
  ui: {
    title: "Sopralluogo Copertura",
    subtitle:
      "Scheda tecnica della copertura: materiali, accessibilità, sicurezza, presenza di amianto.",
    submitLabel: "Salva sopralluogo",
    successMessage: "Scheda salvata.",
  },
} as const;
