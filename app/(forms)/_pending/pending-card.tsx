import Link from "next/link";
import { Card, CardSection } from "@/components/ui/card";

interface PendingCardProps {
  fieldCount: number;
  notionDb: string;
  branchingNote?: string;
}

export function PendingCard({ fieldCount, notionDb, branchingNote }: PendingCardProps) {
  return (
    <Card>
      <CardSection title="Modulo in preparazione">
        <p className="text-[14px] leading-6 text-fg-muted">
          Lo schema del database Notion <span className="font-medium text-fg">{notionDb}</span>{" "}
          contiene circa <span className="font-medium text-fg">{fieldCount}</span> campi.
          Stiamo aspettando la conferma dal cliente su quali campi devono essere
          inclusi nel modulo pubblico e su chi lo compila.
        </p>
        {branchingNote && (
          <p className="mt-3 rounded-[10px] border border-border bg-surface-muted px-4 py-3 text-[13.5px] leading-5 text-fg-muted">
            {branchingNote}
          </p>
        )}
        <ul className="mt-5 space-y-2 text-[13.5px] leading-5 text-fg-muted">
          <li className="flex items-start gap-2">
            <span aria-hidden className="mt-1.5 inline-block size-1 rounded-full bg-fg-subtle" />
            Backend (Zod schema, adapter, route hardened con retry su 429): pronto a essere generato come per il CRM una volta confermati i campi.
          </li>
          <li className="flex items-start gap-2">
            <span aria-hidden className="mt-1.5 inline-block size-1 rounded-full bg-fg-subtle" />
            UI: questa pagina. Aggiunta dopo conferma dei campi obbligatori vs opzionali.
          </li>
          <li className="flex items-start gap-2">
            <span aria-hidden className="mt-1.5 inline-block size-1 rounded-full bg-fg-subtle" />
            Upload foto: richiede storage esterno (es. Vercel Blob) prima di poter salvare i file su Notion. Da decidere.
          </li>
        </ul>
        <div className="mt-7">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary hover:underline underline-offset-2"
          >
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Torna ai moduli
          </Link>
        </div>
      </CardSection>
    </Card>
  );
}
