"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, Check, IconShield } from "@/components/site/Icons";
import { Logo } from "@/components/site/Logo";
import { site } from "@/lib/site";
import "./quote-submission.css";

export type SubmissionStatus = "sending" | "success" | "error";

const stages = [
  "Préparation de votre demande",
  "Organisation des informations",
  "Assemblage de votre dossier",
  "Transmission à notre équipe",
  "En attente de confirmation",
];

/** This is an estimated visual progression, never a claim of server-side analysis. */
export function QuoteSubmission({ status, error, onRetry, onEdit, onContinue }: {
  status: SubmissionStatus;
  error: string | null;
  onRetry: () => void;
  onEdit: () => void;
  onContinue: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const historyCleanup = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const sending = status === "sending";
  const success = status === "success";
  const progress = success ? 100 : Math.min(94, 8 + 86 * (1 - Math.exp(-elapsed / 5000)));
  const stage = success ? 4 : progress < 24 ? 0 : progress < 46 ? 1 : progress < 68 ? 2 : progress < 87 ? 3 : 4;

  useLayoutEffect(() => {
    const modal = dialog.current!;
    const previousFocus = document.activeElement as HTMLElement | null;
    const scrollY = window.scrollY;
    const previousStyle = document.body.style.cssText;
    // Fixed body also prevents background scrolling on mobile Safari.
    Object.assign(document.body.style, { position: "fixed", top: `-${scrollY}px`, width: "100%", overflow: "hidden" });
    modal.showModal();
    heading.current?.focus({ preventScroll: true });
    return () => {
      modal.close();
      document.body.style.cssText = previousStyle;
      window.scrollTo({ top: scrollY, behavior: "instant" });
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    if (!sending) return;
    const start = performance.now();
    const timer = window.setInterval(() => setElapsed(performance.now() - start), 200);
    return () => window.clearInterval(timer);
  }, [sending]);

  useEffect(() => {
    if (!sending) return;
    if (historyCleanup.current) window.clearTimeout(historyCleanup.current);
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);

    // Native modal inertness blocks links and focus outside the flow. The
    // Navigation API also catches browser Back/Forward before the router runs.
    const navigation = (window as Window & { navigation?: EventTarget }).navigation;
    const preventNavigation = (event: Event) => { if (event.cancelable) event.preventDefault(); };
    // A same-document entry also protects a form opened directly from outside
    // the site: the first Back must not become an uncancellable document unload.
    {
      const state = window.history.state;
      if (!state?.quoteSending) {
        window.history.pushState({ ...state, quoteSending: true }, "", window.location.href);
      }
      const preventBack = (event: PopStateEvent) => {
        event.stopImmediatePropagation();
        if (!event.state?.quoteSending) window.history.go(1);
      };
      window.addEventListener("popstate", preventBack, true);
      const cleanupHistory = () => {
        window.removeEventListener("popstate", preventBack, true);
        // Let an immediate effect re-setup cancel cleanup (React Strict Mode).
        historyCleanup.current = setTimeout(() => {
          if (!window.history.state?.quoteSending) return;
          const swallow = (event: PopStateEvent) => {
            event.stopImmediatePropagation();
            window.removeEventListener("popstate", swallow, true);
          };
          window.addEventListener("popstate", swallow, true);
          window.history.back();
          window.setTimeout(() => window.removeEventListener("popstate", swallow, true), 1000);
        }, 0);
      };
      navigation?.addEventListener("navigate", preventNavigation);
      return () => {
        window.removeEventListener("beforeunload", beforeUnload);
        navigation?.removeEventListener("navigate", preventNavigation);
        cleanupHistory();
      };
    }
  }, [sending]);

  return (
    <dialog ref={dialog} className="quote-dispatch" data-status={status} aria-labelledby="dispatch-title" aria-describedby="dispatch-description" onKeyDown={(event) => {
      if (sending && event.key === "Tab") {
        event.preventDefault();
        heading.current?.focus({ preventScroll: true });
      }
    }} onCancel={(event) => {
      event.preventDefault();
      if (status === "error") onEdit();
    }}>
      <div className="dispatch-shell">
        <header className="dispatch-header">
          <Logo />
          <span className="dispatch-edition">De l’idée au produit.</span>
        </header>

        <div className="dispatch-layout">
          <div className="dispatch-story">
            <p className="label dispatch-eyebrow"><span />{success ? "Bien reçu. À nous de jouer." : status === "error" ? "Reprenons le fil." : "Chaque projet commence ici."}</p>
            <h2 ref={heading} tabIndex={-1} id="dispatch-title">
              {success ? <>Votre idée est<br /><em>entre nos mains.</em></> : status === "error" ? <>Votre idée mérite<br /><em>une autre tentative.</em></> : <>Votre projet<br /><em>prend forme.</em></>}
            </h2>
            <p id="dispatch-description" className="dispatch-description">
              {success ? "Votre demande a bien été transmise. Un développeur va la lire avec attention et vous contacter pour la suite." : status === "error" ? "L’envoi n’a pas pu être confirmé. Vos réponses et vos pièces jointes sont conservées ici." : "Nous transmettons votre demande et ses détails à notre équipe. Encore un instant, la suite se construit ensemble."}
            </p>

            <div className="dispatch-feedback" aria-live="polite" aria-atomic="true">
              {sending ? <>
                <div className="dispatch-current" key={stage}>
                  <span className="dispatch-step-number">0{stage + 1}<span> / 05</span></span>
                  <span>{stages[stage]}</span>
                </div>
                <div className="dispatch-progress" role="progressbar" aria-label="Avancement estimé de l’envoi" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.floor(progress)} aria-valuetext={`${stages[stage]}. En attente de la confirmation du serveur.`}>
                  <span style={{ transform: `scaleX(${progress / 100})` }} />
                </div>
                <p className="dispatch-note">{elapsed > 12000 ? "La transmission prend un peu plus de temps. Nous attendons sa confirmation." : "Gardez cette page ouverte pendant la transmission."}</p>
              </> : success ? <div className="dispatch-received"><span><Check className="size-4" /></span>Demande transmise à notre équipe</div> : <p className="dispatch-error">{error}</p>}
            </div>

            {!sending && <div className="dispatch-actions">
              {success ? <button type="button" className="btn btn-primary" onClick={onContinue}>Et maintenant ? <ArrowRight className="size-4" /></button> : <>
                <button type="button" className="btn btn-primary" onClick={onRetry}>Réessayer l’envoi <ArrowRight className="size-4" /></button>
                <button type="button" className="btn btn-ghost" onClick={onEdit}>Revenir à ma demande</button>
                <a className="dispatch-contact" href={`mailto:${site.email}`}>Ou écrivez-nous directement</a>
              </>}
            </div>}
          </div>

          <div className="dispatch-visual" aria-hidden="true" style={{ "--assembly": success ? 1 : Math.min(1, progress / 87) } as CSSProperties}>
            <div className="dispatch-grid" />
            <span className="dispatch-coordinate dispatch-coordinate-top">GB — ATELIER DIGITAL</span>
            <div className="dispatch-orbit" />
            <div className="dispatch-model">
              <div className="dispatch-foundation"><span>UNE IDÉE. TOUT UN POSSIBLE.</span><i /><i /><i /></div>
              <div className="dispatch-module dispatch-module-back"><span>Les fondations</span><div className="dispatch-circuit"><i /><i /><i /></div><small>Vos besoins · Votre ambition</small></div>
              <div className="dispatch-module dispatch-module-middle"><span>Les connexions</span><div className="dispatch-connections"><i /><b /><i /><b /><i /></div><small>Chaque détail trouve sa place.</small></div>
              <div className="dispatch-module dispatch-module-front"><div className="dispatch-mini-header"><span>Votre projet.</span><span>↗</span></div><div className="dispatch-mini-layout"><div><small>LE DÉBUT DE QUELQUE CHOSE</small><strong>Une idée.<br />Et la suite.</strong><i /></div><div className="dispatch-mini-art"><i /><i /><i /></div></div><div className="dispatch-mini-footer"><span>Imaginé par vous.</span><span>Construit ensemble.</span></div></div>
            </div>
            <div className="dispatch-seal"><Check className="size-6" /></div>
            <span className="dispatch-coordinate dispatch-coordinate-bottom">{success ? "01 — LE PREMIER PAS EST FAIT" : status === "error" ? "VOTRE PROJET RESTE INTACT" : "LES BONNES IDÉES PRENNENT VIE"}</span>
          </div>
        </div>

        <footer className="dispatch-footer">
          <span><IconShield className="size-4" />Vos informations restent confidentielles.</span>
          <span>Un développeur derrière chaque projet.</span>
        </footer>
      </div>
    </dialog>
  );
}
