import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { Prose } from "@/components/site/Prose";

export const metadata = pageMetadata({
  title: "Mentions légales",
  description:
    "Identification de l’éditeur de Genial Business, immatriculation, coordonnées, hébergement et régime de TVA.",
  path: "/mentions-legales",
});

export default function MentionsLegalesPage() {
  return (
    <section className="band pt-32 md:pt-40">
      <div className="shell">
        <p className="label eyebrow eyebrow-accent">Informations</p>
        <h1 className="mt-6 font-display text-[clamp(2rem,4.6vw,3.25rem)] font-semibold leading-[1.03]">
          Mentions légales
        </h1>
        <Prose className="mt-14">
          <h2>Éditeur du site</h2>
          <p>
            Le site <strong>{site.domain}</strong> est édité sous le nom commercial
            <strong> {site.name}</strong> par <strong>Hassan El Mzabi, entrepreneur individuel (EI)</strong>,
            exerçant sous le régime de la micro-entreprise.
          </p>
          <dl>
            <dt>Adresse de l’entreprise</dt>
            <dd>67 bis rue Alfred Labrierre, 95100 Argenteuil, France</dd>
            <dt>SIREN</dt>
            <dd>934 156 811</dd>
            <dt>SIRET de l’établissement principal</dt>
            <dd>934 156 811 00028</dd>
            <dt>Immatriculation</dt>
            <dd>Inscrit au Registre national des entreprises (RNE)</dd>
            <dt>Code APE</dt>
            <dd>6202A — Conseil en systèmes et logiciels informatiques</dd>
            <dt>Contact professionnel</dt>
            <dd>
              <a href={`mailto:${site.email}`}>{site.email}</a> ·{" "}
              <a href="tel:+33745468528">07 45 46 85 28</a>
            </dd>
          </dl>
          <p>
            <a
              href="https://data.inpi.fr/entreprises/934156811"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vérifier l’immatriculation sur DATA INPI
            </a>
          </p>

          <h2>Directeur de la publication</h2>
          <p>Hassan El Mzabi, entrepreneur individuel.</p>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par Cloudflare, Inc., 101 Townsend Street,
            San Francisco, CA 94107, États-Unis. Téléphone&nbsp;: +1 650 319 8930.
          </p>

          <h2>TVA</h2>
          <p>
            Franchise en base de TVA. TVA non applicable, art. 293 B du CGI.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Les traitements liés au site et au formulaire de devis sont décrits dans
            la <a href="/confidentialite">politique de confidentialité</a>. Les
            informations relatives aux traceurs figurent sur la page{" "}
            <a href="/cookies">Cookies</a>.
          </p>
        </Prose>
      </div>
    </section>
  );
}
