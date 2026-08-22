"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/i18n/config";

type LocaleSwitchProps = {
  label: string;
  locale: Locale;
};

export function getAlternateLocalePath(
  pathname: string | null,
  locale: Locale,
) {
  const alternateLocale = locale === "en" ? "ur" : "en";

  if (!pathname) {
    return `/${alternateLocale}`;
  }

  const segments = pathname.split("/");

  if (segments[1] === locale) {
    segments[1] = alternateLocale;
    return segments.join("/") || `/${alternateLocale}`;
  }

  return `/${alternateLocale}`;
}

export function LocaleSwitch({ label, locale }: LocaleSwitchProps) {
  const pathname = usePathname();
  const alternateLocale = locale === "en" ? "ur" : "en";

  return (
    <Link
      aria-label={label}
      className="
        inline-flex min-h-11 items-center justify-center
        rounded-lg border border-slate-200
        bg-white px-3.5
        text-sm font-bold text-slate-700
        shadow-sm
        transition-[color,background-color,border-color,box-shadow,transform]
        duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]
        hover:-translate-y-0.5
        hover:border-sky-200
        hover:bg-[var(--aqua-soft)]
        hover:text-[var(--teal-dark)]
        hover:shadow-md
        active:translate-y-0
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--teal-dark)]
        focus-visible:ring-offset-2
        sm:px-4
      "
      href={getAlternateLocalePath(pathname, locale)}
      hrefLang={alternateLocale}
    >
      <bdi>{label}</bdi>
    </Link>
  );
}
