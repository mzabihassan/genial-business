import { process } from "@/content/process";
import { SectionHeading } from "@/components/site/SectionHeading";
import { cx, delay } from "@/lib/utils";

const yours = process.filter((s) => s.side === "vous").length;

/**
 * Two lanes, because who acts is the information that matters here: of eight
 * steps only three ask anything of the client. The alternation is the message.
 */
export function Process() {
  return (
    <section id="methode" className="band border-b border-rule bg-surface">
      <div className="shell">
        <SectionHeading
          eyebrow="Comment se passe un projet"
          title="Huit étapes. Trois vous demandent quelque chose."
          lead="Vous n’avez pas de document à préparer ni de décision technique à prendre. Voici ce qui se passe entre le premier message et le produit en ligne."
        />

        {/* Lane headers, desktop only — on mobile each step carries its own tag */}
        <div
          className="mt-16 hidden grid-cols-2 gap-16 md:grid"
          aria-hidden="true"
          data-reveal="none"
        >
          <p className="label text-right text-trace-deep">Vous · {yours} étapes</p>
          <p className="label text-prussian">Nous · {process.length - yours} étapes</p>
        </div>

        <ol className="relative mt-8 md:mt-6">
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-[7px] top-2 w-px bg-rule md:left-1/2 md:-translate-x-1/2"
          />

          {process.map((s) => {
            const isYou = s.side === "vous";
            return (
              <li
                key={s.n}
                data-reveal={isYou ? "left" : "right"}
                style={delay(40)}
                className="relative grid pb-10 pl-8 last:pb-0 md:grid-cols-2 md:gap-x-16 md:pb-12 md:pl-0"
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    "absolute left-[7px] top-[9px] size-[13px] -translate-x-1/2 rotate-45 border-[1.5px] md:left-1/2",
                    isYou ? "border-trace bg-trace" : "border-prussian bg-surface",
                  )}
                />

                <div
                  className={cx(
                    isYou
                      ? "md:col-start-1 md:pr-16 md:text-right"
                      : "md:col-start-2 md:pl-16",
                  )}
                >
                  <div
                    className={cx(
                      "flex items-baseline gap-3",
                      isYou && "md:justify-end",
                    )}
                  >
                    <span
                      className={cx(
                        "font-mono text-[0.8125rem] font-medium",
                        isYou ? "text-trace-deep" : "text-prussian",
                      )}
                    >
                      {s.n}
                    </span>
                    <span className="label text-ink-mute md:hidden">
                      {isYou ? "Vous" : "Nous"}
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-[1.25rem] font-semibold tracking-[-0.025em] md:text-[1.375rem]">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-[0.9375rem] font-medium text-ink">
                    {s.summary}
                  </p>
                  <p
                    className={cx(
                      "mt-2.5 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft",
                      isYou && "md:ml-auto",
                    )}
                  >
                    {s.detail}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
