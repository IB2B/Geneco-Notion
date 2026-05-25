"use client";

import { useState, type ReactNode } from "react";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/form/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup } from "@/components/form/radio-group";
import { CheckboxGrid } from "@/components/form/checkbox-grid";
import {
  WizardProgress,
  WizardStep,
  WizardNav,
} from "@/components/form/wizard";
import {
  coperturaSchema,
  COMMERCIALE_COPERTURA,
  TIPOLOGIA_EDIFICIO_COPERTURA,
  TIPOLOGIA_DELLA_COPERTURA,
  STATO_CONSERVAZIONE,
  STRUTTURA_PORTANTE,
  MATERIALE_COPERTURA_ESISTENTE,
  TIPOLOGIA_INTERVENTO,
  TIPOLOGIA_NUOVA_COPERTURA,
  SUPPORTI_NUOVA_COPERTURA,
  SPESSORE_PANNELLO_SANDWICH,
  LATTONERIA,
  TIPO_ISOLAMENTO,
  MATERIALE_LUCERNARI,
  TIPOLOGIA_PUNTI_LUCE,
  ACCESSIBILITA_MEZZI,
  OPERE_PROVVISIONALI_COPERTURA,
  DISPONIBILITA,
  SI_NO,
  SI_NO_DA_VERIFICARE,
  type CoperturaFormInput,
} from "@/lib/forms/sopralluogo-copertura/schema";
import { coperturaFormConfig } from "@/lib/forms/sopralluogo-copertura/config";

const TOTAL_STEPS = 3;

const numberOrUndef = {
  setValueAs: (v: unknown) =>
    v === "" || v === null || v === undefined ? undefined : Number(v),
};

const STEP_FIELDS: ReadonlyArray<FieldPath<CoperturaFormInput>[]> = [
  ["commerciale"],
  ["nomeCognomeCliente"],
  [
    "tipologiaEdificio",
    "tipologiaDellaCopertura",
    "mqCopertura",
    "altezzaPianoCalpestio",
    "statoConservazione",
    "strutturaPortante",
    "materialeCoperturaEsistente",
    "materialeInterno",
    "materialeEsterno",
    "tipologiaIntervento",
    "tipologiaNuovaCopertura",
    "supportiNuovaCopertura",
    "spessorePannelloSandwich",
    "lattoneria",
    "tipologiaLanaCoibentante",
    "presenzaControsoffittoAmianto",
    "tipoIsolamento",
    "presenzaLucernari",
    "materialeLucernari",
    "tipologiaPuntiLuce",
    "edificioRiscaldato",
    "solettaPedonabile",
    "presenzaPluviali",
    "presenzaParapetti",
    "presenzaLineaVita",
    "accessoCopertura",
    "specificaMetodoAccesso",
    "accessibilitaMezzi",
    "opereProvvisionali",
    "praticaPaesaggistica",
    "bandoAmianto",
    "detrazioniFiscali",
    "disponibilita",
    "noteAggiuntive",
  ],
];

type SubmitResult =
  | { status: "idle" }
  | { status: "success"; pageUrl: string | null }
  | { status: "error"; message: string };

export function CoperturaForm() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<SubmitResult>({ status: "idle" });

  const form = useForm<CoperturaFormInput>({
    resolver: zodResolver(coperturaSchema),
    mode: "onBlur",
    defaultValues: {
      commerciale: undefined,
      nomeCognomeCliente: "",
      tipologiaEdificio: undefined,
      tipologiaDellaCopertura: undefined,
      mqCopertura: undefined as unknown as number,
      statoConservazione: undefined,
      strutturaPortante: [],
      materialeCoperturaEsistente: [],
      materialeInterno: "",
      materialeEsterno: "",
      tipologiaIntervento: [],
      tipologiaNuovaCopertura: [],
      supportiNuovaCopertura: [],
      spessorePannelloSandwich: [],
      lattoneria: [],
      tipologiaLanaCoibentante: [],
      presenzaControsoffittoAmianto: [],
      tipoIsolamento: [],
      presenzaLucernari: undefined,
      materialeLucernari: [],
      tipologiaPuntiLuce: [],
      edificioRiscaldato: undefined,
      solettaPedonabile: undefined,
      presenzaPluviali: [],
      presenzaParapetti: [],
      presenzaLineaVita: undefined,
      accessoCopertura: [],
      specificaMetodoAccesso: "",
      accessibilitaMezzi: [],
      opereProvvisionali: [],
      praticaPaesaggistica: [],
      bandoAmianto: [],
      detrazioniFiscali: [],
      disponibilita: [],
      noteAggiuntive: "",
      honeypot: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = form;

  async function next() {
    const fields = STEP_FIELDS[step - 1];
    const ok = await trigger(fields, { shouldFocus: true });
    if (!ok) return;
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    setStep((s) => Math.max(1, s - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(values: CoperturaFormInput) {
    setResult({ status: "idle" });
    try {
      const res = await fetch(coperturaFormConfig.apiPath, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setResult({ status: "success", pageUrl: data.pageUrl ?? null });
        reset();
        setStep(1);
        return;
      }
      setResult({
        status: "error",
        message: data?.message ?? "Errore durante il salvataggio. Riprova.",
      });
    } catch {
      setResult({
        status: "error",
        message: "Impossibile contattare il server. Controlla la connessione.",
      });
    }
  }

  if (result.status === "success") {
    return (
      <SuccessPanel
        pageUrl={result.pageUrl}
        onAnother={() => {
          setResult({ status: "idle" });
          setStep(1);
        }}
      />
    );
  }

  const errorFor = (name: FieldPath<CoperturaFormInput>): string | undefined => {
    const node = (errors as Record<string, { message?: string } | undefined>)[name];
    return node?.message;
  };

  const checkboxField = <T extends string>(
    name: FieldPath<CoperturaFormInput>,
    label: string,
    options: readonly T[],
    opts: { hint?: string; required?: boolean; columns?: 1 | 2 } = {},
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field
          label={label}
          required={opts.required}
          hint={opts.hint}
          error={errorFor(name)}
        >
          {() => (
            <CheckboxGrid
              options={options}
              value={(field.value as T[]) ?? []}
              onChange={field.onChange}
              ariaLabel={label}
              columns={opts.columns ?? 2}
            />
          )}
        </Field>
      )}
    />
  );

  const radioField = <T extends string>(
    name: FieldPath<CoperturaFormInput>,
    label: string,
    options: readonly T[],
    opts: { required?: boolean; columns?: 1 | 2 } = {},
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field label={label} required={opts.required} error={errorFor(name)}>
          {() => (
            <RadioGroup
              name={field.name}
              options={options}
              value={(field.value as string) ?? ""}
              onChange={field.onChange}
              invalid={Boolean(errorFor(name))}
              columns={opts.columns ?? 2}
            />
          )}
        </Field>
      )}
    />
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <WizardProgress current={step} total={TOTAL_STEPS} />

      <StepCard>
        {step === 1 && (
          <WizardStep
            stepNumber={1}
            totalSteps={TOTAL_STEPS}
            eyebrow="Sopralluogo Copertura"
            title="Seleziona il commerciale"
            description="Chi sta effettuando la scheda di sopralluogo."
          >
            <PreliminaryNotice />
            <Field
              label="Commerciale che effettua la scheda"
              required
              error={errors.commerciale?.message}
            >
              {(props) => (
                <Select {...props} {...register("commerciale")} defaultValue="">
                  <option value="" disabled>
                    Seleziona…
                  </option>
                  {COMMERCIALE_COPERTURA.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </WizardStep>
        )}

        {step === 2 && (
          <WizardStep
            stepNumber={2}
            totalSteps={TOTAL_STEPS}
            title="Cliente"
            description="Anagrafica del cliente oggetto del sopralluogo."
          >
            <Field
              label="Inserisci il nome e cognome del cliente"
              required
              error={errors.nomeCognomeCliente?.message}
            >
              {(props) => (
                <Input
                  {...props}
                  {...register("nomeCognomeCliente")}
                  autoComplete="name"
                  placeholder="Mario Rossi"
                />
              )}
            </Field>
          </WizardStep>
        )}

        {step === 3 && (
          <WizardStep
            stepNumber={3}
            totalSteps={TOTAL_STEPS}
            title="Dati tecnici della copertura"
            description="Rilievi su materiali, accessibilità, sicurezza e benefici fiscali."
          >
            <SectionHeading>Edificio e copertura</SectionHeading>
            <div className="grid gap-5">
              {radioField("tipologiaEdificio", "Tipologia edificio", TIPOLOGIA_EDIFICIO_COPERTURA, {
                required: true,
              })}
              {radioField(
                "tipologiaDellaCopertura",
                "Tipologia della copertura",
                TIPOLOGIA_DELLA_COPERTURA,
                { required: true },
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Mq della copertura"
                  required
                  error={errors.mqCopertura?.message}
                >
                  {(props) => (
                    <Input
                      {...props}
                      type="number"
                      inputMode="numeric"
                      {...register("mqCopertura", numberOrUndef)}
                      placeholder="200"
                    />
                  )}
                </Field>
                <Field
                  label="Altezza del piano di calpestio (m)"
                  hint="Facoltativo"
                  error={errors.altezzaPianoCalpestio?.message}
                >
                  {(props) => (
                    <Input
                      {...props}
                      type="number"
                      inputMode="numeric"
                      {...register("altezzaPianoCalpestio", numberOrUndef)}
                      placeholder="8"
                    />
                  )}
                </Field>
              </div>
              {radioField("statoConservazione", "Stato di conservazione copertura", STATO_CONSERVAZIONE, {
                required: true,
                columns: 1,
              })}
              {checkboxField("strutturaPortante", "Struttura portante", STRUTTURA_PORTANTE, {
                required: true,
              })}
              {checkboxField(
                "materialeCoperturaEsistente",
                "Materiale copertura esistente",
                MATERIALE_COPERTURA_ESISTENTE,
                { required: true },
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Materiale interno" hint="Facoltativo" error={errors.materialeInterno?.message}>
                  {(props) => <Input {...props} {...register("materialeInterno")} />}
                </Field>
                <Field label="Materiale esterno" hint="Facoltativo" error={errors.materialeEsterno?.message}>
                  {(props) => <Input {...props} {...register("materialeEsterno")} />}
                </Field>
              </div>
            </div>

            <SectionHeading>Intervento previsto</SectionHeading>
            <div className="grid gap-5">
              {checkboxField("tipologiaIntervento", "Tipologia di intervento", TIPOLOGIA_INTERVENTO, {
                hint: "Facoltativo",
              })}
              {checkboxField(
                "tipologiaNuovaCopertura",
                "Tipologia di nuova copertura",
                TIPOLOGIA_NUOVA_COPERTURA,
                { hint: "Facoltativo" },
              )}
              {checkboxField(
                "supportiNuovaCopertura",
                "Supporti della nuova copertura",
                SUPPORTI_NUOVA_COPERTURA,
                { hint: "Facoltativo" },
              )}
              {checkboxField(
                "spessorePannelloSandwich",
                "Spessore pannello Sandwich",
                SPESSORE_PANNELLO_SANDWICH,
                { hint: "Facoltativo" },
              )}
              {checkboxField("lattoneria", "Lattoneria", LATTONERIA, { hint: "Facoltativo" })}
            </div>

            <SectionHeading>Coibentazione e amianto</SectionHeading>
            <div className="grid gap-5">
              {checkboxField(
                "tipologiaLanaCoibentante",
                "Presenza di lana coibentante",
                SI_NO_DA_VERIFICARE,
                { hint: "Facoltativo" },
              )}
              {checkboxField(
                "presenzaControsoffittoAmianto",
                "Presenza di controsoffitto in amianto",
                SI_NO_DA_VERIFICARE,
                { hint: "Facoltativo" },
              )}
              {checkboxField("tipoIsolamento", "Tipo di isolamento da preventivare", TIPO_ISOLAMENTO, {
                hint: "Facoltativo",
              })}
            </div>

            <SectionHeading>Lucernari e punti luce</SectionHeading>
            <div className="grid gap-5">
              {radioField("presenzaLucernari", "Presenza di lucernari", SI_NO, { required: true })}
              {checkboxField("materialeLucernari", "Materiale dei lucernari", MATERIALE_LUCERNARI, {
                hint: "Facoltativo",
              })}
              {checkboxField("tipologiaPuntiLuce", "Tipologia punti luce", TIPOLOGIA_PUNTI_LUCE, {
                hint: "Facoltativo",
              })}
            </div>

            <SectionHeading>Soletta e sotto-copertura</SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2">
              {radioField("edificioRiscaldato", "L'edificio sottostante è riscaldato?", SI_NO, {
                required: true,
              })}
              {radioField("solettaPedonabile", "La soletta è pedonabile?", SI_NO, { required: true })}
              {checkboxField("presenzaPluviali", "Presenza di pluviali", SI_NO, { hint: "Facoltativo" })}
              {checkboxField("presenzaParapetti", "Presenza di parapetti", SI_NO, { hint: "Facoltativo" })}
            </div>

            <SectionHeading>Accesso e sicurezza</SectionHeading>
            <div className="grid gap-5">
              {radioField("presenzaLineaVita", "Presenza di linea vita", SI_NO, { required: true })}
              {checkboxField("accessoCopertura", "Accesso alla copertura", SI_NO, { hint: "Facoltativo" })}
              <Field
                label="Specifica il metodo di accesso"
                hint="Se si — facoltativo"
                error={errors.specificaMetodoAccesso?.message}
              >
                {(props) => (
                  <Input {...props} {...register("specificaMetodoAccesso")} placeholder="Es. scala esterna, ponteggio…" />
                )}
              </Field>
              {checkboxField(
                "accessibilitaMezzi",
                "Accessibilità ai mezzi di trasporto e viabilità",
                ACCESSIBILITA_MEZZI,
                { hint: "Facoltativo" },
              )}
              {checkboxField(
                "opereProvvisionali",
                "Opere provvisionali di sicurezza",
                OPERE_PROVVISIONALI_COPERTURA,
                { hint: "Facoltativo" },
              )}
              {checkboxField("praticaPaesaggistica", "È presente una pratica paesaggistica?", SI_NO, {
                hint: "Facoltativo",
              })}
            </div>

            <SectionHeading>Benefici fiscali e disponibilità</SectionHeading>
            <div className="grid gap-5">
              {checkboxField("bandoAmianto", "Bando Amianto", SI_NO, { hint: "Facoltativo" })}
              {checkboxField("detrazioniFiscali", "Detrazioni fiscali per cliente", SI_NO, {
                hint: "Facoltativo",
              })}
              {checkboxField("disponibilita", "Disponibilità di", DISPONIBILITA, { hint: "Facoltativo" })}
            </div>

            <SectionHeading>Note e allegati</SectionHeading>
            <Field label="Note aggiuntive" hint="Facoltativo" error={errors.noteAggiuntive?.message}>
              {(props) => (
                <Textarea
                  {...props}
                  {...register("noteAggiuntive")}
                  rows={4}
                  placeholder="Annotazioni sul sopralluogo"
                />
              )}
            </Field>
            <FileUploadsDisabled />
          </WizardStep>
        )}

        <WizardNav
          current={step}
          total={TOTAL_STEPS}
          onBack={back}
          onNext={next}
          isSubmitting={isSubmitting}
          submitLabel={coperturaFormConfig.ui.submitLabel}
        />
      </StepCard>

      <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Lascia vuoto
          <input type="text" tabIndex={-1} autoComplete="off" {...register("honeypot")} />
        </label>
      </div>

      {result.status === "error" && (
        <div className="mt-5 rounded-[14px] border border-danger/20 bg-danger-soft px-5 py-4 text-danger">
          <p className="text-[14px] font-semibold leading-5">Salvataggio non riuscito</p>
          <p className="mt-1 text-[13.5px] leading-5 opacity-90">{result.message}</p>
        </div>
      )}
    </form>
  );
}

function PreliminaryNotice() {
  return (
    <div className="mb-6 rounded-[12px] border border-warning/30 bg-warning-soft/70 px-4 py-3 text-[12.5px] leading-5 text-warning">
      <strong className="font-semibold">Versione preliminare:</strong>{" "}
      questo modulo è stato ricostruito dallo schema del database Notion
      (non esiste un modulo Tally per la copertura). L&apos;elenco dei
      campi è una proposta da verificare con il cliente — potrebbe
      richiedere aggiunte o rimozioni.
    </div>
  );
}

function StepCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[20px] border border-border bg-surface px-6 py-7 shadow-[var(--shadow-card)] sm:px-8 sm:py-9">
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 mt-7 font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-fg-muted first:mt-0">
      {children}
    </h3>
  );
}

function FileUploadsDisabled() {
  const uploads = [
    "Interno copertura",
    "Esterno copertura",
    "Pareti esterne edificio",
    "Area esterna edificio",
  ];
  return (
    <section className="mt-6 rounded-[14px] border border-dashed border-border-strong bg-surface-muted/70 px-5 py-5">
      <h4 className="font-display text-[13px] font-semibold uppercase tracking-[0.12em] text-fg-muted">
        Allegati foto — in arrivo
      </h4>
      <p className="mt-1.5 text-[13px] leading-5 text-fg-muted">
        Gli upload foto del database Copertura saranno disponibili dopo
        l&apos;attivazione dello storage esterno. Puoi caricarli manualmente
        nella scheda Notion una volta salvata.
      </p>
      <ul className="mt-3 grid grid-cols-1 gap-1.5 text-[12.5px] text-fg-subtle sm:grid-cols-2">
        {uploads.map((u) => (
          <li key={u} className="flex items-center gap-2">
            <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none">
              <path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {u}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SuccessPanel({
  pageUrl,
  onAnother,
}: {
  pageUrl: string | null;
  onAnother: () => void;
}) {
  return (
    <div className="rounded-[20px] border border-success/20 bg-success-soft px-6 py-10 text-success sm:px-10 sm:py-14">
      <div className="mx-auto max-w-md text-center">
        <span
          aria-hidden
          className="mx-auto mb-5 inline-flex size-12 items-center justify-center rounded-full bg-success text-white"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="font-display text-[22px] font-semibold leading-7">
          Sopralluogo copertura salvato.
        </h2>
        <p className="mt-2 text-[14px] leading-5 opacity-90">
          La scheda è stata creata nel database Scheda Sopralluogo Copertura su Notion.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {pageUrl && (
            <a
              href={pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-success px-5 text-[14px] font-medium text-white hover:bg-success/90 transition-colors"
            >
              Apri in Notion
              <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none">
                <path d="M6 4h6v6M11.5 4.5L4 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
          <button
            type="button"
            onClick={onAnother}
            className="inline-flex h-11 items-center gap-2 rounded-[12px] border border-success/40 px-5 text-[14px] font-medium hover:bg-success/10 transition-colors"
          >
            Inserisci un'altra scheda
          </button>
        </div>
      </div>
    </div>
  );
}
