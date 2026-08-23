import Image from "next/image";
import Link from "next/link";

import { LocaleSwitch } from "@/components/layout/locale-switch";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { clinicConfig } from "@/config/public-config";
import type { Locale } from "@/i18n/config";
import { HeaderTopBar } from "@/components/ui/headerTopBar";
import { HeaderScrollSurface } from "@/components/ui/header-scroll-surface";

export type SiteHeaderLabels = {
  about: string;
  clinicName: string;
  primaryNavigation: string;
  home: string;
  services: string;
  theDentist: string;
  reviews: string;
  contact: string;
  book: string;
  call: string;
  directions: string;
  mobileNavigation: string;
  quickActions: string;
  whatsapp: string;
  openDaily?: string;
  address?: string;
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

  return (
    <>
      <HeaderTopBar
        labels={{
          address: labels.address ?? clinicConfig.streetAddress,
          openDaily: labels.openDaily ?? "Open daily",
        }}
      />
      <header className="sticky top-0 z-40">
        <HeaderScrollSurface>
          <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:min-h-[5rem] sm:px-6 lg:px-8">
            {/* Brand */}
            <Link
              aria-label={`${labels.clinicName} — ${labels.home}`}
              className="group flex min-w-0 items-center gap-3.5"
              href={localeRoot}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-0.5 group-hover:shadow-md sm:size-14">
                <Image
                  alt=""
                  className="size-10 object-contain sm:size-13"
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

              <span className="min-w-0">
                <span className="block max-w-36 whitespace-normal text-sm font-extrabold leading-tight tracking-[-0.025em] text-[var(--teal-dark)] transition-colors duration-200 sm:max-w-none sm:whitespace-nowrap sm:text-[0.98rem] sm:text-slate-900 group-hover:text-[var(--teal-dark)]">
                  {labels.clinicName}
                </span>

                <span className="mt-1 hidden text-[0.63rem] font-bold uppercase tracking-[0.12em] text-slate-500 sm:block md:hidden">
                  {clinicConfig.registration}
                </span>
              </span>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-1.5 lg:gap-3">
              <nav aria-label={labels.primaryNavigation}>
                <div className="hidden items-center md:flex">
                  <Link
                    className={desktopNavLinkClass}
                    href={`${localeRoot}#about`}
                  >
                    {labels.about}
                  </Link>

                  <Link
                    className={desktopNavLinkClass}
                    href={`${localeRoot}#services`}
                  >
                    {labels.services}
                  </Link>

                  <Link
                    className={desktopNavLinkClass}
                    href={`${localeRoot}#dentist`}
                  >
                    {labels.theDentist}
                  </Link>

                  <Link
                    className={desktopNavLinkClass}
                    href={`${localeRoot}#reviews`}
                  >
                    {labels.reviews}
                  </Link>

                  <Link
                    className={desktopNavLinkClass}
                    href={`${localeRoot}#contact`}
                  >
                    {labels.contact}
                  </Link>
                </div>
              </nav>

              <span
                aria-hidden="true"
                className="mx-1 hidden h-6 w-px bg-slate-200 md:block lg:mx-2"
              />

              <div className="hidden md:block">
                <LocaleSwitch label={labels.switchLanguage} locale={locale} />
              </div>

              <div className="hidden sm:block">
                <ButtonLink href={`${localeRoot}/book`} size="large">
                  {labels.book}
                </ButtonLink>
              </div>

              <MobileMenu
                labels={{
                  about: labels.about,
                  closeMenu: labels.closeMenu,
                  contact: labels.contact,
                  mobileNavigation: labels.mobileNavigation,
                  openMenu: labels.openMenu,
                  reviews: labels.reviews,
                  services: labels.services,
                  switchLanguage: labels.switchLanguage,
                  theDentist: labels.theDentist,
                }}
                locale={locale}
              />
            </div>
          </div>
        </HeaderScrollSurface>
      </header>
      <MobileNavigation
        locale={locale}
        labels={{
          book: labels.bookShort ?? labels.book,
          call: labels.call,
          directions: labels.directions,
          mobileNavigation: labels.quickActions,
          whatsapp: labels.whatsapp,
        }}
      />
    </>
  );
}
