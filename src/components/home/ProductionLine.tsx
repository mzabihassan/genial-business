import { cx } from "@/lib/utils";

const stations = [
  { label: "Idée", note: "la vôtre" },
  { label: "Cadrage", note: "ce qu’il faut" },
  { label: "Design", note: "les écrans" },
  { label: "Développement", note: "le produit" },
  { label: "Validation", note: "les tests" },
  { label: "Mise en ligne", note: "en réel" },
];

/**
 * The transformation, drawn. A single measured run from the client’s idea to a
 * live product — the line draws itself once, then holds. It is the hero’s
 * argument, not decoration: every station is a stage we actually take on.
 */
export function ProductionLine({ className }: { className?: string }) {
  return (
    <div className={cx("relative", className)}>
      {/* Desktop: a measured horizontal run */}
      <div className="relative hidden sm:block">
        {/* The rail runs node-centre to node-centre, and stops at the terminus */}
        <div
          className="absolute top-[7px] h-px bg-rule"
          style={{ left: "7.5px", right: "calc(100% / 7 - 7.5px)" }}
          aria-hidden="true"
        />
        <div
          className="absolute top-[7px] h-px origin-left animate-[draw_1.5s_cubic-bezier(0.22,1,0.36,1)_0.35s_both] bg-prussian"
          style={{ left: "7.5px", right: "calc(100% / 7 - 7.5px)" }}
          aria-hidden="true"
        />

        <ol className="relative grid grid-cols-7">
          {stations.map((s, i) => (
            <li
              key={s.label}
              className="animate-[station_0.6s_cubic-bezier(0.22,1,0.36,1)_both]"
              style={{ animationDelay: `${450 + i * 180}ms` }}
            >
              <span
                className="block size-[15px] rotate-45 border border-prussian bg-paper"
                aria-hidden="true"
              />
              <span className="label mt-4 block text-ink">{s.label}</span>
              <span className="mt-1 block font-mono text-[0.6875rem] lowercase tracking-normal text-ink-mute">
                {s.note}
              </span>
            </li>
          ))}

          {/* Terminus */}
          <li
            className="animate-[station_0.7s_cubic-bezier(0.22,1,0.36,1)_both]"
            style={{ animationDelay: "1560ms" }}
          >
            <span
              className="block size-[15px] rotate-45 border border-trace bg-trace shadow-[0_0_0_5px_#e9a23b26]"
              aria-hidden="true"
            />
            <span className="label mt-4 block text-trace-deep">Produit</span>
            <span className="mt-1 block font-mono text-[0.6875rem] lowercase tracking-normal text-ink-mute">
              complet
            </span>
          </li>
        </ol>
      </div>

      {/* Mobile: the same run, turned on its side so labels stay full size */}
      <ol className="relative ml-[7px] border-l border-rule pl-6 sm:hidden">
        <span
          className="absolute -left-px top-0 w-px origin-top animate-[drawY_1.4s_cubic-bezier(0.22,1,0.36,1)_0.3s_both] bg-prussian"
          style={{ height: "100%" }}
          aria-hidden="true"
        />
        {[...stations, { label: "Produit", note: "complet" }].map((s, i, arr) => {
          const last = i === arr.length - 1;
          return (
            <li
              key={s.label}
              className="relative animate-[station_0.5s_cubic-bezier(0.22,1,0.36,1)_both] pb-5 last:pb-0"
              style={{ animationDelay: `${400 + i * 120}ms` }}
            >
              <span
                aria-hidden="true"
                className={cx(
                  "absolute -left-[30px] top-[5px] block size-[11px] rotate-45 border bg-paper",
                  last ? "border-trace bg-trace" : "border-prussian",
                )}
              />
              <span className={cx("label block", last ? "text-trace-deep" : "text-ink")}>
                {s.label}
              </span>
              <span className="font-mono text-[0.6875rem] lowercase tracking-normal text-ink-mute">
                {s.note}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
