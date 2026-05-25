import Link from "next/link";

const forms = [
  {
    slug: "crm",
    title: "Anagrafica CRM",
    description: "Inserisci un nuovo cliente o lead nel CRM.",
    status: "ready" as const,
    accent: "primary" as const,
  },
  {
    slug: "sopralluogo-fotovoltaico",
    title: "Sopralluogo Fotovoltaico",
    description: "Scheda tecnica del sopralluogo per impianto fotovoltaico.",
    status: "draft" as const,
    accent: "amber" as const,
  },
  {
    slug: "sopralluogo-termico",
    title: "Sopralluogo Termico",
    description: "Scheda tecnica residenziale o business per impianto termico.",
    status: "draft" as const,
    accent: "amber" as const,
  },
  {
    slug: "sopralluogo-copertura",
    title: "Sopralluogo Copertura",
    description: "Scheda tecnica della copertura: materiali, accessibilità, sicurezza.",
    status: "draft" as const,
    accent: "amber" as const,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg-elevated/80 backdrop-blur supports-[backdrop-filter]:bg-bg-elevated/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="inline-flex size-6 items-center justify-center rounded-md bg-primary text-primary-fg"
            >
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 1.5L2 5l6 3.5L14 5 8 1.5z" strokeLinejoin="round" />
                <path d="M2 11l6 3.5L14 11" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="font-display text-[15px] font-semibold tracking-tight text-fg">
              Geneco
              <span className="ml-1.5 text-fg-subtle font-normal">· Iniziativenergetiche</span>
            </span>
          </div>
          <span className="text-[12.5px] text-fg-muted">
            Moduli operativi interni
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
        <section className="mb-12 max-w-2xl">
          <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-accent">
            Versione preliminare
          </p>
          <h1 className="mt-2 font-display text-[36px] font-semibold leading-[1.05] tracking-tight text-fg sm:text-[46px]">
            Moduli operativi.
            <br />
            <span className="text-primary">Sicuri.</span> Diretti su Notion.
          </h1>
          <p className="mt-5 max-w-xl text-[15.5px] leading-7 text-fg-muted">
            Sostituiscono i precedenti form Tally + Make. I dati arrivano
            direttamente nel workspace Notion del gruppo, senza passare da
            servizi esterni. Accesso riservato al personale interno.
          </p>
        </section>

        <section aria-label="Moduli disponibili" className="grid gap-4 sm:grid-cols-2">
          {forms.map((form) => (
            <FormCard key={form.slug} form={form} />
          ))}
        </section>

        <section className="mt-14 rounded-[20px] border border-border bg-surface-muted/70 px-6 py-5 sm:px-8">
          <h2 className="font-display text-[15px] font-semibold text-fg">
            Login richiesto
          </h2>
          <p className="mt-1.5 text-[13.5px] leading-5 text-fg-muted">
            Tutti i moduli saranno protetti dall&apos;accesso aziendale. In
            attesa della conferma sul provider di autenticazione (Google
            Workspace o credenziali dedicate).
          </p>
        </section>
      </main>
    </div>
  );
}

function FormCard({
  form,
}: {
  form: {
    slug: string;
    title: string;
    description: string;
    status: "ready" | "draft";
    accent: "primary" | "amber";
  };
}) {
  const ready = form.status === "ready";
  return (
    <Link
      href={`/${form.slug}`}
      className="group relative flex flex-col rounded-[18px] border border-border bg-surface p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-card)]"
    >
      <div className="mb-5 flex items-start justify-between">
        <span
          aria-hidden
          className={
            form.accent === "primary"
              ? "inline-flex size-9 items-center justify-center rounded-[10px] bg-primary-soft text-primary"
              : "inline-flex size-9 items-center justify-center rounded-[10px] bg-accent-soft text-accent"
          }
        >
          <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 4h10v12H5z" strokeLinejoin="round" />
            <path d="M7.5 8h5M7.5 11h5M7.5 14h3" strokeLinecap="round" />
          </svg>
        </span>
        <StatusPill ready={ready} />
      </div>
      <h3 className="font-display text-[18px] font-semibold leading-6 tracking-tight text-fg">
        {form.title}
      </h3>
      <p className="mt-1.5 text-[13.5px] leading-5 text-fg-muted">
        {form.description}
      </p>
      <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-primary transition-transform group-hover:translate-x-0.5">
        Apri il modulo
        <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}

function StatusPill({ ready }: { ready: boolean }) {
  if (ready) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-medium text-success">
        <span aria-hidden className="inline-block size-1.5 rounded-full bg-success" />
        Pronto
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-soft px-2 py-0.5 text-[11px] font-medium text-warning">
      <span aria-hidden className="inline-block size-1.5 rounded-full bg-warning" />
      Bozza
    </span>
  );
}
