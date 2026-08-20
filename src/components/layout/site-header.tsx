import Link from "next/link";
import { clinicConfig } from "@/config/public-config";
import type { Locale } from "@/i18n/config";
import { ButtonLink } from "@/components/ui/button-link";

export type SiteHeaderLabels = {
  primaryNavigation: string;
  home: string;
  services: string;
  book: string;
  login: string;
  switchLanguage: string;
};

type SiteHeaderProps = {
  labels: SiteHeaderLabels;
  locale: Locale;
};

export function SiteHeader({ labels, locale }: SiteHeaderProps) {
  const alternateLocale = locale === "en" ? "ur" : "en";
  const localeRoot = `/${locale}`;

  return (
    <header className="border-b border-[var(--line)] bg-white/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8">
        <Link
          className="flex min-h-11 items-center gap-3 font-extrabold tracking-[-0.02em]"
          href={localeRoot}
        >
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-[35%_65%_55%_45%] bg-[var(--teal)] text-sm text-white"
          >
            SD
          </span>
          <span>{clinicConfig.name}</span>
        </Link>

        <nav
          aria-label={labels.primaryNavigation}
          className="flex items-center gap-2 md:gap-6"
        >
          <span className="hidden items-center gap-6 md:flex">
            <Link
              className="min-h-11 content-center text-sm font-semibold"
              href={localeRoot}
            >
              {labels.home}
            </Link>
            <Link
              className="min-h-11 content-center text-sm font-semibold"
              href={`${localeRoot}/services`}
            >
              {labels.services}
            </Link>
            <Link
              className="min-h-11 content-center text-sm font-semibold"
              href={`${localeRoot}/login`}
            >
              {labels.login}
            </Link>
          </span>
          <Link
            className="min-h-11 content-center rounded-full border border-[var(--line)] px-4 text-sm font-bold"
            href={`/${alternateLocale}`}
            hrefLang={alternateLocale}
          >
            <bdi>{labels.switchLanguage}</bdi>
          </Link>
          <ButtonLink href={`${localeRoot}/book`}>{labels.book}</ButtonLink>
        </nav>
      </div>
    </header>
  );
}
