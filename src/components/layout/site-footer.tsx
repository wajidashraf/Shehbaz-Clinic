import Image from "next/image";
import Link from "next/link";

import { clinicConfig } from "@/config/public-config";
import type { Locale } from "@/i18n/config";

type SiteFooterProps = {
  locale: Locale;

  labels: {
    summary: string;
    locality: string;
    demonstration: string;
    services: string;
    dentists: string;
    book: string;
  };
};

const footerLinks = {
  company: [
    {
      label: "Home",
      href: "",
    },
    {
      label: "Services",
      href: "/services",
    },
    {
      label: "Dentists",
      href: "/dentists",
    },
    {
      label: "Book Appointment",
      href: "/book",
    },
  ],

  services: [
    "Dental Cleaning",
    "Root Canal Treatment",
    "Dental Implants",
    "Teeth Whitening",
    "Orthodontics",
  ],
};

export function SiteFooter({ labels, locale }: SiteFooterProps) {
  return (
    <footer
      className="
        relative
        overflow-hidden

        bg-[var(--primary-ink)]

        text-white
      "
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -start-40
          top-0

          size-[28rem]

          rounded-full

          bg-[var(--teal)]

          opacity-20

          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -end-40
          bottom-0

          size-[30rem]

          rounded-full

          bg-cyan-400

          opacity-10

          blur-3xl
        "
      />

      <div
        className="
          relative

          mx-auto
          max-w-7xl

          px-5
          py-14

          sm:px-6

          lg:px-8
          lg:py-16
        "
      >
        <div
          className="
            grid
            gap-12

            md:grid-cols-2

            lg:grid-cols-[1.4fr_0.8fr_0.8fr]
          "
        >
          {/* Clinic Information */}
          <div>
            <Link
              href={`/${locale}`}
              className="
                inline-flex
                items-center
                gap-4

                group
              "
            >
              <span
                className="
                  grid
                  size-16
                  place-items-center

                  rounded-2xl

                  bg-white

                  shadow-lg

                  transition-transform
                  duration-500

                  group-hover:-translate-y-1
                "
              >
                <Image
                  alt={clinicConfig.name}
                  className="size-14 object-contain"
                  height={56}
                  width={56}
                  src={
                    locale === "ur"
                      ? "/images/Logos/urduLogo.png"
                      : "/images/Logos/engLogo.png"
                  }
                />
              </span>

              <span className="flex flex-col">
                <span
                  className="
                    text-xl
                    font-extrabold
                    tracking-[-0.03em]
                  "
                >
                  {clinicConfig.name}
                </span>

                <span
                  className="
                    mt-1

                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.12em]

                    text-cyan-200
                  "
                >
                  {clinicConfig.registration}
                </span>
              </span>
            </Link>

            <p
              className="
                mt-6

                max-w-md

                text-sm

                leading-7

                text-white/70
              "
            >
              {labels.summary}
            </p>

            {/* Address */}
            <div
              className="
                mt-6

                rounded-2xl

                border
                border-white/10

                bg-white/5

                p-4

                backdrop-blur-sm
              "
            >
              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-cyan-200
                "
              >
                Clinic Address
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-white/80
                "
              >
                Circular Road near Ahle Hadees Masjid,
                <br />
                Samundri, Faisalabad,
                <br />
                Punjab, Pakistan
              </p>
            </div>

            {/* Timing */}
            <div className="mt-4 flex items-center gap-3">
              <span
                className="
                  grid
                  size-10
                  place-items-center

                  rounded-xl

                  bg-white/10
                "
              >
                🕘
              </span>

              <div>
                <p className="text-xs text-white/50">Opening Hours</p>

                <p className="text-sm font-bold">9:00 AM – 8:00 PM Daily</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3
              className="
                text-sm
                font-extrabold

                uppercase
                tracking-[0.12em]

                text-cyan-200
              "
            >
              Quick Links
            </h3>

            <nav
              className="
                mt-5

                flex
                flex-col
                gap-3
              "
            >
              {footerLinks.company.map((item) => (
                <Link
                  key={item.label}
                  href={`/${locale}${item.href}`}
                  className="
                      text-sm
                      text-white/75

                      transition-colors

                      hover:text-white
                    "
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services / Social */}
          <div>
            <h3
              className="
                text-sm
                font-extrabold

                uppercase
                tracking-[0.12em]

                text-cyan-200
              "
            >
              Services
            </h3>

            <ul
              className="
                mt-5
                space-y-3
              "
            >
              {footerLinks.services.map((service) => (
                <li
                  key={service}
                  className="
                      text-sm
                      text-white/70
                    "
                >
                  {service}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={`/${locale}/book`}
              className="
                mt-7

                inline-flex

                rounded-xl

                bg-white

                px-5
                py-3

                text-sm
                font-extrabold

                text-[var(--teal-dark)]

                shadow-lg

                transition-all

                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              Book Appointment
            </Link>
          </div>
        </div>

        {/* Bottom bar */}

        <div
          className="
            mt-12

            flex
            flex-col
            gap-4

            border-t
            border-white/10

            pt-6

            text-xs

            text-white/50

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p>
            © {new Date().getFullYear()} {clinicConfig.name}. All rights
            reserved.
          </p>

          <div className="flex gap-5">
            {/* Add verified links here */}
            <span>Google</span>

            <span>Facebook</span>

            <span>Merham</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
