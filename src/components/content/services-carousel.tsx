"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type TouchEvent,
} from "react";

import { ServiceCard } from "@/components/content/service-card";
import {
  getLocalizedText,
  type DemoService,
} from "@/content/demo-content";
import type { Locale } from "@/i18n/config";

type ServicesCarouselProps = {
  labels: {
    book: string;
    duration: string;
    minutes: string;
    next: string;
    previous: string;
  };

  locale: Locale;

  services: readonly DemoService[];
};

const AUTO_PLAY_DELAY = 4_000;

/*
 * Temporary remote service imagery.
 *
 * These are Pexels placeholder images.
 * Later we should replace them with final approved
 * Shahbaz Dental Clinic / Cloudinary assets.
 */
const serviceImages = {
  whitening:
    "https://images.pexels.com/photos/5622271/pexels-photo-5622271.jpeg?auto=compress&cs=tinysrgb&w=700",

  orthodontics:
    "https://images.pexels.com/photos/6529105/pexels-photo-6529105.jpeg?auto=compress&cs=tinysrgb&w=700",

  treatment:
    "https://images.pexels.com/photos/6529110/pexels-photo-6529110.jpeg?auto=compress&cs=tinysrgb&w=700",

  prosthesis:
    "https://images.pexels.com/photos/6528782/pexels-photo-6528782.jpeg?auto=compress&cs=tinysrgb&w=700",

  general:
    "https://images.pexels.com/photos/6529057/pexels-photo-6529057.jpeg?auto=compress&cs=tinysrgb&w=700",
} as const;

function getServiceImage(service: DemoService) {
  /*
   * Use English title + ID so image selection does not
   * depend on whether current UI is English or Urdu.
   */
  const searchValue = `
    ${service.id}
    ${getLocalizedText(service.name, "en")}
  `.toLowerCase();

  if (
    searchValue.includes("whiten") ||
    searchValue.includes("bleach")
  ) {
    return serviceImages.whitening;
  }

  if (
    searchValue.includes("brace") ||
    searchValue.includes("orthodont") ||
    searchValue.includes("aligner")
  ) {
    return serviceImages.orthodontics;
  }

  if (
    searchValue.includes("implant") ||
    searchValue.includes("denture") ||
    searchValue.includes("crown") ||
    searchValue.includes("bridge") ||
    searchValue.includes("prostho")
  ) {
    return serviceImages.prosthesis;
  }

  if (
    searchValue.includes("root canal") ||
    searchValue.includes("filling") ||
    searchValue.includes("restor") ||
    searchValue.includes("extraction")
  ) {
    return serviceImages.treatment;
  }

  if (
    searchValue.includes("clean") ||
    searchValue.includes("scaling") ||
    searchValue.includes("polish") ||
    searchValue.includes("check") ||
    searchValue.includes("exam")
  ) {
    return serviceImages.general;
  }

  return serviceImages.general;
}

function getCircularOffset(
  index: number,
  activeIndex: number,
  total: number,
) {
  let offset = index - activeIndex;

  if (offset > total / 2) {
    offset -= total;
  }

  if (offset < -total / 2) {
    offset += total;
  }

  return offset;
}

export function ServicesCarousel({
  labels,
  locale,
  services,
}: ServicesCarouselProps) {
  const [activeService, setActiveService] =
    useState(0);

  const [isCardHovered, setIsCardHovered] =
    useState(false);

  const [hasFocusWithin, setHasFocusWithin] =
    useState(false);

  /*
   * Used to restart the autoplay countdown after
   * manual arrows, swipe, or side-card selection.
   */
  const [timerVersion, setTimerVersion] =
    useState(0);

  const touchStartX =
    useRef<number | null>(null);

  const total = services.length;

  function show(
    index: number,
    resetTimer = true,
  ) {
    if (!total) {
      return;
    }

    const normalized =
      (index + total) % total;

    setActiveService(normalized);

    if (resetTimer) {
      setTimerVersion(
        (current) => current + 1,
      );
    }
  }

  function move(direction: number) {
    show(activeService + direction);
  }

  /*
   * Infinite autoplay.
   *
   * Pauses while:
   * - user hovers a service card
   * - keyboard focus is inside a card
   * - reduced-motion preference is enabled
   *
   * There is intentionally NO visible pause button.
   */
  useEffect(() => {
    if (
      total <= 1 ||
      isCardHovered ||
      hasFocusWithin
    ) {
      return;
    }

    const reducedMotion =
      window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      ).matches ?? false;

    if (reducedMotion) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setActiveService((current) => {
          return (current + 1) % total;
        });
      }, AUTO_PLAY_DELAY);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    total,
    isCardHovered,
    hasFocusWithin,
    timerVersion,
  ]);

  if (!total) {
    return null;
  }

  const currentService =
    services[activeService];

  const activeTitle =
    getLocalizedText(
      currentService.name,
      locale,
    );

  function handleTouchStart(
    event: TouchEvent<HTMLDivElement>,
  ) {
    touchStartX.current =
      event.changedTouches[0]
        ?.clientX ?? null;
  }

  function handleTouchEnd(
    event: TouchEvent<HTMLDivElement>,
  ) {
    if (
      touchStartX.current === null
    ) {
      return;
    }

    const endX =
      event.changedTouches[0]
        ?.clientX ??
      touchStartX.current;

    const difference =
      endX -
      touchStartX.current;

    touchStartX.current = null;

    if (
      Math.abs(difference) < 45
    ) {
      return;
    }

    const directionMultiplier =
      locale === "ur"
        ? -1
        : 1;

    if (difference < 0) {
      move(
        1 *
          directionMultiplier,
      );
    } else {
      move(
        -1 *
          directionMultiplier,
      );
    }
  }

  function handleBlur(
    event: FocusEvent<HTMLDivElement>,
  ) {
    const nextFocused =
      event.relatedTarget as Node | null;

    if (
      nextFocused &&
      event.currentTarget.contains(
        nextFocused,
      )
    ) {
      return;
    }

    setHasFocusWithin(false);
  }

  return (
    <div
      className="relative"
      data-active-service={
        activeService
      }
      data-testid="services-carousel"
    >
      {/* Active service heading */}
      <div
        className="
          mb-1
          grid
          items-center
          gap-5
          border-b
          border-[var(--line)]
          pb-5

          sm:grid-cols-[1fr_auto_1fr]
        "
      >
        <div
          aria-hidden="true"
          className="hidden sm:block"
        />

        <div className="min-w-0 text-center">
          <span
            aria-hidden="true"
            className="
              mx-auto
              mb-3
              block
              h-1
              w-10
              rounded-full
              bg-[var(--teal)]
            "
          />

          <h3
            key={`${activeService}-${activeTitle}`}
            className="
              animate-[service-title-in_450ms_cubic-bezier(0.22,1,0.36,1)]

              text-2xl
              leading-tight
              font-extrabold
              tracking-[-0.03em]
              text-[var(--ink)]

              sm:text-3xl
            "
          >
            <bdi>
              {activeTitle}
            </bdi>
          </h3>
        </div>

        {/* Manual navigation */}
        {total > 1 ? (
          <div
            className="
              flex
              items-center
              justify-center
              gap-2

              sm:justify-self-end
            "
          >
            <button
              aria-label={
                labels.previous
              }
              className="
                grid
                size-11
                place-items-center
                rounded-lg

                border
                border-[var(--line-strong)]

                bg-white

                text-lg
                font-bold
                text-[var(--ink)]

                shadow-sm

                transition-[background-color,border-color,color,box-shadow,transform]
                duration-300
                ease-out

                hover:-translate-y-px
                hover:border-[var(--teal)]
                hover:bg-[var(--aqua-soft)]
                hover:text-[var(--teal-dark)]
                hover:shadow-md

                active:translate-y-0

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--teal)]
                focus-visible:ring-offset-2
              "
              onClick={() =>
                move(-1)
              }
              type="button"
            >
              <span aria-hidden="true">
                {locale === "ur"
                  ? "→"
                  : "←"}
              </span>
            </button>

            <button
              aria-label={labels.next}
              className="
                grid
                size-11
                place-items-center
                rounded-lg

                border
                border-transparent

                bg-[var(--teal)]

                text-lg
                font-bold
                text-white

                shadow-[0_5px_16px_color-mix(in_srgb,var(--teal)_28%,transparent)]

                transition-[background-color,box-shadow,transform]
                duration-300
                ease-out

                hover:-translate-y-px
                hover:bg-[var(--teal-dark)]
                hover:shadow-[0_9px_26px_color-mix(in_srgb,var(--teal)_38%,transparent)]

                active:translate-y-0

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--teal)]
                focus-visible:ring-offset-2
              "
              onClick={() =>
                move(1)
              }
              type="button"
            >
              <span aria-hidden="true">
                {locale === "ur"
                  ? "←"
                  : "→"}
              </span>
            </button>
          </div>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>

      {/* Stacked carousel stage */}
      <div
        className="
          relative

          h-[35rem]

          touch-pan-y
          overflow-hidden

          sm:h-[36rem]
          lg:h-[37rem]
        "
        onTouchEnd={
          handleTouchEnd
        }
        onTouchStart={
          handleTouchStart
        }
      >
        {services.map(
          (service, index) => {
            const rawOffset =
              getCircularOffset(
                index,
                activeService,
                total,
              );

            /*
             * Mirror physical placement
             * for RTL.
             */
            const offset =
              locale === "ur"
                ? rawOffset * -1
                : rawOffset;

            const distance =
              Math.abs(
                rawOffset,
              );

            const isActive =
              distance === 0;

            /*
             * Mobile + tablet:
             * active + immediate neighbors.
             *
             * XL:
             * active + two cards each side.
             */
            const visibilityClass =
              distance === 0
                ? "block"
                : distance === 1
                  ? "block"
                  : distance === 2
                    ? "hidden xl:block"
                    : "hidden";

            /*
             * 82% gives the overlapping
             * layered look from your
             * reference image.
             */
            const xPercent =
              -50 +
              offset * 82;

            /*
             * Center card sits higher.
             * Side cards are slightly
             * underneath it.
             */
            const yPosition =
              distance === 0
                ? 2
                : distance === 1
                  ? 34
                  : 58;

            const scale =
              distance === 0
                ? 1.035
                : distance === 1
                  ? 0.98
                  : 0.92;

            const opacity =
              distance === 0
                ? 1
                : distance === 1
                  ? 0.95
                  : 0.78;

            const zIndex =
              distance === 0
                ? 50
                : distance === 1
                  ? 40
                  : 30;

            const style = {
              transform: `
                translate3d(
                  ${xPercent}%,
                  ${yPosition}px,
                  0
                )
                scale(${scale})
              `,

              opacity,
              zIndex,
            } as CSSProperties;

            return (
              <div
                aria-current={
                  isActive
                    ? "true"
                    : undefined
                }
                className={`
                  absolute

                  left-1/2
                  top-5

                  w-[clamp(300px,28vw,360px)]

                  transform-gpu

                  transition-[transform,opacity,filter]
                  duration-700

                  ease-[cubic-bezier(0.22,1,0.36,1)]

                  will-change-transform

                  motion-reduce:transition-none

                  ${visibilityClass}

                  ${
                    isActive
                      ? `
                        pointer-events-auto
                        saturate-100
                      `
                      : `
                        cursor-pointer
                        saturate-[0.9]
                      `
                  }
                `}
                key={service.id}
                onBlurCapture={
                  handleBlur
                }
                onClickCapture={(
                  event,
                ) => {
                  if (
                    isActive
                  ) {
                    return;
                  }

                  event.preventDefault();
                  event.stopPropagation();

                  show(index);
                }}
                onFocusCapture={() =>
                  setHasFocusWithin(
                    true,
                  )
                }
                onMouseEnter={() =>
                  setIsCardHovered(
                    true,
                  )
                }
                onMouseLeave={() =>
                  setIsCardHovered(
                    false,
                  )
                }
                style={style}
              >
                <ServiceCard
                  active={
                    isActive
                  }
                  imageSrc={getServiceImage(
                    service,
                  )}
                  labels={{
                    book:
                      labels.book,
                    duration:
                      labels.duration,
                    minutes:
                      labels.minutes,
                  }}
                  locale={
                    locale
                  }
                  service={
                    service
                  }
                />
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}
