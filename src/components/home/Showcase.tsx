import Link from "next/link";
import { projects } from "@/content/projects";
import { ProjectFrame } from "@/components/site/ProjectFrame";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowRight, ArrowUpRight } from "@/components/site/Icons";
import { cx, delay } from "@/lib/utils";

export function Showcase() {
  return (
    <section id="realisations" className="band border-b border-rule">
      <div className="shell">
        <SectionHeading
          eyebrow="Réalisations"
          title="Des produits complets, en ligne."
          lead="Deux produits que nous avons conçus et construits. Vous pouvez les ouvrir : ce ne sont pas des maquettes."
        />

        <div className="mt-14 space-y-20 md:mt-20 md:space-y-28">
          {projects.map((p, i) => (
            <article
              key={p.slug}
              className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
            >
              <div
                data-reveal="scale"
                className={cx(
                  "lg:col-span-7",
                  i % 2 === 1 && "lg:order-2",
                )}
              >
                <ProjectFrame project={p} priority={i === 0} />
              </div>

              <div
                data-reveal={i % 2 === 1 ? "left" : "right"}
                style={delay(80)}
                className={cx("lg:col-span-5", i % 2 === 1 && "lg:order-1")}
              >
                <p className="label text-ink-mute">{p.sector}</p>
                <h3 className="mt-3 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                  {p.name}
                </h3>
                <p className="mt-3 text-lg leading-snug text-prussian">{p.tagline}</p>
                <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {p.summary}
                </p>

                <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-ink-mute">
                  {p.capabilities.slice(0, 6).map((c, j, arr) => (
                    <li key={c}>
                      {c}
                      {j < arr.length - 1 && (
                        <span aria-hidden="true" className="ml-2 text-rule">
                          ·
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-ink"
                  >
                    Ouvrir {p.domain}
                    <ArrowUpRight className="size-4" />
                  </a>
                  <Link
                    href="/realisations"
                    className="link-underline inline-flex items-center gap-1.5 text-[0.9375rem] text-ink-soft"
                  >
                    Ce que contient le produit
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
