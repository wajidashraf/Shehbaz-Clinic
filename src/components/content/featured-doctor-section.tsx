"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button-link";
import { getLocalizedText } from "@/content/demo-content";
import type { Locale } from "@/i18n/config";
import type { DoctorRecord } from "@/modules/doctors/doctor.types";

type FeaturedDoctorSectionProps = {
  doctor: DoctorRecord;
  labels: {
    book: string;
    eyebrow: string;
    heading: string;
    pause: string;
    resume: string;
    subheading: string;
    workingHours: string;
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

  useEffect(() => {
    if (
      images.length <= 1 ||
      paused ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length);
    }, 4_000);
    return () => window.clearInterval(interval);
  }, [images.length, paused]);

  return (
    <section className="content-auto bg-[var(--aqua-soft)] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <p className="flex items-center gap-2 text-xs font-extrabold tracking-[0.14em] text-[var(--teal-dark)] uppercase before:block before:h-0.5 before:w-4 before:bg-[var(--saffron)]">
          {labels.eyebrow}
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-[-0.04em] text-[var(--teal-dark)] sm:text-4xl">
          {labels.heading}
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-[var(--muted-text)]">
          {labels.subheading}
        </p>

        <article className="mt-9 grid overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white shadow-[0_24px_70px_-42px_rgba(12,77,67,0.42)] lg:grid-cols-[21rem_1fr]">
          <div className="relative min-h-80 bg-[var(--teal)] p-5 sm:min-h-[28rem] sm:p-6">
            <span className="absolute start-8 top-8 z-20 rounded-full bg-[var(--saffron)] px-3 py-1.5 text-xs font-extrabold text-white">
              {getLocalizedText(doctor.title, locale)}
            </span>
            <div
              className="relative h-full min-h-72 overflow-hidden rounded-2xl bg-[var(--aqua)] sm:min-h-[25rem]"
              data-active-image={activeImage}
              data-testid="featured-doctor-gallery"
            >
              {images.map((image, index) => (
                <Image
                  alt={getLocalizedText(image.altText, locale)}
                  aria-hidden={index !== activeImage}
                  className={`object-cover transition-opacity duration-700 ${
                    index === activeImage ? "opacity-100" : "opacity-0"
                  }`}
                  fill
                  key={`${image.url}-${index}`}
                  priority={index === 0}
                  sizes="(max-width: 1023px) 100vw, 336px"
                  src={image.url}
                />
              ))}
              {images.length > 1 ? (
                <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2">
                  {images.map((image, index) => (
                    <button
                      aria-current={index === activeImage ? "true" : undefined}
                      aria-label={`${locale === "ur" ? "تصویر" : "Show image"} ${index + 1}`}
                      className="grid size-11 place-items-center rounded-full"
                      key={image.url}
                      onClick={() => setActiveImage(index)}
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className={`size-2.5 rounded-full border border-white transition-colors ${
                          index === activeImage ? "bg-white" : "bg-white/35"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-10">
            <p className="text-xs font-extrabold tracking-[0.1em] text-[var(--teal-dark)] uppercase">
              {getLocalizedText(doctor.title, locale)}
            </p>
            <h3 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
              {getLocalizedText(doctor.name, locale)}
            </h3>
            {getLocalizedText(doctor.qualification, locale) ? (
              <p className="mt-2 font-extrabold text-[var(--muted-text)]">
                {getLocalizedText(doctor.qualification, locale)}
              </p>
            ) : null}
            {getLocalizedText(doctor.education, locale) ? (
              <p className="mt-1 text-sm leading-6 text-[var(--muted-text)]">
                {getLocalizedText(doctor.education, locale)}
              </p>
            ) : null}
            {getLocalizedText(doctor.registration, locale) ? (
              <span className="mt-4 inline-flex w-fit rounded-full border border-[var(--line)] bg-[var(--aqua-soft)] px-3 py-1.5 text-xs font-extrabold text-[var(--teal-dark)]">
                {getLocalizedText(doctor.registration, locale)}
              </span>
            ) : null}
            <p className="mt-5 leading-7 text-[var(--muted-text)]">
              {getLocalizedText(doctor.biography, locale)}
            </p>
            <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {doctor.focusAreas.map((focus) => (
                <li className="flex gap-3 text-sm font-bold" key={focus.en}>
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--saffron)]" />
                  {getLocalizedText(focus, locale)}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-[var(--line)] pt-6">
              {getLocalizedText(doctor.workingDays, locale) ? (
                <p className="text-sm text-[var(--muted-text)]">
                  <strong className="block text-[var(--ink)]">
                    {labels.workingHours}
                  </strong>
                  {getLocalizedText(doctor.workingDays, locale)}
                </p>
              ) : null}
              <ButtonLink href={`/${locale}/book?dentist=${doctor.id}`}>
                {labels.book}
              </ButtonLink>
              {images.length > 1 ? (
                <button
                  aria-pressed={paused}
                  className="min-h-11 rounded-full border border-[var(--line-strong)] px-4 text-sm font-extrabold text-[var(--teal-dark)]"
                  onClick={() => setPaused((current) => !current)}
                  type="button"
                >
                  {paused ? labels.resume : labels.pause}
                </button>
              ) : null}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
