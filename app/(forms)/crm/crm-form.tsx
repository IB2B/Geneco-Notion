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
  crmFormSchema,
  RIFERIMENTO_SEGNALATORE,
  TIPO_CONTATTO,
  COMMERCIALE_RIFERIMENTO,
  IMPIANTI_INTERESSE,
  DOVE_CI_HA_CONOSCIUTO,
  REFERENZA_TRIGGERS,
  type CrmFormInput,
} from "@/lib/forms/crm/schema";
import { crmFormConfig } from "@/lib/forms/crm/config";

const TOTAL_STEPS = 11;

// Field names to validate before advancing each step
const STEP_FIELDS: ReadonlyArray<FieldPath<CrmFormInput>[]> = [
  ["riferimentoSegnalatore"],
  ["tipoContatto"],
  ["nomeCognomeReferente", "ragioneSociale", "sedeLegaleAzienda", "pIva"],
  ["email"],
  ["telefono"],
  ["indirizzoInstallazione", "citta", "cap"],
  ["commercialeRiferimento"],
  ["dataAppuntamento", "oraAppuntamento"],
  ["impiantiInteresse"],
  ["note"],
  ["doveCiHaConosciuto", "nomeReferenza"],
];

type SubmitResult =
  | { status: "idle" }
  | { status: "success"; pageUrl: string | null }
  | { status: "error"; message: string };

export function CrmForm() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<SubmitResult>({ status: "idle" });

  const form = useForm<CrmFormInput>({
    resolver: zodResolver(crmFormSchema),
    mode: "onBlur",
    defaultValues: {
      riferimentoSegnalatore: undefined,
      tipoContatto: undefined,
      nomeCognomeReferente: "",
      ragioneSociale: "",
      sedeLegaleAzienda: "",
      pIva: "",
      email: "",
      telefono: "",
      indirizzoInstallazione: "",
      citta: "",
      cap: "",
      commercialeRiferimento: undefined,
      dataAppuntamento: "",
      oraAppuntamento: "",
      impiantiInteresse: [],
      note: "",
      doveCiHaConosciuto: undefined,
      nomeReferenza: "",
      honeypot: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const tipoContatto = watch("tipoContatto");
  const dove = watch("doveCiHaConosciuto");
  const isAzienda = tipoContatto === "Azienda";
  const showReferenza = REFERENZA_TRIGGERS.includes(
    dove as (typeof REFERENZA_TRIGGERS)[number],
  );

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

  async function onSubmit(values: CrmFormInput) {
    setResult({ status: "idle" });
    try {
      const res = await fetch(crmFormConfig.apiPath, {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <WizardProgress current={step} total={TOTAL_STEPS} />

      <StepCard>
        {step === 1 && (
          <WizardStep
            stepNumber={1}
            totalSteps={TOTAL_STEPS}
            eyebrow="Inserimento Lead"
            title="Riferimento Segnalatore"
            description="Compila il form per inserire un nuovo Lead. Tempo richiesto: meno di 1 minuto."
          >
            <Field label="Riferimento Segnalatore" required error={errors.riferimentoSegnalatore?.message}>
              {(props) => (
                <Select {...props} {...register("riferimentoSegnalatore")} defaultValue="">
                  <option value="" disabled>
                    Seleziona…
                  </option>
                  {RIFERIMENTO_SEGNALATORE.map((p) => (
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
          <WizardStep stepNumber={2} totalSteps={TOTAL_STEPS} title="Che tipo di contatto è?">
            <Controller
              control={control}
              name="tipoContatto"
              render={({ field }) => (
                <Field label="Che tipo di contatto è?" required error={errors.tipoContatto?.message}>
                  {() => (
                    <RadioGroup
                      name={field.name}
                      options={TIPO_CONTATTO}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      invalid={Boolean(errors.tipoContatto)}
                      columns={2}
                    />
                  )}
                </Field>
              )}
            />
          </WizardStep>
        )}

        {step === 3 && (
          <WizardStep
            stepNumber={3}
            totalSteps={TOTAL_STEPS}
            title="Anagrafica"
            description={isAzienda ? "Dati dell'azienda e del referente." : "Dati del referente."}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Inserisci Nome e Cognome referente"
                required
                error={errors.nomeCognomeReferente?.message}
                className="sm:col-span-2"
              >
                {(props) => (
                  <Input
                    {...props}
                    {...register("nomeCognomeReferente")}
                    autoComplete="name"
                    placeholder="Mario Rossi"
                  />
                )}
              </Field>
              {isAzienda && (
                <>
                  <Field
                    label="Inserisci Ragione Sociale"
                    required
                    error={errors.ragioneSociale?.message}
                    className="sm:col-span-2"
                  >
                    {(props) => (
                      <Input
                        {...props}
                        {...register("ragioneSociale")}
                        autoComplete="organization"
                        placeholder="Mario Rossi S.r.l."
                      />
                    )}
                  </Field>
                  <Field
                    label="Inserisci Sede legale Azienda"
                    required
                    error={errors.sedeLegaleAzienda?.message}
                  >
                    {(props) => (
                      <Input
                        {...props}
                        {...register("sedeLegaleAzienda")}
                        placeholder="Via dei Pini 12, Milano 20162"
                      />
                    )}
                  </Field>
                  <Field
                    label="P.IVA (facoltativa)"
                    error={errors.pIva?.message}
                  >
                    {(props) => (
                      <Input
                        {...props}
                        {...register("pIva")}
                        inputMode="numeric"
                        placeholder="10522222837"
                      />
                    )}
                  </Field>
                </>
              )}
            </div>
          </WizardStep>
        )}

        {step === 4 && (
          <WizardStep stepNumber={4} totalSteps={TOTAL_STEPS} title="Email cliente">
            <Field label="Inserisci la mail del cliente" required error={errors.email?.message}>
              {(props) => (
                <Input
                  {...props}
                  type="email"
                  {...register("email")}
                  autoComplete="email"
                  placeholder="mario@rossi.com"
                />
              )}
            </Field>
          </WizardStep>
        )}

        {step === 5 && (
          <WizardStep stepNumber={5} totalSteps={TOTAL_STEPS} title="Numero di telefono">
            <Field
              label="Inserisci il numero di telefono"
              required
              error={errors.telefono?.message}
            >
              {(props) => (
                <Input
                  {...props}
                  type="tel"
                  {...register("telefono")}
                  autoComplete="tel"
                  placeholder="338 776 6491"
                />
              )}
            </Field>
          </WizardStep>
        )}

        {step === 6 && (
          <WizardStep
            stepNumber={6}
            totalSteps={TOTAL_STEPS}
            title="Indirizzo installazione"
            description="Dove andrà installato l'impianto."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Inserisci indirizzo dell'installazione"
                required
                error={errors.indirizzoInstallazione?.message}
                className="sm:col-span-2"
              >
                {(props) => (
                  <Input
                    {...props}
                    {...register("indirizzoInstallazione")}
                    autoComplete="street-address"
                    placeholder="Via Piave 32"
                  />
                )}
              </Field>
              <Field label="Inserisci la città" required error={errors.citta?.message}>
                {(props) => (
                  <Input
                    {...props}
                    {...register("citta")}
                    autoComplete="address-level2"
                    placeholder="Lazzate"
                  />
                )}
              </Field>
              <Field label="Inserisci il CAP" required error={errors.cap?.message}>
                {(props) => (
                  <Input
                    {...props}
                    inputMode="numeric"
                    {...register("cap")}
                    autoComplete="postal-code"
                    placeholder="20824"
                    maxLength={5}
                  />
                )}
              </Field>
            </div>
          </WizardStep>
        )}

        {step === 7 && (
          <WizardStep stepNumber={7} totalSteps={TOTAL_STEPS} title="Commerciale di riferimento">
            <Field
              label="Selezione il commerciale di riferimento"
              required
              error={errors.commercialeRiferimento?.message}
            >
              {(props) => (
                <Select {...props} {...register("commercialeRiferimento")} defaultValue="">
                  <option value="" disabled>
                    Seleziona…
                  </option>
                  {COMMERCIALE_RIFERIMENTO.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </WizardStep>
        )}

        {step === 8 && (
          <WizardStep stepNumber={8} totalSteps={TOTAL_STEPS} title="Appuntamento">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Seleziona la data dell'appuntamento"
                required
                error={errors.dataAppuntamento?.message}
              >
                {(props) => (
                  <Input {...props} type="date" {...register("dataAppuntamento")} />
                )}
              </Field>
              <Field
                label="Seleziona l'ora dell'appuntamento"
                required
                error={errors.oraAppuntamento?.message}
              >
                {(props) => (
                  <Input {...props} type="time" {...register("oraAppuntamento")} />
                )}
              </Field>
            </div>
          </WizardStep>
        )}

        {step === 9 && (
          <WizardStep
            stepNumber={9}
            totalSteps={TOTAL_STEPS}
            eyebrow="Informazioni aggiuntive prima di inviare il modulo"
            title="C'è un servizio al quale è particolarmente interessato?"
            description="Facoltativo — è possibile selezionarli tutti."
          >
            <Controller
              control={control}
              name="impiantiInteresse"
              render={({ field }) => (
                <CheckboxGrid
                  options={IMPIANTI_INTERESSE}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  ariaLabel="Impianti di interesse"
                  columns={2}
                />
              )}
            />
          </WizardStep>
        )}

        {step === 10 && (
          <WizardStep stepNumber={10} totalSteps={TOTAL_STEPS} title="Note">
            <Field label="Inserisci qui le note (facoltativo)" error={errors.note?.message}>
              {(props) => (
                <Textarea
                  {...props}
                  {...register("note")}
                  rows={5}
                  placeholder="Il Cliente dice di avvisarlo alle…"
                />
              )}
            </Field>
          </WizardStep>
        )}

        {step === 11 && (
          <WizardStep stepNumber={11} totalSteps={TOTAL_STEPS} title="Dove ci ha conosciuto?">
            <Field
              label="Dove ci ha conosciuto?"
              required
              error={errors.doveCiHaConosciuto?.message}
            >
              {(props) => (
                <Select {...props} {...register("doveCiHaConosciuto")} defaultValue="">
                  <option value="" disabled>
                    Seleziona…
                  </option>
                  {DOVE_CI_HA_CONOSCIUTO.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            {showReferenza && (
              <div className="mt-5">
                <Field
                  label="Inserisci nome di chi ha dato la referenza"
                  required
                  error={errors.nomeReferenza?.message}
                >
                  {(props) => (
                    <Input
                      {...props}
                      {...register("nomeReferenza")}
                      placeholder="Mario Bianchi"
                    />
                  )}
                </Field>
              </div>
            )}
          </WizardStep>
        )}

        <WizardNav
          current={step}
          total={TOTAL_STEPS}
          onBack={back}
          onNext={next}
          isSubmitting={isSubmitting}
          submitLabel="Salva nel CRM"
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

function StepCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[20px] border border-border bg-surface px-6 py-7 shadow-[var(--shadow-card)] sm:px-8 sm:py-9">
      {children}
    </div>
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
          Lead salvato nel CRM.
        </h2>
        <p className="mt-2 text-[14px] leading-5 opacity-90">
          La nuova scheda è stata creata su Notion.
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
            Inserisci un altro lead
          </button>
        </div>
      </div>
    </div>
  );
}
