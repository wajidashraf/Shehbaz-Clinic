"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getLocalizedText } from "@/content/demo-content";
import type { Locale } from "@/i18n/config";
import type { DoctorRecord } from "@/modules/doctors/doctor.types";

type FeaturedDoctorSectionProps = {
  doctor: DoctorRecord;
  labels: {
    eyebrow: string;
    focus: string;
    heading: string;
    pause: string;
    resume: string;
    specialty: string;
    subheading: string;
    viewProfile: string;
  };
  locale: Locale;
};

export function FeaturedDoctorSection({
  doctor,
  labels,
  locale,
}: FeaturedDoctorSectionProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [paused, setPaused] = useState(false);

  const images =
    doctor.featuredImages.length > 0
      ? doctor.featuredImages
      : [{ url: doctor.image, altText: doctor.imageAlt }];

  const fallbackFocus =
    locale === "ur"
      ? ["کلینیکل معیار اور نگرانی", "مریضوں کا تجربہ", "کلینک کی قیادت"]
      : [
          "Clinical quality and oversight",
          "Patient experience",
          "Clinic leadership",
        ];

  const focusAreas =
    doctor.focusAreas.length > 0
      ? doctor.focusAreas.map((focus) => getLocalizedText(focus, locale))
      : fallbackFocus;

  const biography = getLocalizedText(doctor.biography, locale);

  const profileSummary =
    doctor.id === "manzoor-shahbaz" && biography.length < 120
      ? locale === "ur"
        ? "ڈاکٹر منظور شہباز شہباز ڈینٹل کلینک کی قیادت کرتے ہیں، جہاں ان کی توجہ کلینیکل معیار، مربوط مریض نگہداشت اور کلینک میں مستقل پیشہ ورانہ معیار برقرار رکھنے پر ہے۔"
        : "Dr. Manzoor Shahbaz leads Shahbaz Dental Clinic with a focus on clinical quality, coordinated patient care, and maintaining consistent professional standards across the clinic."
      : biography;

  useEffect(() => {
    if (
      images.length <= 1 ||
      paused ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length);
    }, 4_000);

    return () => window.clearInterval(interval);
  }, [images.length, paused]);

  return (
    <section
      className="
        relative isolate overflow-hidden
        border-y border-[var(--line)]
        bg-[var(--mineral)]
        py-14
        text-[var(--ink)]
        shadow-[inset_0_1px_0_var(--line),inset_0_-1px_0_var(--line),0_18px_50px_-38px_var(--teal-dark)]
        sm:py-16
        lg:py-14
      "
      data-testid="featured-doctor-section"
    >
      {/* Background glow - left */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -start-48 -top-56
          size-[38rem]
          rounded-full
          bg-[var(--aqua)]/55
          blur-3xl
        "
      />

      {/* Background glow - right */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -end-40 bottom-[-12rem]
          size-[34rem]
          rounded-full
          bg-[var(--teal)]/10
          blur-3xl
        "
      />

      {/* Soft central highlight */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-[48%] top-[20%]
          size-[24rem]
          rounded-full
          bg-white/70
          blur-3xl
        "
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* ======================================================
            SECTION HEADING
        ====================================================== */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.62fr)] lg:items-end lg:gap-10">
          <div>
            <p
              className="
                flex items-center gap-2
                text-xs font-extrabold
                tracking-[0.14em]
                text-[var(--teal-dark)]
                uppercase

                before:block
                before:h-0.5
                before:w-5
                before:rounded-full
                before:bg-[var(--saffron)]
              "
            >
              {labels.eyebrow}
            </p>

            <h2
              className="
                mt-3
                max-w-3xl
                text-3xl
                font-extrabold
                leading-[1.12]
                tracking-[-0.04em]
                text-[var(--primary-ink)]
                sm:text-4xl
                lg:text-[clamp(2.1rem,4vh,2.85rem)]
              "
            >
              {labels.heading}
            </h2>
          </div>

          <p
            className="
              mt-4
              max-w-2xl
              text-base
              leading-7
              text-[var(--muted-text)]
              lg:mt-0
              lg:text-sm
              lg:leading-6
            "
          >
            {labels.subheading}
          </p>
        </div>

        {/* ======================================================
            FEATURED DOCTOR CARD
        ====================================================== */}
        <article
          className="
            relative mt-7 grid
            overflow-hidden
            rounded-lg
            border border-[var(--line)]
            bg-white
            text-[var(--ink)]
            shadow-[0_28px_70px_-42px_var(--teal-dark)]

            md:grid-cols-[minmax(19rem,0.92fr)_minmax(0,1.08fr)]

            lg:mt-6
            lg:grid-cols-[minmax(22rem,0.94fr)_minmax(0,1.06fr)]
            lg:min-h-[32rem]
            lg:max-h-[calc(100dvh-13rem)]
          "
        >
          {/* Premium accent */}
          <div
            aria-hidden="true"
            className="
              absolute inset-x-0 top-0 z-30
              h-[3px]
              bg-[linear-gradient(90deg,var(--saffron),var(--aqua),var(--teal))]
            "
          />

          {/* ====================================================
              IMAGE / GALLERY
          ==================================================== */}
          <div
            className="
              relative
              min-h-[28rem]
              bg-[linear-gradient(145deg,var(--aqua),var(--aqua-soft))]
              p-3

              sm:min-h-[31rem]
              sm:p-4

              md:min-h-full
              lg:p-4
            "
          >
            {/* Doctor badge */}
            <span
              className="
                absolute start-6 top-6 z-20
                inline-flex items-center gap-2
                rounded-full
                border border-white/80
                bg-white/90
                px-3.5 py-2
                text-xs font-extrabold
                text-[var(--teal-dark)]
                shadow-[0_10px_28px_-16px_rgba(7,48,71,0.45)]
                backdrop-blur-xl

                before:size-2
                before:shrink-0
                before:rounded-full
                before:bg-[var(--saffron)]
              "
              data-testid="featured-doctor-badge"
            >
              {getLocalizedText(doctor.title, locale)}
            </span>

            <div
              className="
                relative h-full
                min-h-[26rem]
                overflow-hidden
                rounded-lg
                border border-white
                bg-[var(--aqua)]
                shadow-[0_18px_45px_-24px_var(--teal-dark)]

                sm:min-h-[29rem]
                md:min-h-full
              "
              data-active-image={activeImage}
              data-testid="featured-doctor-gallery"
            >
              {images.map((image, index) => (
                <Image
                  alt={getLocalizedText(image.altText, locale)}
                  aria-hidden={index !== activeImage}
                  className={`
                    object-cover object-top
                    transition-[opacity,transform]
                    duration-500
                    ease-[cubic-bezier(0.65,0,0.35,1)]
                    ${
                      index === activeImage
                        ? "scale-100 opacity-100"
                        : "scale-[1.015] opacity-0"
                    }
                  `}
                  fill
                  key={`${image.url}-${index}`}
                  priority={index === 0}
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 44vw, 38vw"
                  src={image.url}
                />
              ))}

              {/* Bottom image gradient */}
              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute inset-x-0 bottom-0
                  h-32
                  bg-gradient-to-t
                  from-[var(--primary-ink)]/30
                  to-transparent
                "
              />

              {images.length > 1 ? (
                <>
                  {/* Gallery dots */}
                  <div
                    className="
                      absolute start-4 bottom-4 z-20
                      flex items-center
                      rounded-full
                      border border-white/20
                      bg-[var(--primary-ink)]/45
                      px-1
                      shadow-sm
                      backdrop-blur-lg
                    "
                  >
                    {images.map((image, index) => (
                      <button
                        aria-current={
                          index === activeImage ? "true" : undefined
                        }
                        aria-label={`${
                          locale === "ur" ? "تصویر" : "Show image"
                        } ${index + 1}`}
                        className="
                          grid size-9
                          place-items-center
                          rounded-full
                          transition-colors
                          hover:bg-white/10
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-white
                        "
                        key={image.url}
                        onClick={() => setActiveImage(index)}
                        type="button"
                      >
                        <span
                          aria-hidden="true"
                          className={`
                            size-2
                            rounded-full
                            border border-white
                            transition-all
                            duration-300
                            ${
                              index === activeImage
                                ? "scale-110 bg-white"
                                : "bg-white/30"
                            }
                          `}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Pause / resume */}
                  <button
                    aria-pressed={paused}
                    className="
                      absolute end-4 bottom-4 z-20
                      min-h-9
                      rounded-full
                      border border-white/70
                      bg-white/90
                      px-3
                      text-[0.68rem]
                      font-extrabold
                      text-[var(--teal-dark)]
                      shadow-sm
                      backdrop-blur-xl
                      transition-[background-color,transform]
                      duration-200

                      hover:-translate-y-0.5
                      hover:bg-white

                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-white
                    "
                    onClick={() => setPaused((current) => !current)}
                    type="button"
                  >
                    {paused ? labels.resume : labels.pause}
                  </button>
                </>
              ) : null}
            </div>
          </div>

          {/* ====================================================
              DOCTOR CONTENT
          ==================================================== */}
          <div
            className="
              relative flex min-w-0
              flex-col justify-center
              p-6
              pt-20
              text-[var(--ink)]

              sm:p-8
              sm:pt-20

              md:p-7
              md:pt-16

              lg:p-8
              lg:pe-9
              lg:pt-16
            "
            data-testid="featured-doctor-content"
          >
            <Link
              className="absolute right-6 top-6 z-30 inline-flex min-h-10 min-w-[7.5rem] items-center justify-center rounded-lg bg-[var(--teal)] px-4 py-2 text-sm font-extrabold whitespace-nowrap text-white shadow-[0_10px_28px_-14px_rgba(7,48,71,0.5)] transition-[background-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-0.5 hover:bg-[var(--teal-dark)] hover:shadow-[0_14px_32px_-14px_rgba(7,48,71,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aqua)] focus-visible:ring-offset-2"
              href={`/${locale}/dentists/${doctor.id}`}
            >
              {labels.viewProfile}
            </Link>

            {/* Title + name */}
            <div className="min-w-0">
              <p
                className="
                  flex items-center gap-2
                  text-[0.68rem]
                  font-extrabold
                  tracking-[0.12em]
                  text-[var(--teal-dark)]
                  uppercase

                  before:size-2
                  before:shrink-0
                  before:rounded-full
                  before:bg-[var(--saffron)]
                "
              >
                {getLocalizedText(doctor.title, locale)}
              </p>

              <h3
                className="
                  mt-2
                  text-[2rem]
                  font-extrabold
                  leading-[1.08]
                  tracking-[-0.04em]
                  text-[var(--primary-ink)]

                  sm:text-[2.35rem]

                  lg:text-[clamp(2rem,3.3vw,2.65rem)]
                "
              >
                {getLocalizedText(doctor.name, locale)}
              </h3>
            </div>

            {/* Qualification */}
            {getLocalizedText(doctor.qualification, locale) ? (
              <p className="mt-2 text-sm font-extrabold text-[var(--muted-text)]">
                {getLocalizedText(doctor.qualification, locale)}
              </p>
            ) : null}

            {/* Education */}
            {getLocalizedText(doctor.education, locale) ? (
              <p className="mt-1 text-sm leading-5 text-[var(--muted-text)]">
                {getLocalizedText(doctor.education, locale)}
              </p>
            ) : null}

            {/* Registration */}
            {getLocalizedText(doctor.registration, locale) ? (
              <span
                className="
                  mt-3
                  inline-flex w-fit
                  rounded-full
                  border border-[var(--line)]
                  bg-[var(--aqua-soft)]
                  px-3 py-1.5
                  text-xs
                  font-extrabold
                  text-[var(--teal-dark)]
                "
              >
                {getLocalizedText(doctor.registration, locale)}
              </span>
            ) : null}

            {/* Biography */}
            <p
              className="
                mt-4
                max-w-2xl
                border-s-[3px]
                border-[var(--saffron)]
                ps-4
                text-sm
                leading-6
                text-pretty
                text-[var(--muted-text)]

                lg:text-[0.92rem]
                lg:leading-6
              "
            >
              {profileSummary}
            </p>

            {/* Specialty */}
            <dl className="mt-4">
              <div
                className="
                  rounded-xl
                  border border-[var(--line)]
                  bg-[var(--mineral)]
                  px-4 py-3
                "
              >
                <dt
                  className="
                    text-[0.65rem]
                    font-extrabold
                    tracking-[0.12em]
                    text-[var(--teal-dark)]
                    uppercase
                  "
                >
                  {labels.specialty}
                </dt>

                <dd className="mt-1 text-sm font-extrabold leading-5 text-[var(--primary-ink)]">
                  {getLocalizedText(doctor.title, locale)}
                </dd>
              </div>
            </dl>

            {/* Focus areas */}
            <div className="mt-4">
              <p
                className="
                  text-[0.65rem]
                  font-extrabold
                  tracking-[0.12em]
                  text-[var(--teal-dark)]
                  uppercase
                "
              >
                {labels.focus}
              </p>

              <ul className="mt-2 flex flex-wrap gap-1.5">
                {focusAreas.map((focus) => (
                  <li
                    className="
                      inline-flex items-center gap-1.5
                      rounded-full
                      border border-[var(--line)]
                      bg-[var(--aqua-soft)]
                      px-3 py-1.5
                      text-xs
                      font-extrabold
                      text-[var(--ink)]
                    "
                    key={focus}
                  >
                    <svg
                      aria-hidden="true"
                      className="size-3.5 shrink-0 text-[var(--teal-dark)]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="m6 12 4 4 8-8"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.2"
                      />
                    </svg>

                    {focus}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
