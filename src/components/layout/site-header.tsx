import Image from "next/image";
import Link from "next/link";

import { LocaleSwitch } from "@/components/layout/locale-switch";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { clinicConfig } from "@/config/public-config";
import type { Locale } from "@/i18n/config";
import { HeaderTopBar } from "@/components/ui/headerTopBar";
import { HeaderScrollSurface } from "@/components/ui/header-scroll-surface";

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

const desktopNavLinkClass =
  "group relative flex min-h-11 items-center px-3 text-sm font-semibold " +
  "text-slate-700 transition-colors duration-200 hover:text-[var(--teal-dark)] " +
  "after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 " +
  "after:origin-center after:scale-x-0 after:rounded-full " +
  "after:bg-[var(--teal-dark)] after:transition-transform after:duration-200 " +
  "hover:after:scale-x-100";

export function SiteHeader({ labels, locale }: SiteHeaderProps) {
  const localeRoot = `/${locale}`;

  return (<>
  <HeaderTopBar />
  <header className="sticky top-0 z-50">

  <HeaderScrollSurface>
    <div className="mx-auto flex min-h-[5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      {/* Brand */}
      <Link
        aria-label={`${clinicConfig.name} — ${labels.home}`}
        className="group flex min-w-0 items-center gap-3.5"
        href={localeRoot}
      >
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
          <Image
            alt=""
            className="size-13 object-contain"
            height={52}
            priority
            src={
              locale === "ur"
                ? "/images/Logos/urduLogo.png"
                : "/images/Logos/engLogo.png"
            }
            width={52}
          />
        </span>

        <span className="hidden min-w-0 sm:block">
          <span className="block max-w-56 truncate text-[0.98rem] font-extrabold leading-tight tracking-[-0.025em] text-slate-900 transition-colors duration-200 group-hover:text-[var(--teal-dark)]">
            {clinicConfig.name}
          </span>

          <span className="mt-1 block text-[0.63rem] font-bold uppercase tracking-[0.12em] text-slate-500 md:hidden">
            {clinicConfig.registration}
          </span>
        </span>
      </Link>

      {/* Navigation */}
      <nav
        aria-label={labels.primaryNavigation}
        className="flex items-center gap-1.5 lg:gap-3"
      >
        <div className="hidden items-center md:flex">
          <Link className={desktopNavLinkClass} href={localeRoot}>
            {labels.home}
          </Link>

          <Link
            className={desktopNavLinkClass}
            href={`${localeRoot}/services`}
          >
            {labels.services}
          </Link>

          <Link
            className={desktopNavLinkClass}
            href={`${localeRoot}/dentists`}
          >
            {labels.dentists}
          </Link>
        </div>

        <span
          aria-hidden="true"
          className="mx-1 hidden h-6 w-px bg-slate-200 md:block lg:mx-2"
        />

        <LocaleSwitch
          label={labels.switchLanguage}
          locale={locale}
        />

        <div className="hidden sm:block">
          {/* <ButtonLink
            compactLabel={labels.bookShort}
            href={`${localeRoot}/book`}
          >
            {labels.book}
          </ButtonLink> */}
          <ButtonLink
                href={`${localeRoot}/book`}
                variant="primary"
                size="large"

              >
               {labels.book}
              </ButtonLink>
        </div>

        <MobileNavigation labels={labels} locale={locale} />
      </nav>
    </div>
  </HeaderScrollSurface>
</header>
</>
  );
}
