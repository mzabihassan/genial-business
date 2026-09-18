import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { Prose } from "@/components/site/Prose";

export const metadata = pageMetadata({
  title: "Conditions générales de vente",
  description:
    "Cadre des prestations sur devis de Genial Business : développement logiciel, conseil, déploiement et maintenance.",
  path: "/cgv",
});

export default function CgvPage() {
  return (
    <section className="band pt-32 md:pt-40">
      <div className="shell">
        <p className="label eyebrow eyebrow-accent">Informations</p>
        <h1 className="mt-6 font-display text-[clamp(2rem,4.6vw,3.25rem)] font-semibold leading-[1.03]">
          Conditions générales de vente
        </h1>
        <Prose className="mt-14">
          <p>
            Ces conditions présentent le cadre général des prestations proposées par
            Genial Business. Chaque mission est définie par un devis ou un contrat
            écrit qui précise ses conditions particulières avant tout engagement.
          </p>

          <h2>Prestataire et services</h2>
          <p>
            Genial Business est une entreprise individuelle inscrite au RNE sous
            le SIREN 934 156 811. L’identité légale et les coordonnées complètes
            figurent dans les <a href="/mentions-legales">mentions légales</a>.
          </p>
          <p>
            Les prestations peuvent porter sur le conseil en systèmes et logiciels,
            la conception et le développement de logiciels sur mesure, d’applications
            web ou mobiles, de plateformes et de solutions SaaS, ainsi que sur leur
            intégration, leur déploiement, leur maintenance ou leur support.
          </p>

          <h2>Devis et périmètre</h2>
          <p>
            Une demande envoyée depuis le site permet d’échanger sur un projet. Elle
            ne constitue pas une commande. Le périmètre de la mission, les livrables,
            les éventuelles étapes, les éléments à fournir par le client et les
            modalités d’exécution sont précisés dans le devis ou le contrat accepté.
            Toute évolution du périmètre fait l’objet d’un accord écrit entre les
            parties avant son exécution.
          </p>

          <h2>Prix, facturation et TVA</h2>
          <p>
            Le prix et les modalités de paiement sont indiqués dans le devis ou le
            contrat propre à la mission. Aucun paiement n’est encaissé sur ce site.
            Genial Business relève de la franchise en base de TVA&nbsp;: «&nbsp;TVA non
            applicable, art. 293 B du CGI&nbsp;».
          </p>

          <h2>Calendrier, livraison et suivi</h2>
          <p>
            Le calendrier, les conditions de livraison ou de mise en production et
            les modalités de validation des livrables sont définis pour chaque
            projet par écrit. Le support, la maintenance, l’hébergement applicatif
            et les éventuels engagements de disponibilité ne s’appliquent que dans
            la mesure prévue au devis ou au contrat.
          </p>

          <h2>Éléments fournis et droits d’utilisation</h2>
          <p>
            Le client et Genial Business précisent dans leurs documents contractuels
            les accès, contenus, données et logiciels nécessaires à la mission, ainsi
            que les droits d’utilisation ou de cession portant sur les livrables.
            Les composants et services de tiers restent soumis à leurs propres
            licences et conditions, présentées lorsque leur usage est prévu.
          </p>

          <h2>Clients consommateurs</h2>
          <p>
            Si le client est un consommateur et que le contrat est conclu à distance
            ou hors établissement, il bénéficie, lorsque la loi le prévoit, d’un
            droit de rétractation de quatorze jours. Il peut l’exercer par une
            déclaration claire adressée à <a href={`mailto:${site.email}`}>{site.email}</a>
            ou à l’adresse postale indiquée dans les mentions légales. Une demande
            d’exécution avant la fin de ce délai et ses conséquences éventuelles
            doivent faire l’objet des accords prévus par la loi. Les exceptions
            légales ne s’appliquent que si leurs conditions sont réunies.
          </p>
          <p>
            En cas de litige, le client consommateur peut d’abord adresser une
            réclamation écrite à Genial Business. Après cette démarche, il peut
            recourir gratuitement au médiateur de la consommation dont les
            coordonnées doivent être communiquées avant la conclusion du contrat.
          </p>
          <p>
            <strong>Information à compléter par l’éditeur&nbsp;:</strong> nom,
            adresse et site du médiateur de la consommation après son adhésion.
          </p>

          <h3>Modèle de rétractation</h3>
          <p>
            À adresser uniquement si le droit de rétractation s’applique&nbsp;:
            «&nbsp;Je vous notifie par la présente ma rétractation du contrat de
            prestation de services conclu le [date]. Nom du consommateur&nbsp;:
            [nom]. Adresse&nbsp;: [adresse]. Date&nbsp;: [date].&nbsp;» La signature
            est nécessaire uniquement pour un envoi sur papier.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Les données transmises par le formulaire de devis sont traitées selon la{" "}
            <a href="/confidentialite">politique de confidentialité</a>. Si une
            mission implique le traitement de données personnelles pour le compte
            du client, les responsabilités et les instructions nécessaires sont
            précisées dans les documents contractuels de la mission.
          </p>

          <h2>Réclamations</h2>
          <p>
            Pour toute question relative à une prestation, contactez{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a>. Les règles impératives
            applicables aux consommateurs demeurent pleinement applicables.
          </p>
        </Prose>
      </div>
    </section>
  );
}
