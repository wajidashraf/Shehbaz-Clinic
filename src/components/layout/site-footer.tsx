import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";

import { clinicConfig } from "@/config/public-config";
import type { Locale } from "@/i18n/config";

type SiteFooterProps = {
  locale: Locale;
  labels: {
    about: string;
    addressLabel: string;
    book: string;
    contact: string;
    daily: string;
    hoursLabel: string;
    locality: string;
    quickLinks: string;
    reviews: string;
    rights: string;
    serviceChildren: string;
    serviceCleaning: string;
    serviceConsultation: string;
    serviceRootCanal: string;
    services: string;
    summary: string;
    theDentist: string;
  };
};

/* ============================================================
   SOCIAL ICON
============================================================ */

function SocialIcon({ name }: { name: string }) {
  const normalizedName = name.trim().toLowerCase();

  const iconClass = "block size-[20px] shrink-0 align-middle leading-none";

  switch (normalizedName) {
    case "facebook":
      return <FaFacebookF aria-hidden="true" className={iconClass} />;

    case "linkedin":
      return <FaLinkedinIn aria-hidden="true" className={iconClass} />;

    case "instagram":
      return (
        <FaInstagram
          aria-hidden="true"
          className="block size-[21px] shrink-0"
        />
      );

    case "x":
    case "twitter":
      return (
        <FaXTwitter aria-hidden="true" className="block size-[19px] shrink-0" />
      );

    case "tiktok":
      return (
        <FaTiktok aria-hidden="true" className="block size-[20px] shrink-0" />
      );

    /*
     * Oladoc icon
     * Based on the circular medical "+" symbol
     * from the supplied Oladoc branding.
     */
    case "oladoc":
      return (
        <svg
          aria-hidden="true"
          className="block size-[22px] shrink-0"
          fill="none"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" fill="#24246F" r="32" />

          <path d="M28 18H36V28H46V36H36V46H28V36H18V28H28V18Z" fill="white" />
        </svg>
      );

    case "marham":
      return (
        <svg
          aria-hidden="true"
          className="block size-[24px] shrink-0"
          fill="none"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="29" fill="#075F86" />

          <path
            d="M18.5 20H25.5L32 26.7L27.3 31.7L25.8 30.2V44H18.5V20Z"
            fill="#76C9D6"
          />

          <path
            d="M27.2 31.6L37.4 20H45.5V44H38V30.2L32.4 36.1L27.2 31.6Z"
            fill="#FFFFFF"
          />
        </svg>
      );

    default:
      return (
        <svg
          aria-hidden="true"
          className="block size-[20px] shrink-0"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="8"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <path
            d="M8.5 12h7M12 8.5v7"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
      );
  }
}

/* ============================================================
   FOOTER
============================================================ */

export function SiteFooter({ labels, locale }: SiteFooterProps) {
  const root = `/${locale}`;

  const navigation = [
    {
      href: `${root}#about`,
      label: labels.about,
    },
    {
      href: `${root}#services`,
      label: labels.services,
    },
    {
      href: `${root}#dentist`,
      label: labels.theDentist,
    },
    {
      href: `${root}#reviews`,
      label: labels.reviews,
    },
    {
      href: `${root}#contact`,
      label: labels.contact,
    },
  ];

  const services = [
    labels.serviceConsultation,
    labels.serviceCleaning,
    labels.serviceRootCanal,
    labels.serviceChildren,
  ];

  return (
    <footer
      className="
        relative overflow-hidden
        bg-[var(--primary-ink)]
        text-white
      "
    >
      {/* Decorative background glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -start-40 top-0
          size-[28rem]
          rounded-full
          bg-[var(--teal)]/20
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -end-40 bottom-[-10rem]
          size-[24rem]
          rounded-full
          bg-[var(--aqua)]/10
          blur-3xl
        "
      />

      <div
        className="
          relative mx-auto
          max-w-7xl
          px-5 py-14
          sm:px-6
          lg:px-8 lg:py-16
        "
      >
        {/* ======================================================
            MAIN FOOTER CONTENT
        ====================================================== */}

        <div
          className="
            grid gap-10
            md:grid-cols-2
            lg:grid-cols-[1.35fr_0.75fr_0.9fr]
            lg:gap-14
          "
        >
          {/* ====================================================
              CLINIC DETAILS
          ==================================================== */}

          <div>
            <Link className="group inline-flex items-center gap-4" href={root}>
              {/* Logo */}
              <span
                className="
                  grid size-14 shrink-0
                  place-items-center
                  rounded-xl
                  bg-white
                  shadow-[0_12px_30px_-18px_rgba(0,0,0,0.55)]
                  transition-[transform,box-shadow]
                  duration-300
                  ease-[cubic-bezier(0.65,0,0.35,1)]

                  group-hover:-translate-y-0.5
                  group-hover:shadow-[0_16px_34px_-18px_rgba(0,0,0,0.65)]
                "
              >
                <Image
                  alt=""
                  className="size-12 object-contain"
                  height={48}
                  src={
                    locale === "ur"
                      ? "/images/Logos/urduLogo.png"
                      : "/images/Logos/engLogo.png"
                  }
                  width={48}
                />
              </span>

              {/* Clinic identity */}
              <span>
                <span
                  className="
                    block text-lg
                    font-extrabold
                    tracking-[-0.02em]
                  "
                >
                  {clinicConfig.name}
                </span>

                <span
                  className="
                    mt-1 block
                    text-xs font-bold
                    text-cyan-200
                  "
                >
                  <bdi>{clinicConfig.registration}</bdi>
                </span>
              </span>
            </Link>

            {/* Summary */}
            <p
              className="
                mt-5 max-w-md
                text-sm leading-7
                text-white/70
              "
            >
              {labels.summary}
            </p>

            {/* Address + timings */}
            <div
              className="
                mt-6 grid gap-4
                sm:grid-cols-2
                md:grid-cols-1
              "
            >
              <div>
                <p
                  className="
                    text-xs font-bold
                    tracking-[0.1em]
                    text-cyan-200
                    uppercase
                  "
                >
                  {labels.addressLabel}
                </p>

                <p className="mt-1 text-sm leading-6 text-white/78">
                  {labels.locality}
                </p>
              </div>

              <div>
                <p
                  className="
                    text-xs font-bold
                    tracking-[0.1em]
                    text-cyan-200
                    uppercase
                  "
                >
                  {labels.hoursLabel}
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  <bdi>{clinicConfig.openingHours.display}</bdi>

                  <span aria-hidden="true"> · </span>

                  {labels.daily}
                </p>
              </div>
            </div>
          </div>

          {/* ====================================================
              QUICK LINKS
          ==================================================== */}

          <nav aria-label={labels.quickLinks}>
            <h2
              className="
                text-sm font-extrabold
                tracking-[0.12em]
                text-cyan-200
                uppercase
              "
            >
              {labels.quickLinks}
            </h2>

            <ul className="mt-5 space-y-1">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    className="
                      flex min-h-11
                      items-center
                      text-sm font-semibold
                      text-white/72
                      transition-[color,transform]
                      duration-200

                      hover:translate-x-0.5
                      hover:text-white

                      rtl:hover:-translate-x-0.5
                    "
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ====================================================
              SERVICES
          ==================================================== */}

          <div>
            <h2
              className="
                text-sm font-extrabold
                tracking-[0.12em]
                text-cyan-200
                uppercase
              "
            >
              {labels.services}
            </h2>

            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li
                  className="
                    text-sm leading-6
                    text-white/70
                  "
                  key={service}
                >
                  {service}
                </li>
              ))}
            </ul>

            {/* Book button */}
            <Link
              className="
                mt-7 inline-flex
                min-h-11
                items-center justify-center
                rounded-xl
                bg-white
                px-5 py-2.5

                text-sm font-extrabold
                text-[var(--teal-dark)]

                shadow-[0_12px_28px_-18px_rgba(255,255,255,0.45)]

                transition-[background-color,transform,box-shadow]
                duration-300
                ease-[cubic-bezier(0.65,0,0.35,1)]

                hover:-translate-y-0.5
                hover:bg-cyan-50
                hover:shadow-[0_16px_32px_-18px_rgba(255,255,255,0.55)]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-cyan-200
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[var(--primary-ink)]
              "
              href={`${root}/book`}
            >
              {labels.book}
            </Link>
          </div>
        </div>

        {/* ======================================================
            FOOTER BOTTOM
        ====================================================== */}

        <div
          className="
            mt-12 flex
            flex-col gap-5
            border-t border-white/10
            pt-6
            text-xs text-white/50

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* Copyright */}
          <p>
            © {new Date().getFullYear()} {clinicConfig.name}. {labels.rights}
          </p>

          {/* ====================================================
              SOCIAL LINKS
          ==================================================== */}

          <div
            aria-label="Social links"
            className="
              flex flex-wrap
              items-center
              gap-2.5

              lg:justify-end
            "
          >
            {clinicConfig.socialLinks.map((social) => (
              <a
                aria-label={social.label}
                className="
                  group

                  flex size-11
                  shrink-0
                  items-center
                  justify-center

                  rounded-xl

                  border
                  border-white/15

                  bg-white/[0.07]

                  text-white/85

                  shadow-[0_8px_24px_-16px_rgba(0,0,0,0.65)]

                  backdrop-blur-md

                  transition-[background-color,border-color,color,transform,box-shadow]
                  duration-300
                  ease-[cubic-bezier(0.65,0,0.35,1)]

                  hover:-translate-y-0.5
                  hover:border-cyan-200/40
                  hover:bg-white/[0.14]
                  hover:text-white

                  hover:shadow-[0_12px_30px_-15px_rgba(103,232,249,0.32)]

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-cyan-200
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[var(--primary-ink)]
                "
                href={social.href}
                key={social.label}
                rel="noopener noreferrer"
                target="_blank"
                title={social.label}
              >
                <span
                  className="
                    flex size-6
                    items-center
                    justify-center
                    leading-none
                  "
                >
                  <SocialIcon name={social.label} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
