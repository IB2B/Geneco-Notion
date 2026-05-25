import { FormShell } from "@/components/form/form-shell";
import { CoperturaForm } from "./copertura-form";
import { coperturaFormConfig } from "@/lib/forms/sopralluogo-copertura/config";

export const metadata = {
  title: "Sopralluogo Copertura — Geneco",
};

export default function SopralluogoCoperturaPage() {
  return (
    <FormShell
      eyebrow="Sopralluogo · Preliminare"
      title={coperturaFormConfig.ui.title}
      subtitle={coperturaFormConfig.ui.subtitle}
    >
      <CoperturaForm />
    </FormShell>
  );
}
