import Link from "next/link";
import type { ReactNode } from "react";

interface FormShellProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
}

export function FormShell({
  eyebrow = "Modulo operativo",
  title,
  subtitle,
  backHref = "/",
  backLabel = "Indietro",
  children,
}: FormShellProps) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg-elevated/70 backdrop-blur supports-[backdrop-filter]:bg-bg-elevated/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-fg-muted transition-colors hover:text-fg"
          >
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {backLabel}
          </Link>
          <span className="font-display text-[13px] font-medium tracking-tight text-fg-muted">
            Geneco · Iniziativenergetiche
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
        <div className="mb-8">
          {eyebrow && (
            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-accent">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 font-display text-[30px] font-semibold leading-9 tracking-tight text-fg sm:text-[34px] sm:leading-10">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-xl text-[15px] leading-6 text-fg-muted">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
