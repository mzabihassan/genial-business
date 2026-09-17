import Link from "next/link";
import { ArrowUpRight } from "@/components/site/Icons";
export function HumanAi({ showLink = true }: { showLink?: boolean }) {
  return (
    <section id="methode-ia" className="studio-section human-section" data-scroll-scene>
      <div className="shell human-layout">
        <div className="human-proof" data-reveal="line">
          <dl>
            <div>
              <dt>L’IA nous aide sur</dt>
              <dd>
                l’analyse, certaines tâches de code répétitives, les tests et la
                documentation.
              </dd>
            </div>
            <div>
              <dt>Nos développeurs prennent en charge</dt>
              <dd>
                les choix de produit, le design, l’architecture, la sécurité et
                la validation finale.
              </dd>
            </div>
          </dl>
          <p>Chaque livraison est relue et testée par un développeur.</p>
        </div>
        <div>
          <h2>Avancer plus vite.<br />Garder le jugement humain.</h2>
          <p className="section-lead">
            Nos développeurs expérimentés utilisent l’IA pour raccourcir les
            tâches répétitives et consacrer du temps aux choix qui comptent.
            L’architecture, la sécurité et la validation restent leur responsabilité.
          </p>
          {showLink && (
            <Link href="/methode#methode-ia" className="text-link">
              Comprendre notre méthode <ArrowUpRight className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
