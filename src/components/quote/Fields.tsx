"use client";

import { useId } from "react";
import { Check } from "@/components/site/Icons";
import { cx } from "@/lib/utils";
import { QUOTE_FIELD_LIMITS, type QuoteTextField } from "@/lib/quote";

/* --- Selectable card ------------------------------------------------------ */

export function ChoiceCard({
  type,
  name,
  value,
  label,
  note,
  checked,
  onChange,
  emphasis,
}: {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  label: string;
  note?: string;
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
  emphasis?: boolean;
}) {
  return (
    <label
      className={cx(
        "group relative flex cursor-pointer items-start gap-3 rounded-[4px] border bg-surface p-4 text-left",
        "transition-[border-color,background-color,box-shadow] duration-200",
        "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-trace",
        checked
          ? "border-prussian bg-[#bb4d2d08] shadow-[inset_0_0_0_1px_var(--color-prussian)]"
          : "border-rule hover:border-[#0b1a2138]",
        emphasis &&
          !checked &&
          "border-dashed border-[#a86c1559] bg-[#ed996f0a]",
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(value, e.target.checked)}
        className="sr-only"
      />

      <span
        aria-hidden="true"
        className={cx(
          "mt-[0.15rem] flex size-[1.125rem] shrink-0 items-center justify-center border transition-colors",
          type === "radio" ? "rounded-full" : "rounded-[2px]",
          checked
            ? "border-prussian bg-prussian"
            : "border-[#0b1a2140] bg-paper",
        )}
      >
        {type === "checkbox" && checked && (
          <Check className="size-3 text-white" strokeWidth={2.6} />
        )}
        {type === "radio" && checked && (
          <span className="size-1.5 rounded-full bg-white" />
        )}
      </span>

      <span className="min-w-0">
        <span
          className={cx(
            "block text-base font-medium leading-snug",
            checked ? "text-prussian" : "text-ink",
          )}
        >
          {label}
        </span>
        {note && (
          <span className="mt-1.5 block text-sm leading-relaxed text-ink-mute">
            {note}
          </span>
        )}
      </span>
    </label>
  );
}

/* --- Text fields ---------------------------------------------------------- */

export function Field({
  field,
  value,
  label,
  hint,
  error,
  required,
  optional,
  children,
}: {
  field: QuoteTextField;
  value: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
    className: string;
    maxLength: number;
  }) => React.ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const countId = `${id}-count`;
  const limit = QUOTE_FIELD_LIMITS[field];
  const describedBy = [hintId, errorId, countId].filter(Boolean).join(" ");

  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3">
        <span className="text-base font-medium text-ink">
          {label}
          {required && (
            <span className="ml-1 text-trace-deep" aria-hidden="true">
              *
            </span>
          )}
        </span>
        {optional && <span className="label text-ink-mute">Facultatif</span>}
      </label>

      {hint && (
        <p
          id={hintId}
          className="mt-1.5 text-sm leading-relaxed text-ink-mute"
        >
          {hint}
        </p>
      )}

      <div className="mt-2.5">
        {children({
          id,
          maxLength: limit,
          "aria-invalid": Boolean(error),
          "aria-describedby": describedBy,
          className: cx(
            "w-full rounded-[4px] border bg-surface px-3.5 py-3 text-base text-ink",
            "placeholder:text-[#9aa7ad] transition-[border-color,box-shadow] duration-200",
            "focus:outline-none focus:ring-0",
            error
              ? "border-[#b3261e] focus:border-[#b3261e] focus:shadow-[inset_0_0_0_1px_#b3261e]"
              : "border-rule focus:border-prussian focus:shadow-[inset_0_0_0_1px_var(--color-prussian)]",
          ),
        })}
      </div>

      <p id={countId} className={cx("mt-1.5 text-right font-mono text-[0.6875rem]", value.length >= limit ? "text-trace-deep" : "text-ink-mute")}>
        {value.length} / {limit} caractères
      </p>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-sm font-medium text-[#b3261e]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* --- Step heading --------------------------------------------------------- */

export function StepHeading({
  index,
  total,
  title,
  lead,
}: {
  index: number;
  total: number;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mb-8">
      {/* The mobile progress bar already announces the step; avoid saying it twice. */}
      <p className="label hidden text-trace-deep lg:block">
        Étape {index + 1} sur {total}
      </p>
      <h2 className="mt-0 font-display lg:mt-3 text-[clamp(1.5rem,3.2vw,2.125rem)] font-semibold leading-[1.1]">
        {title}
      </h2>
      {lead && (
        <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-soft">
          {lead}
        </p>
      )}
    </div>
  );
}
