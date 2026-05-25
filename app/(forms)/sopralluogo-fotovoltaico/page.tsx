import { FormShell } from "@/components/form/form-shell";
import { PendingCard } from "../_pending/pending-card";

export const metadata = {
  title: "Sopralluogo Fotovoltaico — Iniziativenergetiche",
};

export default function SopralluogoFotovoltaicoPage() {
  return (
    <FormShell
      eyebrow="Sopralluogo · Bozza"
      title="Sopralluogo Fotovoltaico"
      subtitle="Scheda tecnica del sopralluogo per impianto fotovoltaico. Destinazione: database Schede S. Fotovoltaico su Notion."
    >
      <PendingCard fieldCount={50} notionDb="Schede S. Fotovoltaico" />
    </FormShell>
  );
}
