"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/site";
import { cx } from "@/lib/utils";
import { Logo } from "./Logo";
import { ArrowRight } from "./Icons";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the panel when the route changes. Adjusting during render (rather
  // than in an effect) avoids a second commit with the menu still open.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href.startsWith("/#") ? false : pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-rule bg-paper/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
        <Link
          href="/"
          // Vertical padding pulled back by a negative margin: a 44px+ hit
          // area without changing the header's height.
          className="-my-3 py-3 text-ink transition-opacity hover:opacity-70"
          aria-label="Genial Business — accueil"
        >
          <Logo />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cx(
                "link-underline text-[0.9375rem] font-medium transition-colors",
                isActive(item.href) ? "text-ink" : "text-ink-soft hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/devis" className="btn btn-primary hidden h-11 sm:inline-flex">
            Demander un devis
            <ArrowRight className="arrow size-4" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-sm text-ink lg:hidden"
          >
            <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
            <span className="relative block h-3.5 w-6">
              <span
                className={cx(
                  "absolute left-0 block h-[1.75px] w-6 bg-current transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cx(
                  "absolute left-0 block h-[1.75px] bg-current transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]",
                  open ? "top-1.5 w-6 -rotate-45" : "top-3 w-4",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile panel — a sheet of its own, not a squeezed desktop nav */}
      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t border-rule bg-paper lg:hidden"
      >
        <div className="shell flex h-[calc(100dvh-4.5rem)] flex-col justify-between py-8">
          <nav aria-label="Navigation" className="flex flex-col">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ transitionDelay: `${60 + i * 45}ms` }}
                className={cx(
                  "border-b border-rule py-5 font-display text-3xl font-semibold tracking-[-0.03em] text-ink",
                  "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-4">
            <Link href="/devis" className="btn btn-primary btn-lg w-full">
              Demander un devis
              <ArrowRight className="arrow size-4" />
            </Link>
            <p className="label text-ink-mute">
              Sans engagement · Étudié par un développeur
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
