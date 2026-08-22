"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";

type MobileNavigationProps = {
  locale: Locale;
  labels: {
    book: string;
    bookShort?: string;
    contact: string;
    dentists: string;
    home: string;
    mobileNavigation: string;
    services: string;
  };
};

type NavigationKey = "home" | "services" | "dentists" | "book" | "contact";

function NavigationIcon({ children }: { children: ReactNode }) {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      {children}
    </svg>
  );
}

export function MobileNavigation({ locale, labels }: MobileNavigationProps) {
  const localeRoot = `/${locale}`;
  const [activeItem, setActiveItem] = useState<NavigationKey>("home");

  useEffect(() => {
    function syncFromLocation() {
      if (window.location.pathname.includes("/book")) {
        setActiveItem("book");
        return;
      }
      const hash = window.location.hash.slice(1) as NavigationKey;
      setActiveItem(["services", "dentists", "contact"].includes(hash) ? hash : "home");
    }

    syncFromLocation();
    window.addEventListener("hashchange", syncFromLocation);

    const sections = ["services", "dentists", "contact"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            (entries) => {
              const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
              if (visible?.target.id) setActiveItem(visible.target.id as NavigationKey);
            },
            { rootMargin: "-30% 0px -55%", threshold: [0.15, 0.4, 0.65] },
          );

    sections.forEach((section) => observer?.observe(section));
    return () => {
      window.removeEventListener("hashchange", syncFromLocation);
      observer?.disconnect();
    };
  }, []);

  const items: Array<{ href: string; icon: ReactNode; key: NavigationKey; label: string }> = [
    {
      href: localeRoot,
      key: "home",
      label: labels.home,
      icon: <NavigationIcon><path d="M3.5 10.5 12 3l8.5 7.5V21h-6v-6h-5v6h-6V10.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /></NavigationIcon>,
    },
    {
      href: `${localeRoot}#services`,
      key: "services",
      label: labels.services,
      icon: <NavigationIcon><path d="M12 3v18M3 12h18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" /></NavigationIcon>,
    },
    {
      href: `${localeRoot}#dentists`,
      key: "dentists",
      label: labels.dentists,
      icon: <NavigationIcon><path d="M9.2 4.1c1.7.7 3.9.7 5.6 0 2.8-1.2 5.4 1.2 4.7 4.2l-2 8.8c-.6 2.5-3.9 2.5-4.5.1L12 13l-1 4.2c-.6 2.4-3.9 2.4-4.5-.1l-2-8.8c-.7-3 1.9-5.4 4.7-4.2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" /></NavigationIcon>,
    },
    {
      href: `${localeRoot}/book`,
      key: "book",
      label: labels.book,
      icon: <NavigationIcon><rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></NavigationIcon>,
    },
    {
      href: `${localeRoot}#contact`,
      key: "contact",
      label: labels.contact,
      icon: <NavigationIcon><path d="M21 15.7v3a2 2 0 0 1-2.2 2A17.7 17.7 0 0 1 3.3 5.2 2 2 0 0 1 5.3 3h3a2 2 0 0 1 2 1.7c.1.8.3 1.6.7 2.4a2 2 0 0 1-.5 2.2l-1.2 1.2a14 14 0 0 0 4.2 4.2l1.2-1.2a2 2 0 0 1 2.2-.5c.8.4 1.6.6 2.4.7A2 2 0 0 1 21 15.7Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" /></NavigationIcon>,
    },
  ];

  return (
    <nav
      aria-label={labels.mobileNavigation}
      className="fixed inset-x-3 bottom-3 z-50 rounded-lg border border-white/80 bg-white/88 px-1.5 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] shadow-[0_18px_50px_-22px_rgba(7,48,71,0.46)] backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-5 items-end">
        {items.map((item) => {
          const active = activeItem === item.key;
          const booking = item.key === "book";
          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[0.62rem] font-extrabold transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                booking
                  ? " bg-[var(--teal)] text-white shadow-[0_10px_24px_-12px_rgba(32,147,224,0.8)]"
                  : active
                    ? "bg-[var(--aqua-md)] text-[var(--teal-dark)]"
                    : "text-[var(--muted-text)] hover:bg-[var(--aqua-soft)] hover:text-[var(--teal-dark)]"
              }`}
              href={item.href}
              key={item.key}
              onClick={() => setActiveItem(item.key)}
            >
              {item.icon}
              <span className="max-w-full truncate">{booking ? labels.bookShort ?? labels.book.split(" ")[0] : item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
