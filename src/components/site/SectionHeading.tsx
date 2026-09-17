import { cx } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
  size = "lg",
  accent = true,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  className?: string;
  size?: "lg" | "md";
  accent?: boolean;
}) {
  return (
    <div className={cx("max-w-3xl", className)}>
      {eyebrow && <p className={cx("label eyebrow", accent && "eyebrow-accent")}>
        {eyebrow}
      </p>}
      <h2
        className={cx(
          "font-display font-semibold",
          eyebrow && "mt-6",
          size === "lg"
            ? "text-[clamp(2rem,4.6vw,3.5rem)] leading-[1.02]"
            : "text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.05]",
        )}
      >
        {title}
      </h2>
      {lead && (
        <p
          className="mt-6 text-lg leading-relaxed text-ink-soft"
        >
          {lead}
        </p>
      )}
    </div>
  );
}
