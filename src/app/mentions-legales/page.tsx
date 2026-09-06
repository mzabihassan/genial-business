import type { Metadata } from "next";
import { legal, LEGAL_UPDATED } from "@/lib/legal";
import { site } from "@/lib/site";
import { Prose } from "@/components/site/Prose";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site genial-business.com.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <section className="band pt-32 md:pt-40">
      <div className="shell">
        <p className="label eyebrow eyebrow-accent">Informations</p>
        <h1 className="mt-6 font-display text-[clamp(2rem,4.6vw,3.25rem)] font-semibold leading-[1.03]">
          Mentions légales
        </h1>
        <p className="mt-4 font-mono text-[0.75rem] text-ink-mute">
          Dernière mise à jour : {LEGAL_UPDATED}
        </p>

        <Prose className="mt-14">
          <h2>Éditeur du site</h2>
          <dl>
            <dt>Dénomination</dt>
            <dd>{legal.companyName}</dd>
            <dt>Forme juridique</dt>
            <dd>{legal.legalForm}</dd>
            {legal.capital && (
              <>
                <dt>Capital social</dt>
                <dd>{legal.capital}</dd>
              </>
            )}
            <dt>Siège social</dt>
            <dd>{legal.address}</dd>
            <dt>SIRET</dt>
            <dd>{legal.siret}</dd>
            {legal.rcs && (
              <>
                <dt>RCS</dt>
                <dd>{legal.rcs}</dd>
              </>
            )}
            {legal.vat && (
              <>
                <dt>TVA intracommunautaire</dt>
                <dd>{legal.vat}</dd>
              </>
            )}
            <dt>Directeur de la publication</dt>
            <dd>{legal.director}</dd>
            <dt>Contact</dt>
            <dd>
              <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>
            </dd>
          </dl>

          <h2>Hébergement</h2>
          <dl>
            <dt>Hébergeur</dt>
            <dd>{legal.hostName}</dd>
            {legal.hostAddress && (
              <>
                <dt>Adresse</dt>
                <dd>{legal.hostAddress}</dd>
              </>
            )}
          </dl>

          <h2>Propriété intellectuelle</h2>
          <p>
            L’ensemble des contenus présents sur {site.domain} — textes, éléments
            graphiques, identité visuelle, code du site — est la propriété de{" "}
            {legal.companyName}, sauf mention contraire. Toute reproduction ou
            représentation, totale ou partielle, sans autorisation écrite préalable
            est interdite.
          </p>
          <p>
            Les captures d’écran des projets présentés en réalisations illustrent
            des produits développés par {legal.companyName}. Les marques, logos et
            contenus qui y figurent restent la propriété de leurs titulaires
            respectifs.
          </p>

          <h2>Responsabilité</h2>
          <p>
            Les informations publiées sur ce site sont fournies à titre indicatif.
            {" "}{legal.companyName} s’efforce d’en assurer l’exactitude et la mise à
            jour, sans pouvoir garantir qu’elles soient exemptes d’erreurs. Le site
            peut contenir des liens vers des sites tiers, sur le contenu desquels{" "}
            {legal.companyName} n’exerce aucun contrôle.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Le traitement des informations transmises via le formulaire de demande
            de devis est décrit dans notre{" "}
            <a href="/confidentialite">politique de confidentialité</a>.
          </p>
        </Prose>
      </div>
    </section>
  );
}
