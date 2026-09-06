import { SectionHeading } from "@/components/site/SectionHeading";
import { Check } from "@/components/site/Icons";
import { delay } from "@/lib/utils";

const accelerated = [
  "Analyser un besoin et explorer les options",
  "Écrire le code répétitif",
  "Générer et étendre les tests",
  "Relire le code ligne à ligne",
  "Retrouver la cause d’un bug",
  "Produire la documentation",
  "Tenir une cohérence sur tout le projet",
];

const human = [
  "Comprendre votre activité et vos utilisateurs",
  "Décider ce que le produit doit faire",
  "L’architecture et les choix techniques",
  "L’expérience utilisateur et le design",
  "La sécurité et la protection des données",
  "La revue et les tests avant mise en ligne",
  "La validation finale et la livraison",
];

export function HumanAi() {
  return (
    <section id="methode-ia" className="band border-b border-rule">
      <div className="shell">
        <SectionHeading
          eyebrow="Notre façon de travailler"
          title="L’expérience humaine, renforcée par l’IA."
          lead="Nous sommes des développeurs expérimentés qui utilisent les meilleurs outils d’IA disponibles. L’IA n’écrit pas votre produit à notre place : elle nous permet d’aller plus vite sur ce qui est mécanique, et de passer plus de temps sur ce qui compte."
        />

        {/* The equation, stated once, in the page’s largest utility type */}
        <p
          data-reveal
          style={delay(80)}
          className="mt-14 flex flex-wrap items-center gap-x-4 gap-y-2 font-display text-[clamp(0.9rem,1.9vw,1.25rem)] font-semibold uppercase tracking-[0.06em] text-ink md:mt-16"
        >
          <span>Développeurs expérimentés</span>
          <span className="text-[1.4em] font-normal leading-none text-trace">×</span>
          <span>Outils d&rsquo;IA</span>
          <span className="text-ink-mute" aria-hidden="true">
            =
          </span>
          <span className="text-prussian">Plus vite, sans céder sur la qualité</span>
        </p>

        <div className="mt-10 grid overflow-hidden rounded-[5px] border border-rule md:grid-cols-2">
          {/* What the tools take off our hands */}
          <div data-reveal="left" className="border-b border-rule bg-wash/60 p-7 md:border-b-0 md:border-r md:p-10">
            <h3 className="label text-ink-mute">Ce que l&rsquo;IA accélère</h3>
            <ul className="mt-7 space-y-3.5">
              {accelerated.map((item) => (
                <li key={item} className="flex gap-3.5 text-[0.9375rem] leading-snug text-ink-soft">
                  <span aria-hidden="true" className="mt-[0.6em] h-px w-3.5 shrink-0 bg-ink-mute" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* What stays ours, in the emphatic column */}
          <div data-reveal="right" className="bg-surface p-7 md:p-10">
            <h3 className="label text-prussian">Ce qui reste entre nos mains</h3>
            <ul className="mt-7 space-y-3.5">
              {human.map((item) => (
                <li key={item} className="flex gap-3.5 text-[0.9375rem] font-medium leading-snug text-ink">
                  <Check className="mt-[0.15em] size-4 shrink-0 text-prussian" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          data-reveal
          className="mt-12 max-w-3xl border-l-2 border-trace pl-6 font-display text-[clamp(1.25rem,2.6vw,1.75rem)] font-medium leading-[1.28] tracking-[-0.02em] text-ink md:mt-14"
        >
          Nous ne générons pas du code pour le livrer tel quel. Chaque produit est
          conçu, relu, testé et validé par nos développeurs.
        </p>
      </div>
    </section>
  );
}
