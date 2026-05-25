import { FormShell } from "@/components/form/form-shell";
import { FotovoltaicoForm } from "./fotovoltaico-form";
import { fotovoltaicoFormConfig } from "@/lib/forms/sopralluogo-fotovoltaico/config";

export const metadata = {
  title: "Sopralluogo Fotovoltaico — Geneco",
};

export default function SopralluogoFotovoltaicoPage() {
  return (
    <FormShell
      title={fotovoltaicoFormConfig.ui.title}
      subtitle={fotovoltaicoFormConfig.ui.subtitle}
    >
      <FotovoltaicoForm />
    </FormShell>
  );
}
