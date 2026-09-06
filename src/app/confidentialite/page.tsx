import type { Metadata } from "next";
import { legal, LEGAL_UPDATED } from "@/lib/legal";
import { Prose } from "@/components/site/Prose";
import { MAX_FILES, formatBytes, MAX_TOTAL_BYTES } from "@/lib/quote";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Quelles données Genial Business collecte via le formulaire de devis, pourquoi, combien de temps elles sont conservées, et comment exercer vos droits.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <section className="band pt-32 md:pt-40">
      <div className="shell">
        <p className="label eyebrow eyebrow-accent">Informations</p>
        <h1 className="mt-6 font-display text-[clamp(2rem,4.6vw,3.25rem)] font-semibold leading-[1.03]">
          Politique de confidentialité
        </h1>
        <p className="mt-4 font-mono text-[0.75rem] text-ink-mute">
          Dernière mise à jour : {LEGAL_UPDATED}
        </p>

        <Prose className="mt-14">
          <h2>En résumé</h2>
          <p>
            Ce site ne dépose aucun cookie publicitaire et ne suit pas votre
            navigation. Les seules données que nous collectons sont celles que vous
            nous transmettez volontairement dans le formulaire de demande de devis,
            et elles servent uniquement à vous répondre.
          </p>

          <h2>Responsable du traitement</h2>
          <p>
            {legal.companyName}, {legal.address}. Pour toute question relative à vos
            données : <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>.
          </p>

          <h2>Données collectées</h2>
          <p>
            Lorsque vous remplissez le formulaire de demande de devis, nous
            recevons :
          </p>
          <ul>
            <li>
              vos coordonnées : nom, adresse email, et si vous les renseignez,
              société, téléphone et site existant&nbsp;;
            </li>
            <li>
              la description de votre projet, ainsi que les réponses facultatives
              sur son type, votre situation, les fonctionnalités envisagées, le
              budget et le délai&nbsp;;
            </li>
            <li>
              les pièces jointes que vous choisissez d’envoyer ({MAX_FILES} fichiers
              maximum, {formatBytes(MAX_TOTAL_BYTES)} au total)&nbsp;;
            </li>
            <li>la date de réception de la demande.</li>
          </ul>
          <p>
            Aucun champ n’est obligatoire en dehors de la description de votre
            projet, de votre nom et de votre adresse email : ce sont les seules
            informations dont nous avons besoin pour vous répondre.
          </p>

          <h2>Finalité et base légale</h2>
          <p>
            Ces informations sont utilisées exclusivement pour étudier votre demande,
            vous répondre, et le cas échéant établir une proposition commerciale. La
            base légale est votre consentement, recueilli explicitement au moment de
            l’envoi du formulaire, ainsi que l’exécution de mesures précontractuelles
            prises à votre demande.
          </p>

          <h2>Destinataires</h2>
          <p>
            Votre demande est transmise par email à l’équipe de {legal.companyName}.
            Elle n’est ni revendue, ni louée, ni transmise à des tiers à des fins
            commerciales. Seuls notre hébergeur et notre prestataire d’envoi d’emails
            en assurent techniquement l’acheminement.
          </p>

          <h2>Durée de conservation</h2>
          <p>
            Les demandes sans suite sont conservées trois ans à compter du dernier
            échange, puis supprimées. Les demandes ayant donné lieu à un contrat sont
            conservées pendant la durée de la relation commerciale, puis pendant les
            durées légales de conservation applicables.
          </p>

          <h2>Vos droits</h2>
          <p>
            Vous disposez d’un droit d’accès, de rectification, d’effacement, de
            limitation et d’opposition sur vos données, ainsi que d’un droit à la
            portabilité. Vous pouvez retirer votre consentement à tout moment. Pour
            exercer ces droits, écrivez-nous à{" "}
            <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a> : nous
            répondons sous un mois. Vous pouvez également introduire une réclamation
            auprès de la CNIL (
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
              cnil.fr
            </a>
            ).
          </p>

          <h2>Cookies et mesure d’audience</h2>
          <p>
            Ce site ne dépose pas de cookie de suivi ni de cookie publicitaire, et
            n’utilise pas d’outil de mesure d’audience nécessitant votre
            consentement. Aucune bannière de cookies n’est donc affichée. Si cela
            devait changer, cette page serait mise à jour et votre consentement
            recueilli au préalable.
          </p>

          <h2>Sécurité</h2>
          <p>
            Le site est servi en HTTPS. Les demandes de devis sont transmises par un
            canal chiffré et les pièces jointes sont contrôlées (format et taille)
            avant traitement. Nous limitons l’accès aux demandes aux seules personnes
            qui doivent les traiter.
          </p>

          <h2>Liens externes</h2>
          <p>
            Les projets présentés en réalisations renvoient vers des sites tiers, qui
            appliquent leurs propres politiques de confidentialité.
          </p>
        </Prose>
      </div>
    </section>
  );
}
