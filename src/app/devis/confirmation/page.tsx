import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, ArrowUpRight } from "@/components/site/Icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Demande reçue",
  description: "Votre demande de devis a bien été transmise à Genial Business.",
  robots: { index: false, follow: false },
};

const next = [
  {
    n: "01",
    title: "Nous lisons votre demande",
    body: "Un développeur la lit en entier, avec les documents que vous avez joints.",
  },
  {
    n: "02",
    title: "Nous revenons vers vous",
    body: "Nous vous contactons pour en discuter et préciser les points nécessaires au cadrage.",
  },
  {
    n: "03",
    title: "Vous recevez une proposition",
    body: "Le devis s’appuie sur un périmètre écrit et indique clairement ce qui est inclus.",
  },
];

export default function ConfirmationPage() {
  return (
    <section className="sheet-grid flex min-h-[100svh] items-center pb-24 pt-36 md:pt-40">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <span
              aria-hidden="true"
              className="inline-flex size-12 items-center justify-center rounded-[4px] bg-trace"
            >
              <Check className="size-6 text-prussian-ink" strokeWidth={2.2} />
            </span>

            <h1 className="mt-8 font-display text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-[1.02]">
              Demande reçue.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
              Un développeur va lire votre demande et vous contacter. Une copie
              vient également de vous être envoyée par email.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/realisations" className="btn btn-primary">
                Voir nos réalisations
                <ArrowRight className="arrow size-4" />
              </Link>
              <Link href="/" className="btn btn-ghost">
                Retour à l’accueil
              </Link>
            </div>

            <p className="mt-8 text-[0.9375rem] leading-relaxed text-ink-mute">
              Un élément à ajouter&nbsp;?{" "}
              <a
                href={`mailto:${site.email}`}
                className="link-underline inline-flex items-center gap-1 font-medium text-ink"
              >
                {site.email}
                <ArrowUpRight className="size-3.5" />
              </a>
            </p>
          </div>

          <div className="lg:col-span-6 lg:pl-8">
            <p className="label text-ink-mute">Ce qui se passe ensuite</p>
            <ol className="mt-6 border-t border-rule">
              {next.map((s) => (
                <li key={s.n} className="flex gap-5 border-b border-rule py-5">
                  <span className="font-mono text-sm font-medium text-trace-deep">
                    {s.n}
                  </span>
                  <div>
                    <h2 className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em]">
                      {s.title}
                    </h2>
                    <p className="mt-1.5 text-base leading-relaxed text-ink-soft">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
