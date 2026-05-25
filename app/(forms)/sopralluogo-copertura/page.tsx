import { FormShell } from "@/components/form/form-shell";
import { PendingCard } from "../_pending/pending-card";

export const metadata = {
  title: "Sopralluogo Copertura — Iniziativenergetiche",
};

export default function SopralluogoCoperturaPage() {
  return (
    <FormShell
      eyebrow="Sopralluogo · Bozza"
      title="Sopralluogo Copertura"
      subtitle="Scheda tecnica della copertura: materiali, accessibilità, sicurezza, presenza di amianto. Destinazione: Scheda Sopralluogo Copertura."
    >
      <PendingCard fieldCount={60} notionDb="Scheda Sopralluogo Copertura" />
    </FormShell>
  );
}
