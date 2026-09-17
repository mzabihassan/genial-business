"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_MIME,
  ASSETS,
  BUDGETS,
  FEATURES,
  FEATURE_UNSURE,
  MAX_FILES,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
  PROJECT_TYPES,
  SITUATIONS,
  STEPS,
  TIMELINES,
  emptyQuote,
  formatBytes,
  validateStep,
  type QuoteData,
} from "@/lib/quote";
import { ChoiceCard, Field, StepHeading } from "./Fields";
import {
  Alert,
  ArrowLeft,
  ArrowRight,
  Check,
  Close,
  Paperclip,
} from "@/components/site/Icons";
import { cx } from "@/lib/utils";
import { QuoteSubmission, type SubmissionStatus } from "./QuoteSubmission";

export function QuoteForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<QuoteData>(emptyQuote);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submission, setSubmission] = useState<SubmissionStatus | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submissionLock = useRef(false);
  const submitting = submission === "sending" || submission === "success";
  const [furthest, setFurthest] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef<number | null>(null);
  const previousStep = useRef(0);

  const last = STEPS.length - 1;
  const set = <K extends keyof QuoteData>(key: K, value: QuoteData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: "" } : e));
  };

  const toggleIn = (key: "assets" | "features", value: string, on: boolean) =>
    setData((d) => {
      let next = on ? [...d[key], value] : d[key].filter((v) => v !== value);
      // "Je ne sais pas" and a list of picks are mutually exclusive answers.
      if (key === "features") {
        if (value === FEATURE_UNSURE && on) next = [FEATURE_UNSURE];
        else if (on) next = next.filter((v) => v !== FEATURE_UNSURE);
      }
      if (key === "assets") {
        const none = "Aucun pour l’instant";
        if (value === none && on) next = [none];
        else if (on) next = next.filter((v) => v !== none);
      }
      return { ...d, [key]: next };
    });

  // Stamped on mount: the API rejects submissions completed faster than a
  // person could read the form.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Move focus to the new step so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
  }, [step]);

  const goTo = (next: number) => {
    setErrors({});
    setStep(next);
    setFurthest((f) => Math.max(f, next));
  };

  const handleNext = () => {
    const found = validateStep(step, data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => {
        const invalid = formRef.current?.querySelector<HTMLElement>(
          '[aria-invalid="true"]',
        );
        invalid?.focus();
      });
      return;
    }
    goTo(Math.min(step + 1, last));
  };

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setFileError(null);
    const next = [...files];

    for (const file of Array.from(incoming)) {
      if (next.length >= MAX_FILES) {
        setFileError(`${MAX_FILES} fichiers au maximum.`);
        break;
      }
      const ext = "." + (file.name.split(".").pop() ?? "").toLowerCase();
      if (!(ACCEPTED_EXTENSIONS as readonly string[]).includes(ext)) {
        setFileError(`Format non accepté : ${file.name}`);
        continue;
      }
      if (file.type && !ACCEPTED_MIME.has(file.type)) {
        setFileError(`Format non accepté : ${file.name}`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        setFileError(`${file.name} dépasse ${formatBytes(MAX_FILE_BYTES)}.`);
        continue;
      }
      const total = next.reduce((s, f) => s + f.size, 0) + file.size;
      if (total > MAX_TOTAL_BYTES) {
        setFileError(`Poids total limité à ${formatBytes(MAX_TOTAL_BYTES)}.`);
        break;
      }
      if (!next.some((f) => f.name === file.name && f.size === file.size)) {
        next.push(file);
      }
    }
    setFiles(next);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    // A synchronous lock also catches two events before React has re-rendered.
    if (submissionLock.current) return;
    if (step !== last) {
      handleNext();
      return;
    }

    if (submitting) return;
    for (let i = 0; i < last; i++) {
      const earlierErrors = validateStep(i, data);
      if (Object.keys(earlierErrors).length) {
        goTo(i);
        setErrors(earlierErrors);
        return;
      }
    }
    const found = validateStep(last, data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
      });
      return;
    }

    submissionLock.current = true;
    setAttempt((value) => value + 1);
    setSubmission("sending");
    setSubmitError(null);

    try {
      const body = new FormData();
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value)) value.forEach((v) => body.append(key, v));
        else body.append(key, String(value));
      }
      body.append(
        "elapsed",
        String(startedAt.current ? Date.now() - startedAt.current : 0),
      );
      body.append(
        "siteWebConf",
        String(new FormData(formRef.current!).get("siteWebConf") ?? ""),
      );
      files.forEach((f) => body.append("attachments", f));

      const res = await fetch("/api/devis", {
        method: "POST",
        body,
        signal: AbortSignal.timeout(60_000),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(res.status >= 500
          ? "La transmission est momentanément indisponible. Vous pouvez réessayer dans un instant."
          : payload?.error ?? "Envoi impossible pour le moment.");
      }
      const payload = await res.json();
      if (payload?.ok !== true) throw new Error("La confirmation de l’envoi n’a pas pu être vérifiée.");
      // Never hold the response for a decorative minimum animation duration.
      setSubmission("success");
    } catch (err) {
      setSubmitError(
        err instanceof Error && err.name === "TimeoutError"
          ? "La confirmation tarde à arriver. Vérifiez votre connexion et votre boîte email avant de réessayer."
          : err instanceof TypeError
            ? "La connexion a été interrompue. Vérifiez votre boîte email avant de réessayer : l’envoi a peut-être abouti."
          : err instanceof Error
          ? err.message
          : "Envoi impossible pour le moment. Réessayez ou écrivez-nous directement.",
      );
      submissionLock.current = false;
      setSubmission("error");
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <>
    {submission && (
      <QuoteSubmission
        key={attempt}
        status={submission}
        error={submitError}
        onRetry={() => void handleSubmit()}
        onEdit={() => setSubmission(null)}
        onContinue={() => router.replace("/devis/confirmation")}
      />
    )}
    <div className="grid gap-5 lg:grid-cols-12 lg:gap-16">
      {/* Progress rail */}
      <aside className="lg:col-span-4">
        <div className="quote-rail lg:sticky lg:top-28">
          {/* Mobile: a bar, because a 6-item list would eat the screen */}
          <div className="lg:hidden">
            <div className="flex items-baseline justify-between gap-4">
              <p className="label text-trace-deep">
                Étape {step + 1} / {STEPS.length}
              </p>
              <p className="text-sm font-medium text-ink">
                {STEPS[step].title}
              </p>
            </div>
            <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-wash">
              <div
                className="h-full rounded-full bg-prussian transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ol className="hidden lg:block">
            {STEPS.map((s, i) => {
              const done = i < step;
              const current = i === step;
              const reachable = i <= furthest;
              return (
                <li key={s.id} className="relative">
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={cx(
                        "absolute left-[9px] top-[1.55rem] bottom-[-0.35rem] w-px transition-colors duration-500",
                        done ? "bg-prussian" : "bg-rule",
                      )}
                    />
                  )}
                  <button
                    type="button"
                    disabled={!reachable || submitting}
                    onClick={() => {
                      if (!reachable) return;
                      if (i > step) {
                        for (let j = 0; j < i; j++) {
                          const found = validateStep(j, data);
                          if (Object.keys(found).length) {
                            goTo(j);
                            setErrors(found);
                            return;
                          }
                        }
                      }
                      goTo(i);
                    }}
                    aria-current={current ? "step" : undefined}
                    className={cx(
                      "relative flex w-full items-start gap-4 rounded-[3px] py-3 pr-2 text-left transition-opacity",
                      reachable
                        ? "cursor-pointer"
                        : "cursor-default opacity-45",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cx(
                        "mt-[1px] flex size-[19px] shrink-0 items-center justify-center rounded-[2px] border transition-colors duration-300",
                        done && "border-prussian bg-prussian",
                        current && "border-prussian bg-surface",
                        !done && !current && "border-rule bg-surface",
                      )}
                    >
                      {done ? (
                        <Check
                          className="size-3 text-white"
                          strokeWidth={2.6}
                        />
                      ) : (
                        <span
                          className={cx(
                            "font-mono text-[0.6875rem] font-medium",
                            current ? "text-prussian" : "text-ink-mute",
                          )}
                        >
                          {i + 1}
                        </span>
                      )}
                    </span>
                    <span
                      className={cx(
                        "text-base leading-tight transition-colors",
                        current
                          ? "font-semibold text-ink"
                          : done
                            ? "text-ink-soft"
                            : "text-ink-mute",
                      )}
                    >
                      {s.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <p className="mt-8 hidden border-t border-rule pt-6 text-sm leading-relaxed text-ink-mute lg:block">
            Le type de projet, sa description et vos coordonnées suffisent pour
            envoyer la demande. Le reste est facultatif.
          </p>
        </div>
      </aside>

      {/* The steps */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="quote-panel lg:col-span-8"
        aria-busy={submitting}
      >
        {/* Bots fill this in; people never see it */}
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden"
        >
          <label htmlFor="site-web-conf">Ne pas remplir</label>
          <input
            id="site-web-conf"
            name="siteWebConf"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div
          ref={headingRef}
          tabIndex={-1}
          key={step}
          className="scroll-mt-28 animate-[rise_0.45s_cubic-bezier(0.22,1,0.36,1)_both] outline-none"
        >
          {step === 0 && (
            <>
              <StepHeading
                index={0}
                total={STEPS.length}
                title="Que souhaitez-vous créer ?"
                lead="Choisissez l’option la plus proche. Si vous hésitez, nous en parlerons avec vous."
              />
              <div
                role="radiogroup"
                aria-label="Type de projet"
                aria-invalid={Boolean(errors.projectType)}
                aria-describedby={
                  errors.projectType ? "project-type-error" : undefined
                }
                tabIndex={-1}
                className="grid gap-3 sm:grid-cols-2"
              >
                {PROJECT_TYPES.map((t) => (
                  <ChoiceCard
                    key={t.value}
                    type="radio"
                    name="projectType"
                    value={t.value}
                    label={t.label}
                    note={t.note}
                    checked={data.projectType === t.value}
                    onChange={(v) => {
                      set("projectType", v);
                      setErrors((e) => ({ ...e, projectType: "" }));
                    }}
                    emphasis={t.value === "inconnu"}
                  />
                ))}
              </div>
              {errors.projectType && (
                <p
                  id="project-type-error"
                  role="alert"
                  className="mt-4 text-[0.875rem] font-medium text-[#b3261e]"
                >
                  {errors.projectType}
                </p>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <StepHeading
                index={1}
                total={STEPS.length}
                title="Parlez-nous de votre projet."
                lead="Décrivez votre idée avec vos propres mots. Aucun vocabulaire technique n’est nécessaire."
              />
              <div className="space-y-7">
                <Field
                  label="Votre projet"
                  required
                  hint="Expliquez ce que vous voulez faire, à qui le produit s’adresse et ce qui vous amène à ce projet."
                  error={errors.description}
                >
                  {(p) => (
                    <textarea
                      {...p}
                      name="description"
                      maxLength={8000}
                      rows={7}
                      value={data.description}
                      onChange={(e) => set("description", e.target.value)}
                      placeholder="Exemple : je gère un cabinet. Je voudrais que mes clients prennent rendez-vous en ligne et retrouvent leurs documents depuis un espace personnel."
                    />
                  )}
                </Field>

                {data.projectType === "autre" && (
                  <Field label="Quel type de projet ?" optional>
                    {(p) => (
                      <input
                        {...p}
                        name="projectTypeOther"
                        maxLength={200}
                        type="text"
                        value={data.projectTypeOther}
                        onChange={(e) =>
                          set("projectTypeOther", e.target.value)
                        }
                      />
                    )}
                  </Field>
                )}

                <Field label="Quel est l’objectif principal ?" optional>
                  {(p) => (
                    <input
                      {...p}
                      name="objective"
                      maxLength={500}
                      type="text"
                      value={data.objective}
                      onChange={(e) => set("objective", e.target.value)}
                      placeholder="Par exemple : gagner du temps ou remplacer un fichier Excel"
                    />
                  )}
                </Field>

                <Field label="À qui s’adresse-t-il ?" optional>
                  {(p) => (
                    <input
                      {...p}
                      name="audience"
                      maxLength={500}
                      type="text"
                      value={data.audience}
                      onChange={(e) => set("audience", e.target.value)}
                      placeholder="Par exemple : vos clients ou votre équipe"
                    />
                  )}
                </Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <StepHeading
                index={2}
                total={STEPS.length}
                title="Où en êtes-vous aujourd’hui ?"
                lead="Une idée suffit pour commencer. Indiquez simplement ce que vous avez déjà."
              />
              <div
                role="radiogroup"
                aria-label="Situation actuelle"
                className="grid gap-3 sm:grid-cols-2"
              >
                {SITUATIONS.map((s) => (
                  <ChoiceCard
                    key={s.value}
                    type="radio"
                    name="situation"
                    value={s.value}
                    label={s.label}
                    checked={data.situation === s.value}
                    onChange={(v) => set("situation", v)}
                  />
                ))}
              </div>

              <fieldset className="mt-10">
                <legend className="text-base font-medium text-ink">
                  Avez-vous déjà certains éléments ?
                </legend>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-mute">
                  Plusieurs réponses possibles.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {ASSETS.map((a) => (
                    <ChoiceCard
                      key={a}
                      type="checkbox"
                      name="assets"
                      value={a}
                      label={a}
                      checked={data.assets.includes(a)}
                      onChange={(v, on) => toggleIn("assets", v, on)}
                    />
                  ))}
                </div>
              </fieldset>
            </>
          )}

          {step === 3 && (
            <>
              <StepHeading
                index={3}
                total={STEPS.length}
                title="Quelles fonctions avez-vous déjà en tête ?"
                lead="Vous pouvez laisser cette étape vide. Nous identifierons les fonctions utiles pendant le cadrage."
              />

              <div className="mb-5">
                <ChoiceCard
                  type="checkbox"
                  name="features"
                  value={FEATURE_UNSURE}
                  label={FEATURE_UNSURE}
                  note="Nous vous aiderons à identifier les fonctionnalités utiles."
                  checked={data.features.includes(FEATURE_UNSURE)}
                  onChange={(v, on) => toggleIn("features", v, on)}
                  emphasis
                />
              </div>

              <fieldset className="transition-opacity duration-300">
                <legend className="sr-only">Fonctionnalités souhaitées</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {FEATURES.map((f) => (
                    <ChoiceCard
                      key={f}
                      type="checkbox"
                      name="features"
                      value={f}
                      label={f}
                      checked={data.features.includes(f)}
                      onChange={(v, on) => toggleIn("features", v, on)}
                    />
                  ))}
                </div>
              </fieldset>
            </>
          )}

          {step === 4 && (
            <>
              <StepHeading
                index={4}
                total={STEPS.length}
                title="Dans quel cadre ?"
                lead="Le budget et le délai nous aident à comprendre le contexte. Vous pouvez laisser ces réponses ouvertes."
              />

              <fieldset>
                <legend className="text-base font-medium text-ink">
                  Budget approximatif
                </legend>
                <div
                  role="radiogroup"
                  aria-label="Budget approximatif"
                  className="mt-4 grid gap-3 sm:grid-cols-2"
                >
                  {BUDGETS.map((b) => (
                    <ChoiceCard
                      key={b}
                      type="radio"
                      name="budget"
                      value={b}
                      label={b}
                      checked={data.budget === b}
                      onChange={(v) => set("budget", v)}
                      emphasis={b === "Je ne sais pas encore"}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-10">
                <legend className="text-base font-medium text-ink">
                  Délai souhaité
                </legend>
                <div
                  role="radiogroup"
                  aria-label="Délai souhaité"
                  className="mt-4 grid gap-3 sm:grid-cols-2"
                >
                  {TIMELINES.map((t) => (
                    <ChoiceCard
                      key={t}
                      type="radio"
                      name="timeline"
                      value={t}
                      label={t}
                      checked={data.timeline === t}
                      onChange={(v) => set("timeline", v)}
                      emphasis={t === "Je ne sais pas encore"}
                    />
                  ))}
                </div>
              </fieldset>
            </>
          )}

          {step === 5 && (
            <>
              <StepHeading
                index={5}
                total={STEPS.length}
                title="Comment vous joindre ?"
                lead="Un développeur lira votre demande et vous répondra pour en discuter."
              />

              <div className="quote-review">
                <div className="quote-review-title">
                  <strong>Votre projet en bref</strong>
                  <button type="button" onClick={() => goTo(1)}>
                    Modifier
                  </button>
                </div>
                <p>
                  {
                    PROJECT_TYPES.find((t) => t.value === data.projectType)
                      ?.label
                  }
                </p>
                <p className="mt-2">{data.description}</p>
                <small>
                  {data.budget || "Budget à définir"} ·{" "}
                  {data.timeline || "Délai à définir"}
                </small>
              </div>
              <div className="grid gap-7 sm:grid-cols-2">
                <Field label="Nom" required error={errors.name}>
                  {(p) => (
                    <input
                      {...p}
                      name="name"
                      maxLength={120}
                      type="text"
                      autoComplete="name"
                      value={data.name}
                      onChange={(e) => set("name", e.target.value)}
                    />
                  )}
                </Field>

                <Field label="Email" required error={errors.email}>
                  {(p) => (
                    <input
                      {...p}
                      name="email"
                      maxLength={200}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={data.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  )}
                </Field>

                <Field label="Société" optional>
                  {(p) => (
                    <input
                      {...p}
                      name="company"
                      maxLength={160}
                      type="text"
                      autoComplete="organization"
                      value={data.company}
                      onChange={(e) => set("company", e.target.value)}
                    />
                  )}
                </Field>

                <Field label="Téléphone" optional>
                  {(p) => (
                    <input
                      {...p}
                      name="phone"
                      maxLength={60}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={data.phone}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                  )}
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Site existant" optional>
                    {(p) => (
                      <input
                        {...p}
                        name="website"
                        maxLength={300}
                        type="url"
                        inputMode="url"
                        value={data.website}
                        onChange={(e) => set("website", e.target.value)}
                        placeholder="https://"
                      />
                    )}
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Message complémentaire" optional>
                    {(p) => (
                      <textarea
                        {...p}
                        name="message"
                        maxLength={4000}
                        rows={4}
                        value={data.message}
                        onChange={(e) => set("message", e.target.value)}
                        placeholder="Une contrainte, une échéance ou une question"
                      />
                    )}
                  </Field>
                </div>
              </div>

              {/* Attachments */}
              <div className="mt-8">
                <p className="text-base font-medium text-ink">
                  Pièces jointes{" "}
                  <span className="label ml-1 text-ink-mute">Facultatif</span>
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-mute">
                  Cahier des charges, maquettes, captures d’écran, documents.{" "}
                  {MAX_FILES} fichiers maximum, {formatBytes(MAX_FILE_BYTES)}{" "}
                  par fichier, {formatBytes(MAX_TOTAL_BYTES)} au total.
                  Formats&nbsp;: PDF, Word, texte, images, ZIP.
                </p>

                <label className="mt-4 flex cursor-pointer items-center justify-center gap-2.5 rounded-[4px] border border-dashed border-[#0b1a2130] bg-surface px-4 py-6 text-base font-medium text-ink transition-colors hover:border-prussian hover:bg-[#bb4d2d06] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-trace">
                  <Paperclip className="size-4 text-ink-mute" />
                  Ajouter des fichiers
                  <input
                    type="file"
                    multiple
                    accept={ACCEPTED_EXTENSIONS.join(",")}
                    className="sr-only"
                    onChange={(e) => {
                      handleFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>

                {fileError && (
                  <p
                    role="alert"
                    className="mt-3 text-sm font-medium text-[#b3261e]"
                  >
                    {fileError}
                  </p>
                )}

                {files.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {files.map((f) => (
                      <li
                        key={`${f.name}-${f.size}`}
                        className="flex items-center gap-3 rounded-[4px] border border-rule bg-surface px-3.5 py-2.5"
                      >
                        <span className="min-w-0 flex-1 truncate text-[0.9375rem] text-ink">
                          {f.name}
                        </span>
                        <span className="font-mono text-xs text-ink-mute">
                          {formatBytes(f.size)}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setFiles((cur) =>
                              cur.filter(
                                (c) =>
                                  !(c.name === f.name && c.size === f.size),
                              ),
                            )
                          }
                          className="-mr-1.5 inline-flex size-8 items-center justify-center rounded-[3px] text-ink-mute transition-colors hover:bg-wash hover:text-ink"
                        >
                          <span className="sr-only">Retirer {f.name}</span>
                          <Close className="size-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Consent */}
              <div className="mt-8">
                <label className="flex cursor-pointer items-start gap-3 rounded-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-prussian">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={data.consent}
                    aria-invalid={Boolean(errors.consent)}
                    onChange={(e) => {
                      set("consent", e.target.checked);
                      if (e.target.checked)
                        setErrors((er) => ({ ...er, consent: "" }));
                    }}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cx(
                      "mt-[0.1rem] flex size-[1.125rem] shrink-0 items-center justify-center rounded-[2px] border transition-colors",
                      data.consent
                        ? "border-prussian bg-prussian"
                        : errors.consent
                          ? "border-[#b3261e] bg-surface"
                          : "border-[#0b1a2140] bg-surface",
                    )}
                  >
                    {data.consent && (
                      <Check className="size-3 text-white" strokeWidth={2.6} />
                    )}
                  </span>
                  <span className="text-[0.9375rem] leading-relaxed text-ink-soft">
                    J’accepte que Genial Business utilise ces informations pour
                    étudier ma demande et me répondre. Elles ne sont ni
                    revendues ni utilisées à d’autres fins.{" "}
                    <a
                      href="/confidentialite"
                      className="link-underline font-medium text-ink"
                    >
                      Confidentialité
                    </a>
                    .
                  </span>
                </label>
                {errors.consent && (
                  <p
                    role="alert"
                    className="mt-2 pl-[1.875rem] text-sm font-medium text-[#b3261e]"
                  >
                    {errors.consent}
                  </p>
                )}
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="mt-6 flex items-start gap-3 rounded-[4px] border border-[#b3261e3d] bg-[#b3261e0a] p-4"
                >
                  <Alert className="mt-0.5 size-4 shrink-0 text-[#b3261e]" />
                  <p className="text-[0.9375rem] leading-relaxed text-ink">
                    {submitError}{" "}
                    <a
                      href="mailto:contact@genial-business.com"
                      className="link-underline font-medium"
                    >
                      contact@genial-business.com
                    </a>
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-rule pt-7 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className="btn btn-ghost"
              disabled={submitting}
            >
              <ArrowLeft className="size-4" />
              Retour
            </button>
          ) : (
            <span className="hidden sm:block" />
          )}

          {step >= 2 && step <= 4 && (
            <button
              type="button"
              onClick={() => goTo(step + 1)}
              className="text-link justify-center"
            >
              Passer cette étape
            </button>
          )}
          {step < last ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary btn-lg"
            >
              Continuer
              <ArrowRight className="arrow size-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={submitting}
            >
              {submitting ? "Envoi en cours…" : "Envoyer ma demande"}
              {!submitting && <ArrowRight className="arrow size-4" />}
            </button>
          )}
        </div>
      </form>
    </div>
    </>
  );
}
