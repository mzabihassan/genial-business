import { pageMetadata } from "@/lib/metadata";
import { QuoteForm } from "@/components/quote/QuoteForm";

export const metadata = pageMetadata({
  title: "Demander un devis",
  description:
    "Décrivez votre projet en quelques lignes. Aucun cahier des charges ni vocabulaire technique n’est nécessaire : nous vous aidons à définir votre produit.",
  path: "/devis",
});
export default function DevisPage() {
  return (
    <>
      <section className="quote-intro">
        <div className="shell">
          <h1>Parlez-nous de votre idée.</h1>
          <p>
            Décrivez ce que vous voulez faire avec vos propres mots. Vous pouvez
            laisser les questions de contexte sans réponse.
          </p>
          <p className="quote-reassurance-line">
            Aucun cahier des charges à préparer. Un développeur lit chaque demande.
          </p>
        </div>
      </section>
      <section className="pb-20 pt-4">
        <div className="shell">
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
