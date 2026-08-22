"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useEffect, useState, type KeyboardEvent } from "react";
import { useEmblaSelection } from "@/components/ui/use-embla-selection";
import type { Locale } from "@/i18n/config";
import type {
  TestimonialLocalizedText,
  TestimonialRecord,
} from "@/modules/testimonials/testimonial.types";

type TestimonialsSectionProps = {
  locale: Locale;
  testimonials: readonly TestimonialRecord[];
  labels: {
    eyebrow: string;
    heading: string;
    description: string;
    pointOne: string;
    pointTwo: string;
    pointThree: string;
    book: string;
    previous: string;
    next: string;
    pause: string;
    resume: string;
  };
};

function localize(value: TestimonialLocalizedText, locale: Locale) {
  return locale === "ur" ? value.ur : value.en;
}

function CheckIcon() {
  return (
    <span
      aria-hidden="true"
      className="grid size-6 shrink-0 place-items-center rounded-full bg-white text-[var(--teal-dark)] shadow-sm ring-1 ring-[var(--line)]"
    >
      <svg className="size-3.5" fill="none" viewBox="0 0 24 24">
        <path
          d="m7 12 3.2 3.2L17.5 8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.4"
        />
      </svg>
    </span>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d={direction === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ReviewCard({
  locale,
  testimonial,
}: {
  locale: Locale;
  testimonial: TestimonialRecord;
}) {
  const patientName = localize(testimonial.name, locale);
  const reviewDate = new Intl.DateTimeFormat(
    locale === "ur" ? "ur-PK" : "en-PK",
    { dateStyle: "medium", timeZone: "Asia/Karachi" },
  ).format(new Date(`${testimonial.dateKey}T00:00:00+05:00`));

  return (
    <article className="group flex h-full min-h-[27rem] flex-col rounded-lg border border-white bg-white p-6 shadow-[0_22px_55px_-38px_rgba(7,48,71,0.52)] transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[0_28px_65px_-38px_rgba(7,48,71,0.62)] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-11 place-items-center rounded-lg bg-[var(--aqua-soft)] text-[var(--teal-dark)] ring-1 ring-[var(--line)]">
          <svg aria-hidden="true" className="size-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.2 6C4.8 7.8 3.5 10 3.5 12.7c0 3 1.6 5.3 4.3 5.3 2 0 3.5-1.5 3.5-3.5 0-1.9-1.4-3.3-3.3-3.3-.4 0-.8 0-1.2.2.3-1.6 1.4-3 3.2-4.3L7.2 6Zm9.2 0c-2.4 1.8-3.7 4-3.7 6.7 0 3 1.6 5.3 4.3 5.3 2 0 3.5-1.5 3.5-3.5 0-1.9-1.4-3.3-3.3-3.3-.4 0-.8 0-1.2.2.3-1.6 1.4-3 3.2-4.3L16.4 6Z" />
          </svg>
        </span>
        <div aria-label="5 out of 5 stars" className="flex gap-0.5 text-[var(--saffron)]">
          {Array.from({ length: 5 }).map((_, index) => (
            <svg aria-hidden="true" className="size-4" fill="currentColor" key={index} viewBox="0 0 24 24">
              <path d="m12 2.8 2.75 5.57 6.15.9-4.45 4.33 1.05 6.12L12 16.83l-5.5 2.89 1.05-6.12L3.1 9.27l6.15-.9L12 2.8Z" />
            </svg>
          ))}
        </div>
      </div>

      <p className="mt-6 inline-flex w-fit rounded-full bg-[var(--aqua-soft)] px-3 py-1.5 text-xs font-extrabold text-[var(--teal-dark)] ring-1 ring-[var(--line)]">
        {localize(testimonial.treatment, locale)}
      </p>
      <p className="mt-5 flex-1 text-[0.98rem] leading-7 text-[var(--muted-text)]">
        {localize(testimonial.review, locale)}
      </p>

      <div className="mt-7 flex items-center gap-3 border-t border-[var(--line)] pt-5">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-white bg-[var(--aqua-soft)] shadow-[0_8px_22px_-14px_rgba(7,48,71,0.7)] ring-1 ring-[var(--line)]">
          <Image
            alt={patientName}
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-105"
            fill
            sizes="56px"
            src={testimonial.image ?? "/images/testimonials/default-avatar.svg"}
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-extrabold text-[var(--primary-ink)]">
            {patientName}
          </h3>
          <p className="mt-1 text-xs font-bold text-[var(--saffron)]">
            <bdi>{reviewDate}</bdi>
          </p>
        </div>
      </div>
    </article>
  );
}

export function TestimonialsSection({
  locale,
  labels,
  testimonials,
}: TestimonialsSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 3_000,
      playOnInit: testimonials.length > 1,
      stopOnFocusIn: true,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    }),
  );
  const [viewportRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      containScroll: "trimSnaps",
      direction: locale === "ur" ? "rtl" : "ltr",
      duration: 30,
      loop: testimonials.length > 1,
      slidesToScroll: 1,
    },
    [autoplay],
  );
  const { scrollSnaps, selectedIndex } = useEmblaSelection(emblaApi);

  useEffect(() => {
    if (!emblaApi) return;

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (
      testimonials.length <= 1 ||
      isHovered ||
      prefersReducedMotion
    ) {
      autoplay.stop();
      return;
    }

    autoplay.play();
  }, [autoplay, emblaApi, isHovered, testimonials.length]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const moveForward =
      locale === "ur" ? event.key === "ArrowLeft" : event.key === "ArrowRight";
    if (moveForward) emblaApi?.scrollNext();
    else emblaApi?.scrollPrev();
  }

  if (testimonials.length === 0) return null;

  return (
    <section
      className="relative isolate overflow-hidden bg-[var(--aqua-light)] py-20 text-[var(--ink)] sm:py-24 lg:py-28"
      data-testid="testimonials-section"
      id="testimonials"
    >
      <div aria-hidden="true" className="pointer-events-none absolute -start-48 top-10 size-[30rem] rounded-full bg-white/80 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -end-48 bottom-[-12rem] size-[34rem] rounded-full bg-[var(--teal)]/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--line-strong)] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <p className="inline-flex items-center gap-2 text-xs font-extrabold tracking-[0.14em] text-[var(--teal-dark)] uppercase before:block before:h-0.5 before:w-5 before:rounded-full before:bg-[var(--teal)]">
            {labels.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[18ch] text-4xl leading-[1.08] font-extrabold tracking-[-0.045em] text-[var(--primary-ink)] sm:text-5xl lg:text-[clamp(3rem,4.5vw,4rem)]">
            {labels.heading}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-text)] sm:text-[1.05rem]">
            {labels.description}
          </p>
          <ul className="mt-7 flex w-full max-w-4xl flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-x-7">
            {[labels.pointOne, labels.pointTwo, labels.pointThree].map((point) => (
              <li className="flex items-center gap-2.5 text-sm leading-6 font-bold text-[var(--ink)]" key={point}>
                <CheckIcon />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {/* remove book button from here */}
          {/* <Link
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-[var(--teal-dark)] px-6 text-sm font-extrabold text-white shadow-[0_14px_32px_-18px_rgba(7,48,71,0.7)] transition-[background-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-0.5 hover:bg-[var(--teal)] hover:shadow-[0_18px_38px_-18px_rgba(7,48,71,0.75)]"
            href={`/${locale}/book`}
          >
            {labels.book}
          </Link> */}
        </div>

        <div
          aria-label={labels.heading}
          aria-roledescription="carousel"
          className="relative mt-12 sm:mt-14 lg:mt-16"
          data-active-testimonial={selectedIndex}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role="region"
          tabIndex={0}
        >
          <div className="overflow-hidden py-2" ref={viewportRef}>
            <div className="-ms-5 flex touch-pan-y">
              {testimonials.map((testimonial, index) => (
                <div
                  aria-label={`${index + 1} / ${testimonials.length}`}
                  aria-roledescription="slide"
                  className="min-w-0 flex-[0_0_100%] ps-5 md:flex-[0_0_50%] xl:flex-[0_0_33.333333%]"
                  data-embla-slide
                  key={testimonial.id}
                  role="group"
                >
                  <ReviewCard locale={locale} testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          {testimonials.length > 1 ? (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                aria-label={labels.previous}
                className="grid size-11 place-items-center rounded-full border border-[var(--line-strong)] bg-white text-[var(--teal-dark)] shadow-sm transition-[background-color,border-color,transform] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-0.5 hover:border-[var(--teal)] hover:bg-[var(--aqua-soft)]"
                onClick={() => emblaApi?.scrollPrev()}
                type="button"
              >
                <ArrowIcon direction={locale === "ur" ? "right" : "left"} />
              </button>

              <div className="flex items-center" role="group">
                {scrollSnaps.map((_, index) => (
                  <button
                    aria-label={`${labels.next} ${index + 1}`}
                    className="grid size-9 place-items-center rounded-full"
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    type="button"
                  >
                    <span
                      aria-hidden="true"
                      className={`h-2 rounded-full transition-[width,background-color] duration-300 ${index === selectedIndex ? "w-6 bg-[var(--teal-dark)]" : "w-2 bg-[var(--line-strong)]"}`}
                    />
                  </button>
                ))}
              </div>

              <button
                aria-label={labels.next}
                className="grid size-11 place-items-center rounded-full bg-[var(--teal)] text-white shadow-[0_8px_24px_-12px_rgba(32,147,224,0.75)] transition-[background-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-0.5 hover:bg-[var(--teal-dark)]"
                onClick={() => emblaApi?.scrollNext()}
                type="button"
              >
                <ArrowIcon direction={locale === "ur" ? "left" : "right"} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
