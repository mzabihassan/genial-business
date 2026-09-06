"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Boots the reveal system. Runs synchronously as the first thing in <body>, so
 * the hidden state is in place before any revealed content is painted — and is
 * simply never applied when JS, IntersectionObserver or motion is unavailable.
 */
export const revealBootScript = `try{if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){var r=document.documentElement;r.classList.add('reveal-ready');setTimeout(function(){if(!window.__revealBooted)r.classList.remove('reveal-ready')},3000)}}catch(e){}`;

/**
 * One observer for the whole site. Elements settle once and stay put — nothing
 * re-animates on scroll-back, which is what keeps repeat visits calm.
 */
export function RevealProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    // Tell the boot script's failsafe that the observer is live.
    (window as unknown as { __revealBooted?: boolean }).__revealBooted = true;
    if (!root.classList.contains("reveal-ready")) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const scan = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)")
        .forEach((el) => observer.observe(el));
    };

    scan();

    // Sections mounted after hydration (quote steps, disclosures) join in.
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    // If a visitor switches to reduced motion mid-session, stop hiding things.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onPrefChange = () => {
      if (reduced.matches) root.classList.remove("reveal-ready");
    };
    reduced.addEventListener("change", onPrefChange);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      reduced.removeEventListener("change", onPrefChange);
    };
  }, [pathname]);

  return null;
}
