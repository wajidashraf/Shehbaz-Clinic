import Link from "next/link";
import Image from "next/image";
import { clinicConfig } from "@/config/public-config";
import type { Locale } from "@/i18n/config";
import { ButtonLink } from "@/components/ui/button-link";
import { LocaleSwitch } from "@/components/layout/locale-switch";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

export type SiteHeaderLabels = {
  primaryNavigation: string;
  home: string;
  services: string;
  dentists: string;
  book: string;
  bookShort?: string;
  switchLanguage: string;
  openMenu: string;
  closeMenu: string;
};

type SiteHeaderProps = {
  labels: SiteHeaderLabels;
  locale: Locale;
};

export function SiteHeader({ labels, locale }: SiteHeaderProps) {
  const localeRoot = `/${locale}`;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-white/95 backdrop-blur-md">
      <div className="relative mx-auto flex min-h-[4.75rem] max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          aria-label={`${clinicConfig.name} — ${labels.home}`}
          className="flex min-h-11 min-w-0 items-center gap-3 font-extrabold tracking-[-0.025em]"
          href={localeRoot}
        >
          <Image
            alt=""
            className="size-13 shrink-0 object-contain"
            height={52}
            priority
            src={
              locale === "ur"
                ? "/images/Logos/urduLogo.png"
                : "/images/Logos/engLogo.png"
            }
            width={52}
          />
          <span className="hidden max-w-48 leading-tight sm:block">
            {clinicConfig.name}
          </span>
        </Link>

        <nav
          aria-label={labels.primaryNavigation}
          className="flex items-center gap-2 lg:gap-5"
        >
          <span className="hidden items-center gap-1 md:flex lg:gap-2">
            <Link
              className="min-h-11 content-center rounded-full px-3 text-sm font-bold transition-colors hover:bg-[var(--aqua-soft)]"
              href={localeRoot}
            >
              {labels.home}
            </Link>
            <Link
              className="min-h-11 content-center rounded-full px-3 text-sm font-bold transition-colors hover:bg-[var(--aqua-soft)]"
              href={`${localeRoot}/services`}
            >
              {labels.services}
            </Link>
            <Link
              className="min-h-11 content-center rounded-full px-3 text-sm font-bold transition-colors hover:bg-[var(--aqua-soft)]"
              href={`${localeRoot}/dentists`}
            >
              {labels.dentists}
            </Link>
          </span>
          <LocaleSwitch label={labels.switchLanguage} locale={locale} />
          <ButtonLink
            compactLabel={labels.bookShort}
            href={`${localeRoot}/book`}
          >
            {labels.book}
          </ButtonLink>
          <MobileNavigation labels={labels} locale={locale} />
        </nav>
      </div>
    </header>
  );
}
