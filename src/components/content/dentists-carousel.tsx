"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState, type KeyboardEvent } from "react";
import { DentistCard } from "@/components/content/dentist-card";
import { useEmblaSelection } from "@/components/ui/use-embla-selection";
import type { Locale } from "@/i18n/config";
import type { DoctorRecord } from "@/modules/doctors/doctor.types";

type DentistsCarouselProps = {
  dentists: readonly DoctorRecord[];
  labels: {
    carousel: string;
    demoBadge: string;
    next: string;
    previous: string;
    viewProfile: string;
  };
  locale: Locale;
};

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

export function DentistsCarousel({
  dentists,
  labels,
  locale,
}: DentistsCarouselProps) {
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 5_000,
      playOnInit: dentists.length > 1,
      stopOnFocusIn: true,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );
  const [viewportRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      direction: locale === "ur" ? "rtl" : "ltr",
      duration: 30,
      loop: dentists.length > 1,
      slidesToScroll: 1,
    },
    [autoplay],
  );
  const { scrollSnaps, selectedIndex } = useEmblaSelection(emblaApi);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      autoplay.stop();
    }
  }, [autoplay]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const moveForward =
      locale === "ur" ? event.key === "ArrowLeft" : event.key === "ArrowRight";
    if (moveForward) emblaApi?.scrollNext();
    else emblaApi?.scrollPrev();
  }

  if (dentists.length === 0) return null;

  return (
    <div
      aria-label={labels.carousel}
      aria-roledescription="carousel"
      className="relative"
      data-active-dentist={selectedIndex}
      onKeyDown={handleKeyDown}
      role="region"
      tabIndex={0}
    >
      <div className="mx-auto max-w-5xl overflow-hidden py-2" ref={viewportRef}>
        <div className="-ms-4 flex touch-pan-y">
          {dentists.map((dentist, index) => (
            <div
              aria-label={`${index + 1} / ${dentists.length}`}
              aria-roledescription="slide"
              className="min-w-0 flex-[0_0_100%] ps-4"
              data-embla-slide
              key={dentist.id}
              role="group"
            >
              <DentistCard dentist={dentist} labels={labels} locale={locale} />
            </div>
          ))}
        </div>
      </div>

      {dentists.length > 1 ? (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            aria-label={labels.previous}
            className="grid size-12 place-items-center rounded-full border border-[var(--line-strong)] bg-white text-[var(--teal-dark)] shadow-sm transition-[background-color,border-color,color,transform] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-0.5 hover:border-[var(--teal)] hover:bg-[var(--aqua-soft)]"
            onClick={() => emblaApi?.scrollPrev()}
            type="button"
          >
            <ArrowIcon direction={locale === "ur" ? "right" : "left"} />
          </button>

          <div className="flex items-center" role="group">
            {scrollSnaps.map((_, index) => (
              <button
                aria-label={`${labels.carousel}: ${index + 1}`}
                className="grid size-10 place-items-center rounded-full"
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={`h-2.5 rounded-full transition-[width,background-color] duration-300 ${index === selectedIndex ? "w-7 bg-[var(--teal)]" : "w-2.5 bg-[var(--line-strong)]"}`}
                />
              </button>
            ))}
          </div>

          <button
            aria-label={labels.next}
            className="grid size-12 place-items-center rounded-full bg-[var(--teal)] text-white shadow-[0_8px_24px_-12px_rgba(32,147,224,0.75)] transition-[background-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-0.5 hover:bg-[var(--teal-dark)] hover:shadow-[0_12px_28px_-12px_rgba(32,147,224,0.8)]"
            onClick={() => emblaApi?.scrollNext()}
            type="button"
          >
            <ArrowIcon direction={locale === "ur" ? "left" : "right"} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
