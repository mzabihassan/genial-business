import { faq } from "@/content/faq";
import { Plus } from "@/components/site/Icons";
import { delay } from "@/lib/utils";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export function Faq() {
  return (
    <section id="faq" className="band">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="label eyebrow eyebrow-accent" data-reveal="none">
                Questions fréquentes
              </p>
              <h2
                data-reveal
                style={delay(60)}
                className="mt-6 font-display text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.03]"
              >
                Ce qu&rsquo;on nous demande avant de commencer.
              </h2>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="border-t border-rule">
              {faq.map((item, i) => (
                <details
                  key={item.q}
                  className="faq-item group border-b border-rule"
                  data-reveal="none"
                  style={delay(Math.min(i, 6) * 40)}
                >
                  <summary className="flex items-start justify-between gap-6 py-6 transition-colors hover:text-ink">
                    <h3 className="font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.015em] text-ink transition-colors md:text-[1.1875rem]">
                      {item.q}
                    </h3>
                    <Plus
                      className="faq-sign mt-0.5 size-[1.125rem] shrink-0 text-ink-mute"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="max-w-2xl pb-7 pr-10 text-[0.9375rem] leading-relaxed text-ink-soft md:text-base">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </section>
  );
}
