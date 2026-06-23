"use client";

import { useState, type ReactNode } from "react";
import { Controller, useForm, type Control, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/form/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup } from "@/components/form/radio-group";
import {
  WizardProgress,
  WizardStep,
  WizardNav,
} from "@/components/form/wizard";
import {
  fotovoltaicoSchema,
  COMMERCIALE_FOTOVOLTAICO,
  TIPO_EDIFICIO,
  GEOMETRIA_COPERTURA,
  TIPOLOGIA_COPERTURA,
  ACCESSO_TETTO,
  LOCALE_TECNICO,
  OPERE_PROVVISIONALI,
  SI_NO,
  PERCENTUALE_SUCCESSO,
  type FotovoltaicoFormInput,
} from "@/lib/forms/sopralluogo-fotovoltaico/schema";
import { fotovoltaicoFormConfig } from "@/lib/forms/sopralluogo-fotovoltaico/config";
import { FileUploadField } from "@/components/file-upload-field";

const TOTAL_STEPS = 4;

const STEP_FIELDS: ReadonlyArray<FieldPath<FotovoltaicoFormInput>[]> = [
  ["commerciale"],
  ["nomeCognomeCliente"],
  [
    "mqCopertura",
    "tipoEdificio",
    "tipoEdificioAltro",
    "geometriaCopertura",
    "tipologiaCopertura",
    "accessoTetto",
    "numeroPiani",
    "localeTecnico",
    "localeTecnicoAltro",
    "opereProvvisionali",
    "lineaVitaPresente",
    "certificazioneIncendi",
    "noteSopralluogo",
  ],
  [
    "quattroMotiviAutonomia",
    "treMotiviDifficolta",
    "tettoPronto",
    "strategiaFinanziaria",
    "tempisticheAttivazione",
    "nomeDecisore",
    "nomePersonaChiave",
    "nomiCollaboratori",
    "numeroSoci",
    "fatturato",
    "percentualeSuccesso",
  ],
];

type SubmitResult =
  | { status: "idle" }
  | { status: "success"; pageUrl: string | null }
  | { status: "error"; message: string };

export function FotovoltaicoForm() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<SubmitResult>({ status: "idle" });

  const form = useForm<FotovoltaicoFormInput>({
    resolver: zodResolver(fotovoltaicoSchema),
    mode: "onBlur",
    defaultValues: {
      commerciale: undefined,
      nomeCognomeCliente: "",
      mqCopertura: undefined as unknown as number,
      tipoEdificio: undefined,
      tipoEdificioAltro: "",
      geometriaCopertura: undefined,
      tipologiaCopertura: undefined,
      accessoTetto: undefined,
      numeroPiani: undefined as unknown as number,
      localeTecnico: undefined,
      localeTecnicoAltro: "",
      opereProvvisionali: undefined,
      lineaVitaPresente: undefined,
      certificazioneIncendi: undefined,
      noteSopralluogo: "",
      quattroMotiviAutonomia: "",
      treMotiviDifficolta: "",
      tettoPronto: "",
      strategiaFinanziaria: "",
      tempisticheAttivazione: "",
      nomeDecisore: "",
      nomePersonaChiave: "",
      nomiCollaboratori: "",
      numeroSoci: undefined,
      fatturato: undefined,
      percentualeSuccesso: undefined,
      uploadBolletta: [],
      uploadStoricoAnnuo: [],
      uploadFotoInternoCopertura: [],
      uploadFotoEsternoCopertura: [],
      uploadFotoEsterniEdificio: [],
      uploadFotoPossibileLocaleTecnico: [],
      uploadFotoQuadriElettrici: [],
      uploadFotoContatore: [],
      uploadFotoCabinaDiMedia: [],
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

  const tipoEdificio = watch("tipoEdificio");
  const localeTecnico = watch("localeTecnico");
  const showTipoEdificioAltro = tipoEdificio === "Altro";
  const showLocaleTecnicoAltro = localeTecnico === "Altro";

  async function next() {
    const fields = STEP_FIELDS[step - 1];
    const ok = await trigger(fields, { shouldFocus: true });
    if (!ok) return;

    // Cross-field rules the schema's .superRefine() can't surface while
    // the form is still partially filled (Zod v4 short-circuits refinements
    // when other object fields still have errors). Mirror them here.
    const values = form.getValues();
    const manualErrors: Array<[FieldPath<FotovoltaicoFormInput>, string]> = [];

    if (step === 3) {
      if (values.tipoEdificio === "Altro" && !values.tipoEdificioAltro?.trim()) {
        manualErrors.push(["tipoEdificioAltro", "Specifica la tipologia di edificio"]);
      }
      if (values.localeTecnico === "Altro" && !values.localeTecnicoAltro?.trim()) {
        manualErrors.push(["localeTecnicoAltro", "Specifica il locale tecnico"]);
      }
    }

    if (manualErrors.length > 0) {
      for (const [path, msg] of manualErrors) {
        form.setError(path, { type: "manual", message: msg });
      }
      form.setFocus(manualErrors[0]![0]);
      return;
    }

    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    setStep((s) => Math.max(1, s - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onSubmit(values: FotovoltaicoFormInput) {
    setResult({ status: "idle" });
    try {
      const res = await fetch(fotovoltaicoFormConfig.apiPath, {
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
            eyebrow="Sopralluogo Fotovoltaico"
            title="Seleziona il commerciale"
            description="Chi sta effettuando la scheda di sopralluogo."
          >
            <Field
              label="Seleziona il commerciale che sta effettuando la scheda"
              required
              error={errors.commerciale?.message}
            >
              {(props) => (
                <Select {...props} {...register("commerciale")} defaultValue="">
                  <option value="" disabled>
                    Seleziona…
                  </option>
                  {COMMERCIALE_FOTOVOLTAICO.map((p) => (
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
            description="Rilievi dimensionali, tipologia di edificio e copertura, accesso e sicurezza."
          >
            <SectionHeading>Edificio e copertura</SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Inserisci i mq della copertura"
                required
                error={errors.mqCopertura?.message}
              >
                {(props) => (
                  <Input
                    {...props}
                    type="number"
                    inputMode="numeric"
                    {...register("mqCopertura", { valueAsNumber: true })}
                    placeholder="200"
                  />
                )}
              </Field>

              <Field
                label="Inserisci il numero dei piani"
                required
                error={errors.numeroPiani?.message}
              >
                {(props) => (
                  <Input
                    {...props}
                    type="number"
                    inputMode="numeric"
                    {...register("numeroPiani", { valueAsNumber: true })}
                    placeholder="3"
                  />
                )}
              </Field>

              <Controller
                control={control}
                name="tipoEdificio"
                render={({ field }) => (
                  <Field
                    label="Seleziona la tipologia dell'edificio"
                    required
                    error={errors.tipoEdificio?.message}
                    className="sm:col-span-2"
                  >
                    {() => (
                      <RadioGroup
                        name={field.name}
                        options={TIPO_EDIFICIO}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        invalid={Boolean(errors.tipoEdificio)}
                        columns={2}
                      />
                    )}
                  </Field>
                )}
              />

              {showTipoEdificioAltro && (
                <Field
                  label="Specifica la tipologia"
                  required
                  error={errors.tipoEdificioAltro?.message}
                  className="sm:col-span-2"
                >
                  {(props) => (
                    <Input
                      {...props}
                      {...register("tipoEdificioAltro")}
                      placeholder="Inserisci i dettagli"
                    />
                  )}
                </Field>
              )}

              <Controller
                control={control}
                name="geometriaCopertura"
                render={({ field }) => (
                  <Field
                    label="Inserisci la Geometria della copertura"
                    required
                    error={errors.geometriaCopertura?.message}
                  >
                    {() => (
                      <RadioGroup
                        name={field.name}
                        options={GEOMETRIA_COPERTURA}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        invalid={Boolean(errors.geometriaCopertura)}
                      />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="tipologiaCopertura"
                render={({ field }) => (
                  <Field
                    label="Inserisci la tipologia di copertura"
                    required
                    error={errors.tipologiaCopertura?.message}
                  >
                    {() => (
                      <RadioGroup
                        name={field.name}
                        options={TIPOLOGIA_COPERTURA}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        invalid={Boolean(errors.tipologiaCopertura)}
                      />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="accessoTetto"
                render={({ field }) => (
                  <Field
                    label="Inserisci l'accesso al tetto"
                    required
                    error={errors.accessoTetto?.message}
                    className="sm:col-span-2"
                  >
                    {() => (
                      <RadioGroup
                        name={field.name}
                        options={ACCESSO_TETTO}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        invalid={Boolean(errors.accessoTetto)}
                        columns={2}
                      />
                    )}
                  </Field>
                )}
              />
            </div>

            <SectionHeading>Locale tecnico e sicurezza</SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2">
              <Controller
                control={control}
                name="localeTecnico"
                render={({ field }) => (
                  <Field
                    label="Locale Tecnico"
                    required
                    error={errors.localeTecnico?.message}
                    className="sm:col-span-2"
                  >
                    {() => (
                      <RadioGroup
                        name={field.name}
                        options={LOCALE_TECNICO}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        invalid={Boolean(errors.localeTecnico)}
                        columns={2}
                      />
                    )}
                  </Field>
                )}
              />

              {showLocaleTecnicoAltro && (
                <Field
                  label="Specifica il locale tecnico"
                  required
                  error={errors.localeTecnicoAltro?.message}
                  className="sm:col-span-2"
                >
                  {(props) => (
                    <Input
                      {...props}
                      {...register("localeTecnicoAltro")}
                      placeholder="Scrivi qui"
                    />
                  )}
                </Field>
              )}

              <Controller
                control={control}
                name="opereProvvisionali"
                render={({ field }) => (
                  <Field
                    label="Opere Provvisionali di sicurezza"
                    required
                    error={errors.opereProvvisionali?.message}
                    className="sm:col-span-2"
                  >
                    {() => (
                      <RadioGroup
                        name={field.name}
                        options={OPERE_PROVVISIONALI}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        invalid={Boolean(errors.opereProvvisionali)}
                        columns={2}
                      />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="lineaVitaPresente"
                render={({ field }) => (
                  <Field
                    label="Linea Vita presente?"
                    required
                    error={errors.lineaVitaPresente?.message}
                  >
                    {() => (
                      <RadioGroup
                        name={field.name}
                        options={SI_NO}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        invalid={Boolean(errors.lineaVitaPresente)}
                        columns={2}
                      />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="certificazioneIncendi"
                render={({ field }) => (
                  <Field
                    label="Certificazione Prevenzione Incendi"
                    required
                    error={errors.certificazioneIncendi?.message}
                  >
                    {() => (
                      <RadioGroup
                        name={field.name}
                        options={SI_NO}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        invalid={Boolean(errors.certificazioneIncendi)}
                        columns={2}
                      />
                    )}
                  </Field>
                )}
              />
            </div>

            <SectionHeading>Note e allegati</SectionHeading>
            <Field label="Inserisci eventuali note" error={errors.noteSopralluogo?.message}>
              {(props) => (
                <Textarea
                  {...props}
                  {...register("noteSopralluogo")}
                  rows={4}
                  placeholder="Annotazioni sul sopralluogo (facoltativo)"
                />
              )}
            </Field>

            <SectionHeading>Allegati foto e documenti</SectionHeading>
            <p className="-mt-2 mb-4 text-[12.5px] text-fg-muted">
              Carica foto e bollette. Massimo 4 MB per file (le foto vengono compresse
              automaticamente). Più file per categoria sono ammessi.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <UploadGroup control={control} name="uploadBolletta" label="Bolletta" accept="application/pdf,image/*" />
              <UploadGroup control={control} name="uploadStoricoAnnuo" label="Storico Annuo" accept="application/pdf,image/*" />
              <UploadGroup control={control} name="uploadFotoInternoCopertura" label="Foto Interno Copertura" />
              <UploadGroup control={control} name="uploadFotoEsternoCopertura" label="Foto Esterno Copertura" />
              <UploadGroup control={control} name="uploadFotoEsterniEdificio" label="Foto Esterni Edificio" />
              <UploadGroup control={control} name="uploadFotoPossibileLocaleTecnico" label="Foto Possibile Locale Tecnico" />
              <UploadGroup control={control} name="uploadFotoQuadriElettrici" label="Foto Quadri Elettrici" />
              <UploadGroup control={control} name="uploadFotoContatore" label="Foto Contatore" />
              <UploadGroup control={control} name="uploadFotoCabinaDiMedia" label="Foto Cabina di Media" />
            </div>
          </WizardStep>
        )}

        {step === 4 && (
          <WizardStep
            stepNumber={4}
            totalSteps={TOTAL_STEPS}
            eyebrow="Qualificazione Iniziativenergetiche"
            title="Dati importanti"
            description="Motivazioni, decisori, finanze, probabilità di chiusura."
          >
            <div className="grid gap-5">
              <Field
                label="Quali sono i quattro motivi principali che la spingono a creare l'autonomia energetica?"
                required
                error={errors.quattroMotiviAutonomia?.message}
              >
                {(props) => (
                  <Textarea
                    {...props}
                    {...register("quattroMotiviAutonomia")}
                    rows={4}
                    placeholder="1. … 2. … 3. … 4. …"
                  />
                )}
              </Field>

              <Field
                label="Quali sono i tre motivi principali che potrebbero creare difficoltà?"
                required
                error={errors.treMotiviDifficolta?.message}
              >
                {(props) => (
                  <Textarea
                    {...props}
                    {...register("treMotiviDifficolta")}
                    rows={3}
                    placeholder="1. … 2. … 3. …"
                  />
                )}
              </Field>

              <SectionHeading>Dati importanti</SectionHeading>

              <Field
                label="Il Tetto è già pronto? (Descrivi eventuali problematiche)"
                required
                error={errors.tettoPronto?.message}
              >
                {(props) => (
                  <Input
                    {...props}
                    {...register("tettoPronto")}
                    placeholder="Il tetto è pronto / C'è l'amianto da togliere"
                  />
                )}
              </Field>

              <Field
                label="Strategia Finanziaria"
                hint="Se azienda — facoltativo"
                error={errors.strategiaFinanziaria?.message}
              >
                {(props) => (
                  <Input {...props} {...register("strategiaFinanziaria")} />
                )}
              </Field>

              <Field
                label="Entro quanto vuole attivare l'impianto?"
                required
                error={errors.tempisticheAttivazione?.message}
              >
                {(props) => (
                  <Input
                    {...props}
                    {...register("tempisticheAttivazione")}
                    placeholder="Inserisci la tempistica"
                  />
                )}
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Inserisci il nome del Decisore"
                  required
                  error={errors.nomeDecisore?.message}
                >
                  {(props) => <Input {...props} {...register("nomeDecisore")} />}
                </Field>

                <Field
                  label="Inserisci il nome della persona chiave"
                  required
                  error={errors.nomePersonaChiave?.message}
                >
                  {(props) => <Input {...props} {...register("nomePersonaChiave")} />}
                </Field>
              </div>

              <Field
                label="Inserisci i nomi di eventuali collaboratori"
                hint="Se azienda — facoltativo"
                error={errors.nomiCollaboratori?.message}
              >
                {(props) => (
                  <Textarea {...props} {...register("nomiCollaboratori")} rows={2} />
                )}
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Inserisci il numero di soci"
                  hint="Facoltativo"
                  error={errors.numeroSoci?.message}
                >
                  {(props) => (
                    <Input
                      {...props}
                      type="number"
                      inputMode="numeric"
                      {...register("numeroSoci", {
                        setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)),
                      })}
                      placeholder="4"
                    />
                  )}
                </Field>

                <Field
                  label="Inserisci il Fatturato"
                  hint="Facoltativo (€)"
                  error={errors.fatturato?.message}
                >
                  {(props) => (
                    <Input
                      {...props}
                      type="number"
                      inputMode="numeric"
                      {...register("fatturato", {
                        setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)),
                      })}
                      placeholder="1000000"
                    />
                  )}
                </Field>
              </div>

              <Controller
                control={control}
                name="percentualeSuccesso"
                render={({ field }) => (
                  <Field
                    label="Inserisci la % di successo"
                    required
                    error={errors.percentualeSuccesso?.message}
                  >
                    {() => (
                      <RadioGroup
                        name={field.name}
                        options={PERCENTUALE_SUCCESSO}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        invalid={Boolean(errors.percentualeSuccesso)}
                        columns={2}
                      />
                    )}
                  </Field>
                )}
              />
            </div>
          </WizardStep>
        )}

        <WizardNav
          current={step}
          total={TOTAL_STEPS}
          onBack={back}
          onNext={next}
          isSubmitting={isSubmitting}
          submitLabel={fotovoltaicoFormConfig.ui.submitLabel}
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

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 mt-7 font-display text-[14px] font-semibold uppercase tracking-[0.12em] text-fg-muted first:mt-0">
      {children}
    </h3>
  );
}

type UploadFieldName =
  | "uploadBolletta"
  | "uploadStoricoAnnuo"
  | "uploadFotoInternoCopertura"
  | "uploadFotoEsternoCopertura"
  | "uploadFotoEsterniEdificio"
  | "uploadFotoPossibileLocaleTecnico"
  | "uploadFotoQuadriElettrici"
  | "uploadFotoContatore"
  | "uploadFotoCabinaDiMedia";

function UploadGroup({
  control,
  name,
  label,
  accept,
}: {
  control: Control<FotovoltaicoFormInput>;
  name: UploadFieldName;
  label: string;
  accept?: string;
}) {
  return (
    <Controller
      control={control}
      name={name as FieldPath<FotovoltaicoFormInput>}
      render={({ field }) => (
        <FileUploadField
          label={label}
          accept={accept}
          value={(field.value as Array<{ fileUploadId: string; filename: string }>) ?? []}
          onChange={(next) => field.onChange(next)}
        />
      )}
    />
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
          Sopralluogo salvato.
        </h2>
        <p className="mt-2 text-[14px] leading-5 opacity-90">
          La scheda è stata creata nel database Schede S. Fotovoltaico su Notion.
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
            Inserisci un&apos;altra scheda
          </button>
        </div>
      </div>
    </div>
  );
}
