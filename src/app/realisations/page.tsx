import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { ProjectFrame } from "@/components/site/ProjectFrame";
import { CtaBand } from "@/components/site/CtaBand";
import { ArrowUpRight, Check } from "@/components/site/Icons";
import { cx, delay } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Réalisations — produits conçus et développés",
  description:
    "ISIIL et Profaly : deux produits digitaux complets conçus et développés par Genial Business, du site public à l’administration, aux paiements et à la mise en ligne.",
  alternates: { canonical: "/realisations" },
};

export default function RealisationsPage() {
  return (
    <>
      <section className="sheet-grid border-b border-rule pb-14 pt-32 md:pb-16 md:pt-44">
        <div className="shell">
          <p className="label eyebrow eyebrow-accent">Réalisations</p>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.25rem,5.4vw,4rem)] font-semibold leading-[1.02]">
            Des produits en ligne, pas des maquettes.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
            Deux produits complets que nous avons conçus et construits. Chaque
            capture ci-dessous ouvre le site réel&nbsp;: allez-y, regardez.
          </p>
        </div>
      </section>

      {projects.map((p, i) => (
        <section
          key={p.slug}
          id={p.slug}
          className={cx(
            "band scroll-mt-24 border-b border-rule",
            i % 2 === 1 && "bg-surface",
          )}
        >
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  <p className="label text-ink-mute">{p.sector}</p>
                  <h2
                    data-reveal
                    className="mt-3 font-display text-[clamp(2rem,4.4vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
                  >
                    {p.name}
                  </h2>
                  <p
                    data-reveal
                    style={delay(60)}
                    className="mt-4 text-[1.125rem] leading-snug text-prussian"
                  >
                    {p.tagline}
                  </p>
                  <p
                    data-reveal
                    style={delay(100)}
                    className="mt-6 text-[0.9375rem] leading-relaxed text-ink-soft"
                  >
                    {p.summary}
                  </p>

                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary mt-8"
                  >
                    Ouvrir {p.domain}
                    <ArrowUpRight className="arrow size-4" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div data-reveal="scale">
                  <ProjectFrame project={p} priority={i === 0} />
                </div>

                <div className="mt-12">
                  <h3 className="label text-trace-deep">Les surfaces du produit</h3>
                  <ol className="mt-5 border-t border-rule">
                    {p.surfaces.map((s, j) => (
                      <li
                        key={s.title}
                        data-reveal
                        style={delay(j * 45)}
                        className="grid gap-1 border-b border-rule py-4 md:grid-cols-[minmax(0,13rem)_1fr] md:gap-8"
                      >
                        <h4 className="text-[0.9375rem] font-semibold text-ink">
                          {s.title}
                        </h4>
                        <p className="text-[0.9375rem] leading-relaxed text-ink-soft">
                          {s.note}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="mt-10">
                  <h3 className="label text-trace-deep">Ce que contient le produit</h3>
                  <ul className="mt-5 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                    {p.capabilities.map((c) => (
                      <li
                        key={c}
                        className="flex items-baseline gap-2.5 text-[0.9375rem] text-ink"
                      >
                        <Check
                          className="size-[0.875rem] shrink-0 translate-y-0.5 text-prussian"
                          strokeWidth={2.2}
                        />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <CtaBand
        title="Votre produit peut être le prochain."
        lead="Décrivez-nous votre idée. Nous identifions ce qu’elle demande pour devenir un produit utilisable, puis nous vous envoyons une proposition."
      />
    </>
  );
}
