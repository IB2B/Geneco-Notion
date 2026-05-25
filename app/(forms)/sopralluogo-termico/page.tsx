import { FormShell } from "@/components/form/form-shell";
import { PendingCard } from "../_pending/pending-card";

export const metadata = {
  title: "Sopralluogo Termico — Iniziativenergetiche",
};

export default function SopralluogoTermicoPage() {
  return (
    <FormShell
      eyebrow="Sopralluogo · Bozza"
      title="Sopralluogo Termico"
      subtitle="Scheda tecnica per impianto termico. La prima domanda chiede la tipologia (residenziale o azienda) e indirizza alla scheda corretta."
    >
      <PendingCard
        fieldCount={85}
        notionDb="Schede S. Termico / Schede S. Termico Business"
        branchingNote="Branching: la versione residenziale e quella business hanno schemi simili ma non identici. Il modulo chiederà la tipologia all'inizio e instraderà al database corretto."
      />
    </FormShell>
  );
}
