import Link from "next/link";
import { ArrowRight } from "@/components/site/Icons";
import { delay } from "@/lib/utils";

const reassurances = [
  "Aucun cahier des charges requis",
  "Étudié par un développeur",
  "Sans engagement",
];

export function CtaBand({
  title = "Décrivez-nous votre projet.",
  lead = "Quelques lignes suffisent pour commencer. Nous revenons vers vous avec les bonnes questions, puis une proposition claire.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-prussian text-[#c8dae3]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff10 1px, transparent 1px), linear-gradient(to bottom, #ffffff10 1px, transparent 1px)",
          backgroundSize: "4.5rem 4.5rem",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-32 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,#e9a23b1f_0%,transparent_65%)]"
      />

      <div className="shell relative band-sm">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <h2
              data-reveal
              className="font-display text-[clamp(2rem,4.6vw,3.25rem)] font-semibold leading-[1.04] text-paper"
            >
              {title}
            </h2>
            <p
              data-reveal
              style={delay(80)}
              className="mt-6 max-w-xl text-lg leading-relaxed"
            >
              {lead}
            </p>
          </div>

          <div data-reveal style={delay(140)} className="lg:col-span-5">
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link href="/devis" className="btn btn-marker btn-lg">
                Demander un devis
                <ArrowRight className="arrow size-4" />
              </Link>
              <Link href="/realisations" className="btn btn-ghost btn-lg on-dark">
                Voir nos réalisations
              </Link>
            </div>

            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 lg:justify-end">
              {reassurances.map((r) => (
                <li key={r} className="label text-[#8fa9b5]">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
