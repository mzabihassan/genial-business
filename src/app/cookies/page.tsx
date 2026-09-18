import { pageMetadata } from "@/lib/metadata";
import { Prose } from "@/components/site/Prose";

export const metadata = pageMetadata({
  title: "Cookies",
  description:
    "Informations sur les cookies et traceurs utilisés sur le site Genial Business.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <section className="band pt-32 md:pt-40">
      <div className="shell">
        <p className="label eyebrow eyebrow-accent">Informations</p>
        <h1 className="mt-6 font-display text-[clamp(2rem,4.6vw,3.25rem)] font-semibold leading-[1.03]">
          Cookies
        </h1>
        <Prose className="mt-14">
          <h2>Traceurs sur ce site</h2>
          <p>
            Genial Business ne charge actuellement aucun outil de publicité, de
            profilage ou de mesure d’audience et ne configure aucun cookie de suivi.
            Le formulaire de devis conserve vos réponses temporairement dans la page
            pendant que vous le remplissez&nbsp;: il n’utilise pas de stockage local
            dans votre navigateur.
          </p>

          <h2>Consentement</h2>
          <p>
            Aucun traceur soumis à votre consentement n’étant configuré, le site
            n’affiche pas de bandeau de cookies. Si de tels services sont ajoutés,
            ils ne seront activés qu’après la mise en place de l’information et du
            choix requis.
          </p>

          <h2>Données techniques</h2>
          <p>
            L’hébergement du site et la protection du formulaire impliquent le
            traitement de certaines données techniques, notamment l’adresse IP lors
            d’une demande de devis. Ce traitement est décrit dans la{" "}
            <a href="/confidentialite">politique de confidentialité</a>.
          </p>
        </Prose>
      </div>
    </section>
  );
}
