import { FormShell } from "@/components/form/form-shell";
import { TermicoForm } from "./termico-form";
import { termicoFormConfig } from "@/lib/forms/sopralluogo-termico/config";

export const metadata = {
  title: "Sopralluogo Termico — Geneco",
};

export default function SopralluogoTermicoPage() {
  return (
    <FormShell
      title={termicoFormConfig.ui.title}
      subtitle={termicoFormConfig.ui.subtitle}
    >
      <TermicoForm />
    </FormShell>
  );
}
