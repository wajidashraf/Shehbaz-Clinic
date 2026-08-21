"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";

type MobileNavigationProps = {
  locale: Locale;
  labels: {
    home: string;
    services: string;
    dentists: string;
    book: string;
    openMenu: string;
    closeMenu: string;
  };
};

export function MobileNavigation({
  locale,
  labels,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigationRef = useRef<HTMLDivElement>(null);

  const localeRoot = `/${locale}`;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        navigationRef.current &&
        !navigationRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  const navigationItems = [
    {
      href: localeRoot,
      label: labels.home,
    },
    {
      href: `${localeRoot}/services`,
      label: labels.services,
    },
    {
      href: `${localeRoot}/dentists`,
      label: labels.dentists,
    },
  ];

  return (
    <div
      className="relative md:hidden"
      ref={navigationRef}
    >
      <button
        aria-controls="mobile-navigation-panel"
        aria-expanded={isOpen}
        aria-label={isOpen ? labels.closeMenu : labels.openMenu}
        className="
          grid size-11 cursor-pointer place-items-center rounded-xl
          border border-slate-200 bg-white text-slate-800
          shadow-sm transition-all duration-200
          hover:border-sky-200 hover:bg-[var(--aqua-soft)]
          hover:text-[var(--teal-dark)] hover:shadow-md
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[var(--teal-dark)]
          focus-visible:ring-offset-2
        "
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span
          aria-hidden="true"
          className="relative block h-5 w-5"
        >
          <span
            className={`
              absolute left-0 top-1 block h-0.5 w-5 rounded-full
              bg-current transition-all duration-200
              ${
                isOpen
                  ? "top-[9px] rotate-45"
                  : ""
              }
            `}
          />

          <span
            className={`
              absolute left-0 top-[9px] block h-0.5 w-5 rounded-full
              bg-current transition-all duration-200
              ${isOpen ? "scale-x-0 opacity-0" : ""}
            `}
          />

          <span
            className={`
              absolute bottom-1 left-0 block h-0.5 w-5 rounded-full
              bg-current transition-all duration-200
              ${
                isOpen
                  ? "bottom-[9px] -rotate-45"
                  : ""
              }
            `}
          />
        </span>
      </button>

      {isOpen ? (
        <div
          className="
            absolute end-0 top-[calc(100%+0.85rem)] z-50
            w-[min(22rem,calc(100vw-2rem))]
            overflow-hidden rounded-2xl
            border border-slate-200/80 bg-white
            p-2.5
            shadow-[0_24px_70px_-24px_rgba(15,23,42,0.30)]
          "
          data-testid="mobile-navigation"
          id="mobile-navigation-panel"
        >
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                className="
                  flex min-h-12 items-center rounded-xl
                  px-4 text-[0.95rem] font-semibold
                  text-slate-700
                  transition-all duration-200
                  hover:bg-[var(--aqua-soft)]
                  hover:text-[var(--teal-dark)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-inset
                  focus-visible:ring-[var(--teal-dark)]
                "
                href={item.href}
                key={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="my-2.5 h-px bg-slate-100" />

          <Link
            className="
              flex min-h-12 items-center justify-center
              rounded-xl
              bg-[var(--teal-dark)]
              px-5 text-center text-sm font-bold
              text-white
              shadow-[0_8px_22px_-10px_rgba(15,118,110,0.75)]
              transition-all duration-200
              hover:-translate-y-0.5
              hover:shadow-[0_12px_28px_-10px_rgba(15,118,110,0.85)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--teal-dark)]
              focus-visible:ring-offset-2
            "
            href={`${localeRoot}/book`}
            onClick={() => setIsOpen(false)}
          >
            {labels.book}
          </Link>
        </div>
      ) : null}
    </div>
  );
}