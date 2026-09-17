"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** One passive listener, measuring only visible scenes once per frame.
 * CSS owns animation; scrolling is never intercepted. */
export function MotionDirector() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const visible = new Set<HTMLElement>();
    const update = () => {
      frame = 0;
      if (reduced.matches) return;
      const height = window.innerHeight;
      for (const node of visible) {
        const rect = node.getBoundingClientRect();
        node.style.setProperty("--scene-progress", String(Math.max(0, Math.min(1, (height - rect.top) / (height + rect.height)))));
        node.style.setProperty("--scene-enter", String(Math.max(0, Math.min(1, (height - rect.top) / (height * .75)))));
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const node = entry.target as HTMLElement;
        node.classList.toggle("scene-visible", entry.isIntersecting);
        if (entry.isIntersecting) visible.add(node); else visible.delete(node);
      });
      schedule();
    }, { rootMargin: "80px" });
    document.querySelectorAll<HTMLElement>("[data-scroll-scene]").forEach(node => observer.observe(node));
    const visibility = () => { root.classList.toggle("motion-hidden", document.hidden); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    document.addEventListener("visibilitychange", visibility);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [pathname]);
  return null;
}
