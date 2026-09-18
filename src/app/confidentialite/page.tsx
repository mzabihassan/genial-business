import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { Prose } from "@/components/site/Prose";
import { MAX_FILES, formatBytes, MAX_TOTAL_BYTES } from "@/lib/quote";

export const metadata = pageMetadata({
  title: "Politique de confidentialité",
  description:
    "Données traitées par Genial Business lors d’une demande de devis, destinataires, durée de conservation et droits des personnes.",
  path: "/confidentialite",
});

export default function ConfidentialitePage() {
  return (
    <section className="band pt-32 md:pt-40">
      <div className="shell">
        <p className="label eyebrow eyebrow-accent">Informations</p>
        <h1 className="mt-6 font-display text-[clamp(2rem,4.6vw,3.25rem)] font-semibold leading-[1.03]">
          Politique de confidentialité
        </h1>
        <Prose className="mt-14">
          <h2>Responsable du traitement</h2>
          <p>
            Genial Business est responsable des données reçues par ce site. Son
            identité et ses coordonnées complètes figurent dans les{" "}
            <a href="/mentions-legales">mentions légales</a>. Vous pouvez écrire à{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a> pour toute question
            relative à vos données.
          </p>

          <h2>Données reçues</h2>
          <p>
            Le formulaire de devis demande votre nom, votre adresse email et la
            description de votre projet. Vous pouvez aussi renseigner une société,
            un téléphone, un site existant, un message et des précisions sur le
            projet, son budget ou son délai. Vous pouvez joindre jusqu’à {MAX_FILES}
            {" "}fichiers ({formatBytes(MAX_TOTAL_BYTES)} au total). Évitez d’y inclure
            des données sensibles qui ne sont pas nécessaires à votre demande.
          </p>
          <p>
            La demande transmise contient également la date de réception et, si le
            navigateur le fournit, l’adresse de la page d’origine. L’adresse IP est
            utilisée temporairement par le serveur pour limiter les envois abusifs.
            Les réponses saisies dans le formulaire restent en mémoire dans la page
            jusqu’à son envoi ou sa fermeture&nbsp;: elles ne sont pas enregistrées
            dans le stockage local du navigateur.
          </p>

          <h2>Pourquoi ces données sont utilisées</h2>
          <p>
            Les informations du formulaire servent à étudier votre demande, à vous
            répondre, à vous adresser un accusé de réception et, si vous le souhaitez,
            à préparer une proposition. Ce traitement repose sur les mesures
            précontractuelles prises à votre demande. L’adresse IP est traitée pour
            protéger le formulaire contre les abus, sur la base de l’intérêt légitime
            à sécuriser le service. Les données nécessaires à une relation contractuelle
            ou à des obligations comptables sont ensuite traitées sur ces bases propres.
          </p>
          <p>
            L’envoi du formulaire ne vous inscrit à aucune newsletter et les données
            ne sont pas utilisées pour une campagne de prospection automatique.
          </p>

          <h2>Destinataires et prestataires</h2>
          <p>
            La demande et les pièces jointes sont envoyées à Genial Business par
            email via Brevo. Brevo envoie également un accusé de réception à l’adresse
            fournie. Le site et son formulaire sont hébergés par Cloudflare. Aucun
            fichier ou dossier de devis n’est créé dans une base de données du site.
            Ces prestataires traitent les données nécessaires à la fourniture de
            leurs services et peuvent les traiter hors de l’Espace économique
            européen selon leurs conditions de protection applicables.
          </p>

          <h2>Durées de conservation</h2>
          <p>
            Les demandes qui ne débouchent pas sur une mission sont conservées au
            maximum trois ans après le dernier échange utile, puis supprimées des
            espaces de messagerie sous notre contrôle. Les échanges liés à une
            mission sont conservés pendant la relation contractuelle puis, pour les
            pièces qui doivent l’être, pendant les durées légales applicables. Le
            contrôle anti-abus utilise l’adresse IP en mémoire temporaire pour
            limiter les envois sur une fenêtre de quinze minutes, sans base de
            données persistante. Les journaux techniques des
            prestataires suivent leurs propres durées de conservation.
          </p>

          <h2>Vos droits</h2>
          <p>
            Selon votre situation, vous pouvez demander l’accès, la rectification,
            l’effacement, la limitation ou la portabilité de vos données, et vous
            opposer aux traitements fondés sur l’intérêt légitime. Écrivez à{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>&nbsp;; nous répondons
            en principe sous un mois. Vous pouvez également déposer une réclamation
            auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
          </p>

          <h2>Cookies et sécurité</h2>
          <p>
            Le site ne configure actuellement aucun traceur publicitaire ou de
            mesure d’audience. La page <a href="/cookies">Cookies</a> précise
            cette situation. Les échanges avec le site utilisent HTTPS et les
            pièces jointes du formulaire sont limitées en nombre, en taille et en
            format avant leur transmission.
          </p>
        </Prose>
      </div>
    </section>
  );
}
