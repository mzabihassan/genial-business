import { cx } from "@/lib/utils";

/**
 * The mark is the thesis in 24px: a thin outlined band on top — the interface
 * people picture — sitting on the solid strata that actually make it a product.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cx("size-6 shrink-0", className)}
    >
      <rect
        x="1.1"
        y="1.1"
        width="21.8"
        height="21.8"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M1.1 8.6h21.8" stroke="currentColor" strokeWidth="1.7" />
      <rect
        x="4.6"
        y="11.6"
        width="14.8"
        height="2.1"
        rx="0.6"
        fill="currentColor"
      />
      <rect
        x="4.6"
        y="15.9"
        width="9.6"
        height="2.1"
        rx="0.6"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <span className="brand-mark">
        <LogoMark />
      </span>
      <span className="font-display text-[1.1875rem] font-semibold leading-none tracking-[-0.03em] text-current">
        Genial Business
      </span>
    </span>
  );
}
