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
  if (!pathname) return `/${alternateLocale}`;

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
      className="grid min-h-11 place-items-center rounded-full border border-[var(--line-strong)] bg-white px-3 text-sm font-extrabold transition-colors hover:bg-[var(--aqua-soft)] sm:px-4"
      href={getAlternateLocalePath(pathname, locale)}
      hrefLang={alternateLocale}
    >
      <bdi>{label}</bdi>
    </Link>
  );
}
