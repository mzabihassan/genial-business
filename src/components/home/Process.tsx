import Link from "next/link";
import { process as fullProcess } from "@/content/process";
import { ArrowUpRight } from "@/components/site/Icons";
import { ProjectJourney, type JourneyStep } from "@/components/site/ProjectJourney";

const steps: JourneyStep[] = [
  { label: "Cadrer", title: "Commençons par ce que vous voulez changer.", text: "Un service à lancer, des demandes à mieux traiter, un outil qui vous ralentit. Nous partons de votre activité pour définir une première version utile et un devis précis.", deliverable: "Périmètre écrit et devis", involvement: "Vous nous expliquez le besoin et validez les priorités." },
  { label: "Construire", title: "Vous voyez le produit prendre forme.", text: "Design et développement avancent ensemble. Nous assemblons l’interface et les services dont elle dépend. Vous essayez des écrans fonctionnels, pas seulement des maquettes.", deliverable: "Produit fonctionnel à essayer", involvement: "Vous testez les parcours et partagez vos retours." },
  { label: "Valider", title: "Vérifier avant d’ouvrir les portes.", text: "Les parcours, les permissions et les intégrations sont relus et testés. Nous corrigeons les points bloquants et préparons l’environnement de production.", deliverable: "Parcours testés et validés", involvement: "Vous confirmez que le produit répond à votre usage." },
  { label: "Transmettre", title: "En ligne. Et entre vos mains.", text: "Nous déployons le produit et vous accompagnons dans sa prise en main. Le code, les comptes et les configurations vous sont remis. Vous choisissez ensuite qui le fera évoluer.", deliverable: "Produit en ligne, code et accès", involvement: "Vous prenez la main, avec notre aide." },
];
const labels = ["Votre idée", "Le besoin", "Le périmètre", "Le devis", "La construction", "La validation", "La mise en ligne", "La transmission"];
const outputs = ["Besoin exprimé", "Objectifs clarifiés", "Périmètre écrit", "Devis à valider", "Produit à essayer", "Parcours testés", "Produit en production", "Code et accès remis"];
const roles = ["Décrivez votre idée avec vos mots.", "Partagez votre façon de travailler.", "Choisissez les priorités avec nous.", "Validez le périmètre et le budget avant le démarrage.", "Essayez le produit et partagez vos retours.", "Validez les usages propres à votre activité.", "Nous vous accompagnons pour l’ouverture.", "Prenez la main et choisissez la suite."];
export function Process({ detailed = false }: { detailed?: boolean }) {
  const journey = detailed ? fullProcess.map((step, i) => ({ title: step.title, text: step.detail, label: labels[i], deliverable: outputs[i], involvement: roles[i] })) : steps;
  return <section id="methode" className="studio-section process-section" data-scroll-scene>
    <div className="shell">
      <div className="section-title-row journey-heading"><h2>Vous portez l’idée.<br />Nous tenons le fil.</h2>{!detailed && <Link href="/methode" className="text-link">La méthode en détail <ArrowUpRight className="size-4" /></Link>}</div>
      <ProjectJourney steps={journey} id={detailed ? "parcours" : "etape"} />
    </div>
  </section>;
}
