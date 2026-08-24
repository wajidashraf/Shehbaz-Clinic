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
  portfolio: string;
};

type MobileMenuProps = {
  labels: MobileMenuLabels;
  locale: Locale;
};

export function MobileMenu({ labels, locale }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const localeRoot = `/${locale}`;
  const isUrdu = locale === "ur";

  // Replace this with the clinic's actual phone number
  const clinicPhone = "+923001234567";

  const staticLabels = {
    en: {
      menu: "Menu",
      callNow: "Call Now",
      bookAppointment: "Book Appointment",
    },
    ur: {
      menu: "مینو",
      callNow: "ابھی کال کریں",
      bookAppointment: "اپائنٹمنٹ بک کریں",
    },
  };

  const text = staticLabels[locale];

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const links = [
    {
      href: `${localeRoot}#about`,
      label: labels.about,
    },
    {
      href: `${localeRoot}#services`,
      label: labels.services,
    },
    {
      href: `${localeRoot}#dentist`,
      label: labels.theDentist,
    },
    {
      href: `${localeRoot}#reviews`,
      label: labels.reviews,
    },
    {
      href: `${localeRoot}#portfolio`,
      label: labels.portfolio,
    },
    {
      href: `${localeRoot}#contact`,
      label: labels.contact,
    },
  ];

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button
        type="button"
        aria-controls="mobile-navigation-panel"
        aria-expanded={isOpen}
        aria-label={labels.openMenu}
        onClick={() => setIsOpen(true)}
        className="
          inline-flex
          size-11
          items-center
          justify-center
          rounded-xl
          border
          border-slate-200
          bg-white
          text-[var(--teal-dark)]
          shadow-sm
          transition-colors
          duration-200
          hover:border-[var(--teal)]
          hover:bg-[var(--aqua-soft)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--teal-dark)]
          focus-visible:ring-offset-2
        "
      >
        <svg
          aria-hidden="true"
          className="size-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <button
            type="button"
            aria-label={labels.closeMenu}
            onClick={() => setIsOpen(false)}
            className="
              fixed
              inset-0
              z-[9998]
              bg-slate-950/20
            "
          />

          {/* Menu Panel */}
          <nav
            id="mobile-navigation-panel"
            aria-label={labels.mobileNavigation}
            dir={isUrdu ? "rtl" : "ltr"}
            className="
              fixed
              left-0
              right-0
              top-0
              z-[9999]
              w-full
              border-b
              border-slate-200
              bg-white
              shadow-[0_20px_60px_-25px_rgba(15,55,60,0.30)]
            "
          >
            {/* Top Row */}
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-slate-100
                px-5
                py-4
              "
            >
              <span
                className="
                  text-sm
                  font-bold
                  uppercase
                  tracking-wider
                  text-[var(--teal-dark)]
                "
              >
                {text.menu}
              </span>

              <div className="flex items-center gap-2">
                {/* Language Switch */}
                <LocaleSwitch
                  label={labels.switchLanguage}
                  locale={locale}
                />

                {/* Close */}
                <button
                  type="button"
                  aria-label={labels.closeMenu}
                  onClick={() => setIsOpen(false)}
                  className="
                    inline-flex
                    size-10
                    items-center
                    justify-center
                    rounded-xl
                    text-slate-600
                    transition-colors
                    duration-200
                    hover:bg-[var(--aqua-soft)]
                    hover:text-[var(--teal-dark)]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[var(--teal-dark)]
                  "
                >
                  <svg
                    aria-hidden="true"
                    className="size-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 6 18 18M18 6 6 18"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-4 pb-5 pt-4 sm:px-5">
              {/* Navigation */}
              <div className="flex flex-col">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="
                      rounded-xl
                      px-1
                      py-3.5
                      text-[18px]
                      font-bold
                      leading-tight
                      text-slate-800
                      transition-colors
                      duration-200
                      hover:bg-[var(--aqua-soft)]
                      hover:px-3
                      hover:text-[var(--teal-dark)]
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[var(--teal-dark)]
                    "
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="my-4 h-px bg-slate-200" />

              {/* Call Now */}
              <a
                href={`tel:${clinicPhone}`}
                className="
                  flex
                  min-h-12
                  items-center
                  gap-3
                  rounded-xl
                  px-1
                  text-[18px]
                  font-bold
                  text-[var(--teal)]
                  transition-colors
                  duration-200
                  hover:bg-[var(--aqua-soft)]
                  hover:px-3
                  hover:text-[var(--teal-dark)]
                "
              >
                <svg
                  aria-hidden="true"
                  className="size-6 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M7.3 3.5H4.8c-.7 0-1.3.5-1.4 1.2C2.5 13.2 8.8 19.5 17.3 20.4c.7.1 1.2-.5 1.2-1.2v-2.5c0-.6-.4-1.1-1-1.3l-2.8-.7c-.5-.1-1 .1-1.3.5l-.6.8c-.2.3-.6.4-.9.2a13.2 13.2 0 0 1-4.1-4.1c-.2-.3-.1-.7.2-.9l.8-.6c.4-.3.6-.8.5-1.3l-.7-2.8c-.2-.6-.7-1-1.3-1Z"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                  />
                </svg>

                <span>{text.callNow}</span>
              </a>

              {/* Book Appointment CTA */}
              <Link
                href={`${localeRoot}#contact`}
                onClick={() => setIsOpen(false)}
                className="
                  mt-4
                  flex
                  min-h-[58px]
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--teal-dark)]
                  px-6
                  text-center
                  text-[17px]
                  font-bold
                  text-white
                  shadow-[0_12px_30px_-16px_rgba(18,75,83,0.65)]
                  transition-colors
                  duration-200
                  hover:bg-[var(--teal)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[var(--teal-dark)]
                  focus-visible:ring-offset-2
                "
              >
                {text.bookAppointment}
              </Link>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
