"use client";

import { useState, type ReactNode } from "react";
import { Controller, useForm, type Control, type FieldPath } from "react-hook-form";
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
  termicoSchema,
  COMMERCIALE_TERMICO,
  TIPO_EDIFICIO_TERMICO,
  INTERVENTI_MIGLIORATIVI,
  SI_NO,
  COMBUSTIBILE_CALDAIA,
  SISTEMA_EMISSIONE,
  MATERIALE_RADIATORI,
  TIPOLOGIA_GEN_2,
  BOILER_ELETTRICO,
  type TermicoFormInput,
} from "@/lib/forms/sopralluogo-termico/schema";
import { termicoFormConfig } from "@/lib/forms/sopralluogo-termico/config";
import { FileUploadField } from "@/components/file-upload-field";

const TOTAL_STEPS = 3;

// Numeric setValueAs: empty input → undefined (so optional fields stay
// undefined rather than NaN, which Zod would reject).
const numberOrUndef = {
  setValueAs: (v: unknown) =>
    v === "" || v === null || v === undefined ? undefined : Number(v),
};

const STEP_FIELDS: ReadonlyArray<FieldPath<TermicoFormInput>[]> = [
  ["commerciale"],
  ["nomeCognomeCliente"],
  [
    "tipoEdificio",
    "interventiMigliorativi",
    "apeLegge10",
    "mqPianoTerra",
    "tempPianoTerra",
    "mq1Piano",
    "temp1Piano",
    "mq2Piano",
    "temp2Piano",
    "mq3Piano",
    "temp3Piano",
    "mqSeminterrato",
    "tempSeminterrato",
    "mqGarage",
    "tempGarage",
    "altriLocaliPresenti",
    "altriLocaliDescrizione",
    "altriLocaliMq",
    "altriLocaliTemp",
    "nBagni",
    "nResidenti",
    "ospitiFrequenti",
    "usoVasche",
    "utilizzoVascheSett",
    "lavatriceAcs",
    "nLavatriceSett",
    "lavastoviglieAcs",
    "nLavastovigliaSett",
    "caldaiaMarcaModello",
    "condensazione",
    "potenzaKw",
    "anno",
    "combustibileCaldaia",
    "consumoCaldaia",
    "sistemaEmissione",
    "nRadiatori",
    "coperturaRadiatoriMq",
    "materialeRadiatori",
    "nFanCoil",
    "coperturaFanCoilMq",
    "superficiePavSoffittoMq",
    "generatoreBiomassa",
    "tipologiaGen2",
    "superficie2Gen",
    "consumoAnnuale2Gen",
    "dispositiviRinnovabili",
    "pdcKw",
    "scaldacquaPdcLitri",
    "fotovoltaicoKwp",
    "nPannelliSolari",
    "accumuloSolare",
    "capacitaAccumulo",
    "centraleTermica",
    "mqCentrale",
    "ambientiFreddi",
    "mqAmbientiFreddi",
    "tempAmbientiFreddi",
    "nuoviAmbienti",
    "mqNuoviAmbienti",
    "nuoviAmbientiPredisposizione",
    "induzione",
    "nUtilizziInduzione",
    "boilerElettrico",
    "noteSopralluogo",
  ],
];

type SubmitResult =
  | { status: "idle" }
  | { status: "success"; pageUrl: string | null }
  | { status: "error"; message: string };

export function TermicoForm() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<SubmitResult>({ status: "idle" });

  const form = useForm<TermicoFormInput>({
    resolver: zodResolver(termicoSchema),
    mode: "onBlur",
    defaultValues: {
      commerciale: undefined,
      nomeCognomeCliente: "",
      tipoEdificio: undefined,
      interventiMigliorativi: [],
      apeLegge10: undefined,
      mqPianoTerra: undefined as unknown as number,
      tempPianoTerra: undefined as unknown as number,
      altriLocaliPresenti: undefined,
      altriLocaliDescrizione: "",
      nBagni: undefined as unknown as number,
      nResidenti: undefined as unknown as number,
      ospitiFrequenti: undefined,
      usoVasche: undefined,
      lavatriceAcs: undefined,
      lavastoviglieAcs: undefined,
      caldaiaMarcaModello: "",
      condensazione: undefined,
      potenzaKw: undefined as unknown as number,
      anno: undefined as unknown as number,
      combustibileCaldaia: undefined,
      sistemaEmissione: [],
      materialeRadiatori: [],
      generatoreBiomassa: undefined,
      tipologiaGen2: [],
      dispositiviRinnovabili: undefined,
      accumuloSolare: undefined,
      centraleTermica: undefined,
      ambientiFreddi: undefined,
      nuoviAmbienti: undefined,
      nuoviAmbientiPredisposizione: undefined,
      induzione: undefined,
      boilerElettrico: undefined,
      noteSopralluogo: "",
      uploadBollettaEnergiaElettrica: [],
      uploadBollettaGas: [],
      uploadFattureIntegrative12Mesi: [],
      uploadFattureIntegrative12MesiBiomassa: [],
      uploadApeDocumento: [],
      uploadFotoEsterne: [],
      uploadFotoSerramenti: [],
      uploadFotoRadiatori: [],
      uploadFotoCaldaia: [],
      uploadFotoTargaCaldaia: [],
      uploadFotoCentraleTermica: [],
      uploadDisegniEPlanimetrie: [],
      uploadCentraleTermicaFile: [],
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

  async function onSubmit(values: TermicoFormInput) {
    setResult({ status: "idle" });
    try {
      const res = await fetch(termicoFormConfig.apiPath, {
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

  // Read the error message for a given field path (typed helper bypasses
  // the strict index signature of FieldErrors).
  const errorFor = (name: FieldPath<TermicoFormInput>): string | undefined => {
    const node = (errors as Record<string, { message?: string } | undefined>)[name];
    return node?.message;
  };

  // Tiny render helpers to keep the long step 3 readable.
  const numberField = (
    name: FieldPath<TermicoFormInput>,
    label: string,
    opts: { placeholder?: string; required?: boolean; hint?: string } = {},
  ) => (
    <Field
      label={label}
      required={opts.required}
      hint={opts.hint}
      error={errorFor(name)}
    >
      {(props) => (
        <Input
          {...props}
          type="number"
          inputMode="numeric"
          {...register(name, numberOrUndef)}
          placeholder={opts.placeholder}
        />
      )}
    </Field>
  );

  const siNoField = (name: FieldPath<TermicoFormInput>, label: string) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field label={label} required error={errorFor(name)}>
          {() => (
            <RadioGroup
              name={field.name}
              options={SI_NO}
              value={(field.value as string) ?? ""}
              onChange={field.onChange}
              invalid={Boolean(errorFor(name))}
              columns={2}
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
            eyebrow="Sopralluogo Termico"
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
                  {COMMERCIALE_TERMICO.map((p) => (
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
            description="Anagrafica del cliente."
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
            title="Dati del sopralluogo termico"
            description="Compila ogni sezione. I campi opzionali con la dicitura 'lasciare vuoto' possono essere saltati se non applicabili."
          >
            <SectionHeading>Riscaldamento</SectionHeading>
            <div className="grid gap-5">
              <Controller
                control={control}
                name="tipoEdificio"
                render={({ field }) => (
                  <Field
                    label="Indica la tipologia di edificio"
                    required
                    error={errors.tipoEdificio?.message}
                  >
                    {() => (
                      <RadioGroup
                        name={field.name}
                        options={TIPO_EDIFICIO_TERMICO}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        invalid={Boolean(errors.tipoEdificio)}
                        columns={2}
                      />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="interventiMigliorativi"
                render={({ field }) => (
                  <Field label="Interventi Migliorativi effettuati?" hint="Facoltativo">
                    {() => (
                      <CheckboxGrid
                        options={INTERVENTI_MIGLIORATIVI}
                        value={field.value ?? []}
                        onChange={field.onChange}
                        ariaLabel="Interventi migliorativi"
                        columns={2}
                      />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="apeLegge10"
                render={({ field }) => (
                  <Field label="APE - Legge 10?" required error={errors.apeLegge10?.message}>
                    {() => (
                      <RadioGroup
                        name={field.name}
                        options={SI_NO}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        invalid={Boolean(errors.apeLegge10)}
                        columns={2}
                      />
                    )}
                  </Field>
                )}
              />
            </div>

            <SectionHeading>Abitazione</SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2">
              {numberField("mqPianoTerra", "Inserisci i mq del Piano Terra", { required: true })}
              {numberField("tempPianoTerra", "Inserisci la temperatura in °C del Piano Terra", { required: true })}
              {numberField("mq1Piano", "Inserisci i mq del 1° Piano", { placeholder: "Se non presente lasciare vuoto" })}
              {numberField("temp1Piano", "Inserisci la temperatura in °C del 1° Piano", { placeholder: "Se non presente lasciare vuoto" })}
              {numberField("mq2Piano", "Inserisci i mq del 2° Piano", { placeholder: "Se non presente lasciare vuoto" })}
              {numberField("temp2Piano", "Inserisci la temperatura in °C del 2° Piano", { placeholder: "Se non presente lasciare vuoto" })}
              {numberField("mq3Piano", "Inserisci i mq del 3° Piano", { placeholder: "Se non presente lasciare vuoto" })}
              {numberField("temp3Piano", "Inserisci la temperatura in °C del 3° Piano", { placeholder: "Se non presente lasciare vuoto" })}
            </div>

            <SectionHeading>Locali di Servizio</SectionHeading>
            <p className="-mt-2 mb-4 rounded-md bg-success-soft px-3 py-2 text-[12.5px] font-medium leading-4 text-success">
              <span className="font-semibold">NOTA:</span> compilare solo le zone <span className="uppercase tracking-wide">riscaldate</span>, indicando temperatura e ambiente
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              {numberField("mqSeminterrato", "Inserisci i mq del Seminterrato", { placeholder: "Se non presente lasciare vuoto" })}
              {numberField("tempSeminterrato", "Inserisci la temperatura in °C del Seminterrato", { placeholder: "Se non presente lasciare vuoto" })}
              {numberField("mqGarage", "Inserisci i mq del Garage/Magazzino", { placeholder: "Se non presente lasciare vuoto" })}
              {numberField("tempGarage", "Inserisci la temperatura in °C del Garage/Magazzino", { placeholder: "Se non presente lasciare vuoto" })}
            </div>
            <div className="mt-5">{siNoField("altriLocaliPresenti", "Sono presenti altri locali?")}</div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field
                label="Descrivi il locale aggiuntivo"
                hint="Se non presenti lasciare vuoto"
                error={errors.altriLocaliDescrizione?.message}
                className="sm:col-span-2"
              >
                {(props) => (
                  <Input
                    {...props}
                    {...register("altriLocaliDescrizione")}
                    placeholder="Es. Mansarda, Studio, …"
                  />
                )}
              </Field>
              {numberField("altriLocaliMq", "Inserisci i mq del locale aggiuntivo", { placeholder: "Se no lasciare vuoto" })}
              {numberField("altriLocaliTemp", "Inserisci la temperatura in °C del locale aggiuntivo", { placeholder: "Se no lasciare vuoto" })}
            </div>

            <SectionHeading>Acqua Calda Sanitaria</SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2">
              {numberField("nBagni", "Inserisci il n° di Bagni", { required: true })}
              {numberField("nResidenti", "Inserisci il n° di Residenti", { required: true })}
              {siNoField("ospitiFrequenti", "Ci sono ospiti frequenti?")}
              {siNoField("usoVasche", "Fanno uso di Vasche?")}
              {numberField("utilizzoVascheSett", "Inserisci il n° di utilizzo vasche medio Settimanale", { placeholder: "Se no inserire 0" })}
              {siNoField("lavatriceAcs", "La Lavatrice è collegata al sistema ACS?")}
              {numberField("nLavatriceSett", "Inserisci il n° di utilizzo settimanale della lavatrice", { placeholder: "Se no inserire 0" })}
              {siNoField("lavastoviglieAcs", "La Lavastoviglie è collegata al sistema ACS?")}
              {numberField("nLavastovigliaSett", "Inserisci il n° di utilizzo settimanale della lavastoviglie", { placeholder: "Se no inserire 0" })}
            </div>

            <SectionHeading>Impianto di Riscaldamento Principale</SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Inserisci Marca e Modello della Caldaia"
                required
                error={errors.caldaiaMarcaModello?.message}
                className="sm:col-span-2"
              >
                {(props) => (
                  <Input {...props} {...register("caldaiaMarcaModello")} placeholder="Es. Vaillant ecoTEC plus" />
                )}
              </Field>
              {siNoField("condensazione", "La caldaia è a condensazione?")}
              {numberField("potenzaKw", "Inserisci la potenza in kW", { required: true })}
              {numberField("anno", "Inserisci l'anno", { required: true, placeholder: "2018" })}
              <Field
                label="Inserisci il combustibile della caldaia"
                required
                error={errors.combustibileCaldaia?.message}
              >
                {(props) => (
                  <Select {...props} {...register("combustibileCaldaia")} defaultValue="">
                    <option value="" disabled>
                      Seleziona…
                    </option>
                    {COMBUSTIBILE_CALDAIA.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              {numberField("consumoCaldaia", "Indica il consumo in kg o Litri in 12 mesi ( Se non è a Metano )", {
                placeholder: "Se a Metano lasciare vuoto",
              })}
              <Controller
                control={control}
                name="sistemaEmissione"
                render={({ field }) => (
                  <Field
                    label="Indica il sistema di emissione"
                    required
                    error={errors.sistemaEmissione?.message}
                    className="sm:col-span-2"
                  >
                    {() => (
                      <CheckboxGrid
                        options={SISTEMA_EMISSIONE}
                        value={field.value ?? []}
                        onChange={field.onChange}
                        ariaLabel="Sistema di emissione"
                        columns={2}
                      />
                    )}
                  </Field>
                )}
              />
              {numberField("nRadiatori", "Inserisci il numero di Radiatori", { placeholder: "Se non presente lasciare vuoto" })}
              {numberField("coperturaRadiatoriMq", "Inserisci i mq di copertura dei Radiatori", { placeholder: "Se non presente lasciare vuoto" })}
              <Controller
                control={control}
                name="materialeRadiatori"
                render={({ field }) => (
                  <Field label="Seleziona il materiale dei radiatori" hint="Facoltativo" className="sm:col-span-2">
                    {() => (
                      <CheckboxGrid
                        options={MATERIALE_RADIATORI}
                        value={field.value ?? []}
                        onChange={field.onChange}
                        ariaLabel="Materiale dei radiatori"
                        columns={2}
                      />
                    )}
                  </Field>
                )}
              />
              {numberField("nFanCoil", "Inserisci il numero di Fan Coil", { placeholder: "Se non presente lasciare vuoto" })}
              {numberField("coperturaFanCoilMq", "Inserisci i mq di copertura dei Fan Coil", { placeholder: "Se non presente lasciare vuoto" })}
              {numberField("superficiePavSoffittoMq", "Inserisci la superficie dell'impianto a pavimento/soffitto (mq)", { placeholder: "Se non presente lasciare vuoto" })}
            </div>

            <SectionHeading>Impianto di Riscaldamento Secondario</SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2">
              {siNoField("generatoreBiomassa", "Viene utilizzato un Generatore Secondario a Biomassa?")}
              <Controller
                control={control}
                name="tipologiaGen2"
                render={({ field }) => (
                  <Field label="Seleziona la tipologia del generatore secondario" hint="Facoltativo">
                    {() => (
                      <CheckboxGrid
                        options={TIPOLOGIA_GEN_2}
                        value={field.value ?? []}
                        onChange={field.onChange}
                        ariaLabel="Tipologia generatore secondario"
                        columns={2}
                      />
                    )}
                  </Field>
                )}
              />
              {numberField("superficie2Gen", "Inserisci la superficie che riscalda il 2° Generatore", { placeholder: "Se non presente lasciare vuoto" })}
              {numberField("consumoAnnuale2Gen", "Inserisci il consumo annuale di legna o pellet in kg", { placeholder: "Se non presente lasciare vuoto" })}
            </div>

            <SectionHeading>Energia Rinnovabile</SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2">
              {siNoField("dispositiviRinnovabili", "Vengono utilizzati dispositivi di energia Rinnovabile?")}
              {numberField("pdcKw", "Inserisci il Pdc in kW", { placeholder: "Se non presente lasciare vuoto o 0" })}
              {numberField("scaldacquaPdcLitri", "Scaldacqua Pdc in litri", { placeholder: "Se non presente lasciare vuoto o 0" })}
              {numberField("fotovoltaicoKwp", "Fotovoltaico kWp", { placeholder: "Se non presente lasciare vuoto o 0" })}
              {numberField("nPannelliSolari", "Inserisci il n° di Pannelli Solari Termici", { placeholder: "Se non presente lasciare vuoto o 0" })}
              {siNoField("accumuloSolare", "È previsto accumulo solare?")}
              {numberField("capacitaAccumulo", "Inserisci la quantità di accumulo in litri", { placeholder: "Se non presente lasciare vuoto o 0" })}
            </div>

            <SectionHeading>Centrale Termica</SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2">
              {siNoField("centraleTermica", "È presente la Centrale termica")}
              {numberField("mqCentrale", "Inserisci i mq netti della Centrale", { placeholder: "Se non presente lasciare vuoto o 0" })}
            </div>

            <SectionHeading>Altre Informazioni</SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2">
              {siNoField("ambientiFreddi", "Ci sono ambienti freddi da migliorare?")}
              {numberField("mqAmbientiFreddi", "Inserisci i mq dell'ambiente da migliorare", { placeholder: "Se non presente lasciare vuoto o 0" })}
              {numberField("tempAmbientiFreddi", "Inserisci la temperatura attuale ambiente freddo interna in °C", { placeholder: "Se non presente lasciare vuoto o 0" })}
              {siNoField("nuoviAmbienti", "Ci sono nuovi ambienti da riscaldare?")}
              {numberField("mqNuoviAmbienti", "Inserisci i mq dell'ambiente nuovo", { placeholder: "Se non presente lasciare vuoto o 0" })}
              {siNoField("nuoviAmbientiPredisposizione", "È già presente la predisposizione in questi nuovi ambienti?")}
            </div>

            <SectionHeading>Boiler e Induzione</SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2">
              {siNoField("induzione", "È presente l'induzione?")}
              {numberField("nUtilizziInduzione", "Inserisci il numero giornaliero di utilizzo induzione", { placeholder: "Se non presente lasciare vuoto o 0" })}
              <Controller
                control={control}
                name="boilerElettrico"
                render={({ field }) => (
                  <Field
                    label="È presente un boiler elettrico?"
                    required
                    error={errors.boilerElettrico?.message}
                    className="sm:col-span-2"
                  >
                    {() => (
                      <RadioGroup
                        name={field.name}
                        options={BOILER_ELETTRICO}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        invalid={Boolean(errors.boilerElettrico)}
                        columns={2}
                      />
                    )}
                  </Field>
                )}
              />
            </div>

            <SectionHeading>Note e allegati</SectionHeading>
            <Field
              label="Inserisci eventuali note"
              required
              error={errors.noteSopralluogo?.message}
            >
              {(props) => (
                <Textarea
                  {...props}
                  {...register("noteSopralluogo")}
                  rows={4}
                  placeholder="Annotazioni sul sopralluogo"
                />
              )}
            </Field>
            <SectionHeading>Allegati foto e documenti</SectionHeading>
            <p className="-mt-2 mb-4 text-[12.5px] text-fg-muted">
              Carica foto e bollette. Massimo 4 MB per file (le foto vengono compresse
              automaticamente). Più file per categoria sono ammessi.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <UploadGroup control={control} name="uploadBollettaEnergiaElettrica" label="Bolletta Energia Elettrica" accept="application/pdf,image/*" />
              <UploadGroup control={control} name="uploadBollettaGas" label="Bolletta Gas" accept="application/pdf,image/*" />
              <UploadGroup control={control} name="uploadFattureIntegrative12Mesi" label="Fatture Integrative 12 mesi" accept="application/pdf,image/*" />
              <UploadGroup control={control} name="uploadFattureIntegrative12MesiBiomassa" label="Fatture Integrative 12 mesi Biomassa" accept="application/pdf,image/*" />
              <UploadGroup control={control} name="uploadApeDocumento" label="APE Documento" accept="application/pdf,image/*" />
              <UploadGroup control={control} name="uploadFotoEsterne" label="Foto Esterne" />
              <UploadGroup control={control} name="uploadFotoSerramenti" label="Foto Serramenti" />
              <UploadGroup control={control} name="uploadFotoRadiatori" label="Foto Radiatori" />
              <UploadGroup control={control} name="uploadFotoCaldaia" label="Foto Caldaia" />
              <UploadGroup control={control} name="uploadFotoTargaCaldaia" label="Foto Targa Caldaia" />
              <UploadGroup control={control} name="uploadFotoCentraleTermica" label="Foto Centrale Termica" />
              <UploadGroup control={control} name="uploadDisegniEPlanimetrie" label="Disegni e Planimetrie" accept="application/pdf,image/*" />
              <UploadGroup control={control} name="uploadCentraleTermicaFile" label="Centrale Termica File" accept="application/pdf,image/*" />
            </div>
          </WizardStep>
        )}

        <WizardNav
          current={step}
          total={TOTAL_STEPS}
          onBack={back}
          onNext={next}
          isSubmitting={isSubmitting}
          submitLabel={termicoFormConfig.ui.submitLabel}
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
  | "uploadBollettaEnergiaElettrica"
  | "uploadBollettaGas"
  | "uploadFattureIntegrative12Mesi"
  | "uploadFattureIntegrative12MesiBiomassa"
  | "uploadApeDocumento"
  | "uploadFotoEsterne"
  | "uploadFotoSerramenti"
  | "uploadFotoRadiatori"
  | "uploadFotoCaldaia"
  | "uploadFotoTargaCaldaia"
  | "uploadFotoCentraleTermica"
  | "uploadDisegniEPlanimetrie"
  | "uploadCentraleTermicaFile";

function UploadGroup({
  control,
  name,
  label,
  accept,
}: {
  control: Control<TermicoFormInput>;
  name: UploadFieldName;
  label: string;
  accept?: string;
}) {
  return (
    <Controller
      control={control}
      name={name as FieldPath<TermicoFormInput>}
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
          Sopralluogo termico salvato.
        </h2>
        <p className="mt-2 text-[14px] leading-5 opacity-90">
          La scheda è stata creata nel database Schede S. Termico su Notion.
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
