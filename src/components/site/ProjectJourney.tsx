"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check } from "./Icons";

export type JourneyStep = { title: string; text: string; label: string; deliverable: string; involvement: string };

export function ProjectJourney({ steps, id }: { steps: JourneyStep[]; id: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const nodes = Array.from(root.current?.querySelectorAll<HTMLElement>(".journey-stage") ?? []);
    // An intersection strip follows reading position without a scroll handler.
    const observer = new IntersectionObserver(entries => {
      const entry = entries.filter(item => item.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (entry) setActive(nodes.indexOf(entry.target as HTMLElement));
    }, { rootMargin: "-20% 0px -50% 0px", threshold: 0 });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [steps]);

  return <div className={`project-journey ${steps.length > 4 ? "journey-long" : ""}`} ref={root} style={{ "--journey-progress": (active + 1) / steps.length } as CSSProperties}>
    <div className="journey-sticky">
      <nav className="journey-nav" aria-label="Étapes du projet">
        {steps.map((step, i) => <a key={step.title} href={`#${id}-${i}`} aria-current={active === i ? "step" : undefined} className={i <= active ? "is-reached" : ""}><span className="journey-dot" aria-hidden="true">{i < active ? <Check className="size-3" /> : null}</span>{step.label}</a>)}
      </nav>
      <div className="journey-document" aria-hidden="true">
        <p>Ce que vous recevez</p>
        <div className="journey-deliverables">{steps.map((step, i) => <span key={step.deliverable} className={i <= active ? "is-reached" : ""}><Check className="size-3" />{step.deliverable}</span>)}</div>
        <div className="journey-meter"><i /></div>
      </div>
    </div>
    <ol className="journey-stages">
      {steps.map((step, i) => <li key={step.title} id={`${id}-${i}`} className={`journey-stage ${active === i ? "is-active" : ""}`}>
        <span className="journey-node" aria-hidden="true" />
        <p className="studio-kicker">{step.label}</p><h3>{step.title}</h3><p className="journey-text">{step.text}</p>
        <div className="journey-involvement"><span>Votre rôle</span><p>{step.involvement}</p></div>
        <p className="journey-output"><Check className="size-4" />{step.deliverable}</p>
      </li>)}
    </ol>
  </div>;
}
