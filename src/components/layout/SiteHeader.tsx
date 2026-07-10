"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useId } from "react";

interface NavLink {
  href: string;
  label: string;
  /** true = anchor hash on portfolio homepage, skip active check */
  isHash?: boolean;
  /** rendered as filled CTA pill */
  cta?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/#skills", label: "Stack", isHash: true },
  { href: "/tools", label: "Tools" },
  { href: "/#certifications", label: "Certs", isHash: true },
  { href: "/#contact", label: "Contact", isHash: true, cta: true },
];

export interface SiteHeaderProps {
  variant?: "portfolio" | "tools";
}

export function SiteHeader({ variant = "tools" }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const mobileNavId = useId();

  /* Scroll handler — passive for performance */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close on route change */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* Trap scroll when menu is open on mobile */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function isActive(link: NavLink): boolean {
    if (link.isHash || link.cta) return false;
    if (link.href === "/") return pathname === "/";
    return pathname.startsWith(link.href);
  }

  const headerBg =
    scrolled || menuOpen
      ? "bg-site-bg/95 backdrop-blur-xl border-b border-site-border shadow-[0_1px_24px_rgba(0,0,0,0.5)]"
      : "bg-site-bg/70 backdrop-blur-md border-b border-transparent";

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${headerBg}`}>
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-accent rounded-lg"
          aria-label="Kartavya Pathak — Home"
        >
          <span className="w-8 h-8 bg-site-accent text-site-bg font-display text-sm flex items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110 select-none">
            KP
          </span>
          <span className="font-mono text-sm font-semibold hidden sm:block leading-none">
            kartavyapathak
            <span className="text-site-accent">.com</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-0.5" role="list">
          {NAV_LINKS.map((link) => {
            const active = isActive(link);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`
                    inline-flex items-center h-9 px-3.5 rounded-lg text-sm font-medium transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-accent
                    ${
                      link.cta
                        ? "bg-site-accent text-site-bg font-bold hover:shadow-glow hover:opacity-95 ml-2"
                        : active
                        ? "text-site-accent bg-site-accent/10"
                        : "text-site-muted hover:text-site-text hover:bg-site-elevated"
                    }
                  `}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Hamburger */}
        <button
          type="button"
          className="md:hidden flex flex-col justify-center gap-[5px] w-9 h-9 rounded-lg hover:bg-site-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-accent"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls={mobileNavId}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span
            className={`block w-5 h-px bg-site-text transition-all duration-200 mx-auto origin-center ${
              menuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-px bg-site-text transition-all duration-200 mx-auto ${
              menuOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-px bg-site-text transition-all duration-200 mx-auto origin-center ${
              menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile nav panel */}
      <div
        id={mobileNavId}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-screen border-b border-site-border" : "max-h-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <ul
          className="px-4 pt-2 pb-6 flex flex-col gap-1 bg-site-bg/98 backdrop-blur-xl"
          role="list"
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(link);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`
                    block text-sm font-medium px-4 py-3 rounded-xl transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-accent
                    ${
                      link.cta
                        ? "bg-site-accent text-site-bg font-bold text-center mt-2 hover:shadow-glow"
                        : active
                        ? "text-site-accent bg-site-accent/10 font-semibold"
                        : "text-site-muted hover:text-site-text hover:bg-site-elevated"
                    }
                  `}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
