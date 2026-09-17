import Link from "next/link";
import { ArrowUpRight } from "./Icons";
export function CtaBand({
  title = "La suite commence par votre idée.",
  lead = "Quelques lignes sur ce que vous voulez construire suffisent. Un développeur vous recontacte pour préciser le besoin, puis préparer un devis sur un périmètre écrit.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="cta-section" data-scroll-scene>
      <div className="shell">
        <div className="cta-content">
          <div>
            <h2>{title}</h2>
            <p>{lead}</p>
          </div>
          <Link href="/devis" className="btn btn-primary btn-lg">
            Demander un devis <ArrowUpRight className="size-5" />
          </Link>
        </div>
        <p className="cta-reassurance">Aucun cahier des charges requis. La demande ne vous engage à rien.</p>
      </div>
    </section>
  );
}
