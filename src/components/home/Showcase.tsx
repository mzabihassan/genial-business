import Link from "next/link";
import { projects } from "@/content/projects";
import { ProjectFrame } from "@/components/site/ProjectFrame";
import { ArrowUpRight } from "@/components/site/Icons";

export function Showcase() {
  return (
    <section id="realisations" className="studio-section work-section" data-scroll-scene>
      <div className="shell">
        <div className="section-title-row">
          <h2>Du premier écran<br />aux vrais utilisateurs.</h2>
          <Link href="/realisations" className="text-link">
            Explorer nos réalisations <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <p className="work-intro">ISIIL et Profaly, parmi les produits que nous avons conçus et développés. Explorez cette sélection en ligne.</p>
        <div className="work-grid">
          {projects.map((p, i) => (
            <article key={p.slug} className={`work-card work-card-${i}`}>
              <div className="work-visual" data-reveal="frame">
                <ProjectFrame project={p} />
              </div>
              <div className="work-info">
                <div>
                  <p className="studio-kicker">{p.sector}</p>
                  <h3>{p.name}</h3>
                </div>
                <Link
                  href={`/realisations#${p.slug}`}
                  className="text-link"
                >
                  Voir le projet <ArrowUpRight className="size-4" />
                </Link>
              </div>
              <p className="work-description">{p.tagline}</p>
              <div className="work-tags">
                {p.capabilities.slice(0, 4).map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
