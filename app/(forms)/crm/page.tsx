import { FormShell } from "@/components/form/form-shell";
import { CrmForm } from "./crm-form";

export const metadata = {
  title: "Anagrafica CRM — Iniziativenergetiche",
};

export default function CrmPage() {
  return (
    <FormShell
      title="Anagrafica CRM"
      subtitle="Inserisci un nuovo cliente o lead. I dati vengono salvati direttamente nel database CRM su Notion."
    >
      <CrmForm />
    </FormShell>
  );
}
