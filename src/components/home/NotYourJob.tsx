import Link from "next/link";
import { ArrowRight } from "@/components/site/Icons";
import { delay } from "@/lib/utils";

const removed = [
  "Rédiger un cahier des charges",
  "Savoir ce dont votre produit a besoin",
  "Choisir des technologies",
  "Coordonner un designer et un développeur",
  "Trouver un hébergeur",
  "Configurer un nom de domaine",
  "Comprendre le référencement",
  "Gérer la mise en production",
  "Relire du code",
];

export function NotYourJob() {
  return (
    <section className="band border-b border-rule">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="label eyebrow eyebrow-accent" data-reveal="none">
              Ce qui vous est retiré
            </p>
            <h2
              data-reveal
              style={delay(60)}
              className="mt-6 font-display text-[clamp(2rem,4.6vw,3.25rem)] font-semibold leading-[1.03]"
            >
              Ce que vous n&rsquo;avez pas à faire.
            </h2>
            <p
              data-reveal
              style={delay(120)}
              className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft"
            >
              La plupart des projets s&rsquo;arrêtent avant de commencer parce que
              le porteur du projet pense devoir d&rsquo;abord tout comprendre. Ce
              n&rsquo;est pas le cas.
            </p>
          </div>

          <div className="lg:col-span-7">
            <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {removed.map((item, i) => (
                <li
                  key={item}
                  data-reveal="none"
                  style={delay(i * 70)}
                  className="text-[1.0625rem] leading-snug text-ink-mute"
                >
                  <span className="struck">{item}</span>
                </li>
              ))}
            </ul>

            <div
              data-reveal
              style={delay(200)}
              className="mt-12 border-t border-rule pt-10"
            >
              <p className="label text-trace-deep">Ce qu&rsquo;il vous reste à faire</p>
              <p className="mt-4 font-display text-[clamp(1.5rem,3.4vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.025em] text-ink">
                Nous expliquer votre idée, avec vos mots.
              </p>
              <Link href="/devis" className="btn btn-primary mt-7">
                Demander un devis
                <ArrowRight className="arrow size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
