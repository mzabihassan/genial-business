import { cx } from "@/lib/utils";

/** Long-form legal copy: one place that owns its rhythm. */
export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "max-w-2xl text-base leading-relaxed text-ink-soft md:text-[1.0625rem]",
        "[&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-[1.375rem] [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-ink first:[&_h2]:mt-0",
        "[&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-[1.0625rem] [&_h3]:font-semibold [&_h3]:text-ink",
        "[&_p]:mt-4 [&_ul]:mt-4 [&_ul]:space-y-2 [&_li]:pl-5 [&_li]:relative",
        "[&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.65em] [&_li]:before:h-px [&_li]:before:w-2.5 [&_li]:before:bg-[#0b1a2130]",
        "[&_dl]:mt-4 [&_dt]:mt-4 [&_dt]:font-mono [&_dt]:text-xs [&_dt]:uppercase [&_dt]:tracking-[0.09em] [&_dt]:text-ink-mute [&_dd]:mt-1 [&_dd]:text-ink",
        "[&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
