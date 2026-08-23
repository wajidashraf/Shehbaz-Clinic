import Image from "next/image";
import Link from "next/link";
import {
  HiOutlineArrowRight,
  HiOutlineMapPin,
  HiOutlinePhone,
} from "react-icons/hi2";

import { clinicConfig } from "@/config/public-config";

type AboutSectionProps = {
  locale: "en" | "ur";
};

const aboutCopy = {
  en: {
    ariaLabel: "About Shahbaz Dental Clinic",
    badge: "Trusted",
    since: "Since 1980",
    heading: "About Shahbaz Dental Clinic",
    interiorAlt: "Shahbaz Dental Clinic interior",
    treatmentAlt: "Dental treatment area at Shahbaz Dental Clinic",
    introductionBeforeYear:
      "Shahbaz Dental Clinic is a trusted dental care facility on Circular Road in Samundri, Punjab. Since ",
    introductionAfterYear:
      ", we have served the local community with professional dental care in a clean, safe, and comfortable environment.",
    mission:
      "Our mission is to help patients understand their oral health needs and receive appropriate treatment while providing dependable care for routine and advanced dental procedures.",
    locationLabel: "Location",
    location: "Circular Road, Samundri",
    contactLabel: "Contact",
    directions: "Get Directions on Google Maps",
  },
  ur: {
    ariaLabel: "شہباز ڈینٹل کلینک کے بارے میں",
    badge: "قابلِ اعتماد",
    since: "1980 سے",
    heading: "شہباز ڈینٹل کلینک کے بارے میں",
    interiorAlt: "شہباز ڈینٹل کلینک کا اندرونی منظر",
    treatmentAlt: "شہباز ڈینٹل کلینک کا علاج کا کمرہ",
    introductionBeforeYear:
      "شہباز ڈینٹل کلینک، سمندری، پنجاب میں سرکلر روڈ پر دانتوں کی نگہداشت کا ایک قابلِ اعتماد مرکز ہے۔ سن ",
    introductionAfterYear:
      " سے ہم صاف، محفوظ اور آرام دہ ماحول میں مقامی کمیونٹی کو پیشہ ورانہ دانتوں کی نگہداشت فراہم کر رہے ہیں۔",
    mission:
      "ہمارا مقصد مریضوں کو ان کی منہ کی صحت کی ضروریات سمجھنے اور مناسب علاج حاصل کرنے میں مدد دینا ہے، جبکہ معمول اور جدید دانتوں کے طریقۂ علاج کے لیے قابلِ اعتماد نگہداشت فراہم کی جاتی ہے۔",
    locationLabel: "مقام",
    location: "سرکلر روڈ، سمندری",
    contactLabel: "رابطہ",
    directions: "گوگل میپس پر راستہ دیکھیں",
  },
} as const;

export function AboutSection({ locale }: AboutSectionProps) {
  const isRtl = locale === "ur";
  const content = aboutCopy[locale];

  return (
    <section
      id="about"
      aria-label={content.ariaLabel}
      className="
        scroll-mt-28
        bg-[#fff]
        pb-14 pt-12
        sm:pb-16 sm:pt-14
        lg:py-0
      "
    >
      <div
        className="
          mx-auto max-w-7xl
          px-5
          sm:px-6
          lg:min-h-[600px]
          lg:px-8
          lg:py-16
        "
      >
        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className={isRtl ? "text-right" : "text-left"}>
          {/* Since 1988 */}
          <div
            className={`
            mb-5 inline-flex items-center gap-3
            rounded-full
            border-4 border-[var(--teal)]
            bg-white
            px-4 py-1.5
            shadow-[0_12px_28px_-18px_rgba(7,48,71,0.35)]
        `}
          >
            <span
              aria-hidden="true"
              className="
                relative flex size-8 shrink-0
                items-center justify-center
                rounded-full
                bg-[var(--teal)]
                text-white
                shadow-[0_10px_22px_-14px_color-mix(in_srgb,var(--teal)_55%,transparent)]
                "
            >
              <span className="absolute inset-[4px] rounded-full border-2 border-white/35" />

              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="relative z-10 size-3"
              >
                <path
                  d="m7 12 3.2 3.2L17 8.5"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <span
              className={`flex flex-col leading-none ${isRtl ? "text-right" : "text-left"}`}
            >
              <span
                className={`
                    text-[13px] font-extrabold
                    uppercase tracking-[0.08em]
                    text-[var(--primary-ink)]
                `}
              >
                {content.badge}
              </span>

              <span className="mt-1 text-sm font-bold text-[var(--teal)]">
                {content.since}
              </span>
            </span>
          </div>

          <h2
            className="
              text-2xl
              font-extrabold
              leading-tight
              text-[var(--primary-ink)]
              sm:text-[1.75rem]
              lg:text-[2.15rem]
            "
          >
            {content.heading}
          </h2>
        </div>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}
        <div
          className="
            mt-8 grid
            items-center
            gap-9

            lg:mt-8
            lg:grid-cols-[1.05fr_0.95fr]
            lg:gap-14

            xl:gap-16
          "
        >
          {/* ===================================================
              IMAGES

              Mobile = first
              Desktop = right side
          ==================================================== */}
          <div
            className="
              order-1
              relative
              w-full

              lg:order-2
              lg:min-h-[400px]
            "
          >
            {/* MOBILE / TABLET */}
            <div
              className="
                relative
                h-[240px]
                w-full
                sm:h-[310px]
                md:h-[350px]
                lg:hidden
              "
            >
              {/* Image 1 */}
              <div
                className="
                  absolute
                  bottom-5 start-0
                  z-10

                  h-[72%]
                  w-[55%]
                  md:h-[82%]
                  md:w-[61%]

                  overflow-hidden
                  rounded-[1.5rem]
                  border-[5px] border-white
                  bg-white

                  shadow-[0_24px_45px_-24px_rgba(7,48,71,0.45)]
                "
              >
                <Image
                  src="/images/demo/aboutImage1.avif"
                  alt={content.interiorAlt}
                  fill
                  className="object-cover"
                  sizes="60vw"
                />
              </div>

              {/* Image 2 */}
              <div
                className="
                  absolute
                  end-0 top-0
                  z-20

                  h-[72%]
                  w-[55%]
                  md:h-[82%]
                  md:w-[61%]

                  overflow-hidden
                  rounded-[1.5rem]
                  border-[5px] border-white
                  bg-white

                  shadow-[0_24px_45px_-24px_rgba(7,48,71,0.45)]
                "
              >
                <Image
                  src="/images/demo/aboutImage2.avif"
                  alt={content.treatmentAlt}
                  fill
                  className="object-cover"
                  sizes="60vw"
                />
              </div>
            </div>

            {/* DESKTOP */}
            <div
              className="
                relative hidden
                min-h-[400px]
                lg:block
              "
            >
              {/* LOWER / LEFT IMAGE */}
              <div
                className="
                  absolute
                  bottom-4 start-0
                  z-10

                  h-[240px]
                  w-[340px]
                  max-w-[68%]

                  overflow-hidden
                  rounded-[2rem]
                  border-[6px] border-white
                  bg-white

                  shadow-[0_30px_65px_-28px_rgba(7,48,71,0.48)]

                  transition-shadow
                  duration-300
                  ease-out

                  hover:z-30
                  hover:shadow-[0_38px_75px_-28px_rgba(7,48,71,0.58)]
                "
              >
                <Image
                  src="/images/demo/aboutImage1.avif"
                  alt={content.interiorAlt}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>

              {/* UPPER / RIGHT IMAGE */}
              <div
                className="
                  absolute
                  end-0 top-4
                  z-20

                  h-[240px]
                  w-[340px]
                  max-w-[68%]

                  overflow-hidden
                  rounded-[2rem]
                  border-[6px] border-white
                  bg-white

                  shadow-[0_30px_65px_-28px_rgba(7,48,71,0.48)]

                  transition-shadow
                  duration-300
                  ease-out

                  hover:z-30
                  hover:shadow-[0_38px_75px_-28px_rgba(7,48,71,0.58)]
                "
              >
                <Image
                  src="/images/demo/aboutImage2.avif"
                  alt={content.treatmentAlt}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
            </div>
          </div>

          {/* ===================================================
              TEXT CONTENT

              Mobile = after images
              Desktop = left side
          ==================================================== */}
          <div
            className={`
              order-2
              lg:order-1
              ${isRtl ? "text-right" : "text-left"}
            `}
          >
            <div
              className="
                space-y-4
                text-base
                leading-7
                text-[var(--muted-text)]

                sm:leading-8
                lg:text-[17px]
              "
            >
              <p>
                {content.introductionBeforeYear}
                <strong className="font-semibold text-[var(--primary-ink)]">
                  1980
                </strong>
                {content.introductionAfterYear}
              </p>

              <p>{content.mission}</p>
            </div>

            {/* =================================================
                INFO CARDS
            ================================================== */}
            <div
              className="
                mt-6 grid gap-3
                sm:grid-cols-2
                sm:gap-4
              "
            >
              {/* Location */}
              <div
                className="
                  rounded-2xl
                  border border-[var(--line)]
                  bg-[var(--aqua-soft)]
                  px-4 py-4
                  sm:px-5
                "
              >
                <div className="flex items-center gap-3">
                  <span
                    className="
                      flex size-10 shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-white
                      text-[var(--teal)]
                      shadow-[0_10px_25px_-18px_rgba(7,48,71,0.35)]
                    "
                  >
                    <HiOutlineMapPin aria-hidden="true" className="size-5" />
                  </span>

                  <div>
                    <h3 className="font-extrabold text-[var(--primary-ink)]">
                      {content.locationLabel}
                    </h3>

                    <p className="mt-0.5 text-sm text-[var(--muted-text)]">
                      {content.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div
                className="
                  rounded-2xl
                  border border-[var(--line)]
                  bg-[var(--aqua-soft)]
                  px-4 py-4
                  sm:px-5
                "
              >
                <div className="flex items-center gap-3">
                  <span
                    className="
                      flex size-10 shrink-0
                      items-center justify-center
                      rounded-xl
                      bg-white
                      text-[var(--teal)]
                      shadow-[0_10px_25px_-18px_rgba(7,48,71,0.35)]
                    "
                  >
                    <HiOutlinePhone aria-hidden="true" className="size-5" />
                  </span>

                  <div>
                    <h3 className="font-extrabold text-[var(--primary-ink)]">
                      {content.contactLabel}
                    </h3>

                    <p className="mt-0.5 text-sm text-[var(--muted-text)]">
                      <a dir="ltr" href={clinicConfig.phoneHref}>
                        <bdi>+92 344 3420001</bdi>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                CTA
            ================================================== */}
            <div className="mt-6">
              <Link
                href="https://maps.app.goo.gl/L3pRisdzNg4QYJ8e9"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center gap-2
                  font-bold
                  text-[var(--teal)]
                  transition-colors
                  duration-300
                  hover:text-[var(--teal-dark)]
                "
              >
                {content.directions}
                <HiOutlineArrowRight
                  aria-hidden="true"
                  className={`
                    size-5
                    ${isRtl ? "rotate-180" : ""}
                  `}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
