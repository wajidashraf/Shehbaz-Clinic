"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/i18n/config";

type MobileNavigationProps = {
  locale: Locale;
  labels: {
    home: string;
    services: string;
    dentists: string;
    openMenu: string;
    closeMenu: string;
  };
};

export function MobileNavigation({ locale, labels }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const localeRoot = `/${locale}`;

  return (
    <div className="md:hidden">
      <button
        aria-controls="mobile-navigation-panel"
        aria-expanded={isOpen}
        aria-label={isOpen ? labels.closeMenu : labels.openMenu}
        className="grid size-11 cursor-pointer place-items-center rounded-full border border-[var(--line-strong)] bg-white text-[var(--ink)] transition-colors hover:bg-[var(--aqua-soft)]"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span aria-hidden="true" className="grid gap-1.5">
          <span
            className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${isOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 rounded-full bg-current transition-opacity ${isOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 rounded-full bg-current transition-transform ${isOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </span>
      </button>

      {isOpen ? (
        <div
          className="absolute inset-x-4 top-[calc(100%+0.5rem)] rounded-3xl border border-[var(--line)] bg-white p-3 shadow-[0_24px_70px_-32px_rgba(15,46,50,0.42)]"
          data-testid="mobile-navigation"
          id="mobile-navigation-panel"
        >
          {[
            { href: localeRoot, label: labels.home },
            { href: `${localeRoot}/services`, label: labels.services },
            { href: `${localeRoot}/dentists`, label: labels.dentists },
          ].map((item) => (
            <Link
              className="flex min-h-12 items-center rounded-2xl px-4 font-bold text-[var(--ink)] transition-colors hover:bg-[var(--aqua-soft)]"
              href={item.href}
              key={item.href}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
