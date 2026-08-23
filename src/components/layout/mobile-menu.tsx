"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LocaleSwitch } from "@/components/layout/locale-switch";
import type { Locale } from "@/i18n/config";

type MobileMenuLabels = {
  about: string;
  closeMenu: string;
  contact: string;
  mobileNavigation: string;
  openMenu: string;
  reviews: string;
  services: string;
  switchLanguage: string;
  theDentist: string;
};

type MobileMenuProps = {
  labels: MobileMenuLabels;
  locale: Locale;
};

export function MobileMenu({ labels, locale }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const localeRoot = `/${locale}`;

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const links = [
    { href: `${localeRoot}#about`, label: labels.about },
    { href: `${localeRoot}#services`, label: labels.services },
    { href: `${localeRoot}#dentist`, label: labels.theDentist },
    { href: `${localeRoot}#reviews`, label: labels.reviews },
    { href: `${localeRoot}#contact`, label: labels.contact },
  ];

  return (
    <div className="relative md:hidden">
      <button
        aria-controls="mobile-navigation-panel"
        aria-expanded={isOpen}
        aria-label={isOpen ? labels.closeMenu : labels.openMenu}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors duration-200 hover:border-sky-200 hover:bg-[var(--aqua-soft)] hover:text-[var(--teal-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal-dark)] focus-visible:ring-offset-2"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="size-5"
          fill="none"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              d="m6 6 12 12M18 6 6 18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          ) : (
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
            />
          )}
        </svg>
      </button>

      {isOpen ? (
        <nav
          aria-label={labels.mobileNavigation}
          className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl"
          id="mobile-navigation-panel"
        >
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-[var(--aqua-soft)] hover:text-[var(--teal-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal-dark)]"
                href={link.href}
                key={link.href}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div
            className="mt-3 border-t border-slate-100 pt-3"
            onClick={() => setIsOpen(false)}
          >
            <LocaleSwitch label={labels.switchLanguage} locale={locale} />
          </div>
        </nav>
      ) : null}
    </div>
  );
}
