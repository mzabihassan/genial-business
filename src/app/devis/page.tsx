import type { Metadata } from "next";
import { QuoteForm } from "@/components/quote/QuoteForm";

export const metadata: Metadata = {
  title: "Demander un devis",
  description:
    "Décrivez votre projet en quelques lignes. Aucun cahier des charges ni vocabulaire technique n’est nécessaire : nous vous aidons à déterminer ce que votre produit nécessite.",
  alternates: { canonical: "/devis" },
};

const reassurances = [
  {
    title: "Aucun document à préparer",
    body: "Quelques phrases avec vos mots suffisent pour commencer.",
  },
  {
    title: "Lu par un développeur",
    body: "Pas un formulaire qui tombe dans une boîte automatique.",
  },
  {
    title: "Sans engagement",
    body: "Une demande de devis ne vous engage à rien.",
  },
];

export default function DevisPage() {
  return (
    <>
      <section className="sheet-grid border-b border-rule pb-14 pt-32 md:pb-16 md:pt-40">
        <div className="shell">
          <p className="label eyebrow eyebrow-accent">Demande de devis</p>
          <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.25rem,5.2vw,3.75rem)] font-semibold leading-[1.02]">
            Parlez-nous de votre projet.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Six étapes courtes. Vous pouvez laisser de côté tout ce dont vous
            n’êtes pas sûr — c’est justement ce que nous sommes là pour définir
            avec vous.
          </p>

          <ul className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-3">
            {reassurances.map((r) => (
              <li key={r.title} className="border-t border-rule pt-4">
                <h2 className="text-[0.9375rem] font-semibold text-ink">{r.title}</h2>
                <p className="mt-1.5 text-[0.875rem] leading-snug text-ink-mute">
                  {r.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band-sm">
        <div className="shell">
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
