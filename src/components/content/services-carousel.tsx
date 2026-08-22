"use client";

import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type TouchEvent,
} from "react";
import { ServiceCard } from "@/components/content/service-card";
import { getLocalizedText, type DemoService } from "@/content/demo-content";
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

export function ServicesCarousel({
  labels,
  locale,
  services,
}: ServicesCarouselProps) {
  const [activeService, setActiveService] = useState(0);
  const [paused, setPaused] = useState(false);
  const [timerVersion, setTimerVersion] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const total = services.length;

  function show(index: number) {
    if (!total) return;
    setActiveService((index + total) % total);
    setTimerVersion((value) => value + 1);
  }

  useEffect(() => {
    if (total <= 1 || paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(
      () => setActiveService((current) => (current + 1) % total),
      AUTO_PLAY_DELAY,
    );
    return () => window.clearInterval(interval);
  }, [paused, timerVersion, total]);

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) return;
    setPaused(false);
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const difference = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(difference) < 45) return;
    const rtlMultiplier = locale === "ur" ? -1 : 1;
    show(activeService + (difference < 0 ? 1 : -1) * rtlMultiplier);
  }

  if (!total) return null;
  return (
    <div
      className="relative"
      data-active-service={activeService}
      data-testid="services-carousel"
      onBlurCapture={handleBlur}
      onFocusCapture={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      <div className="grid touch-pan-y items-center overflow-hidden px-1 py-5 sm:px-3 lg:overflow-visible">
        {services.map((service, index) => {
          const forwardDistance = (index - activeService + total) % total;
          const position =
            forwardDistance === 0
              ? "active"
              : forwardDistance === 1
                ? "next"
                : forwardDistance === total - 1
                  ? "previous"
                  : "hidden";
          const active = position === "active";
          const visible = position !== "hidden";
          const previousClass =
            locale === "ur"
              ? "translate-x-[72%] lg:translate-x-[85%]"
              : "-translate-x-[72%] lg:-translate-x-[85%]";
          const nextClass =
            locale === "ur"
              ? "-translate-x-[72%] lg:-translate-x-[85%]"
              : "translate-x-[72%] lg:translate-x-[85%]";
          const hiddenDirection =
            forwardDistance <= total / 2 ? nextClass : previousClass;
          const positionClass = active
            ? "translate-x-0 scale-100"
            : position === "hidden"
              ? `${hiddenDirection} scale-[0.8]`
              : `${position === "previous" ? previousClass : nextClass} scale-[0.9]`;

          return (
            <div
              className={`relative col-start-1 row-start-1 mx-auto w-[82%] transform-gpu transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] will-change-[transform,opacity,filter] motion-reduce:transition-none sm:w-[58%] lg:w-[34%] ${positionClass} ${active ? "z-20 opacity-100 blur-none" : visible ? "z-10 opacity-70 blur-[1px]" : "invisible z-0 opacity-0 blur-[1px]"}`}
              data-carousel-card={visible ? "" : undefined}
              data-position={position}
              data-service-id={service.id}
              key={service.id}
            >
              <ServiceCard
                active={active}
                preview={!active}
                href={`/${locale}/services#${service.id}`}
                labels={labels}
                locale={locale}
                service={service}
              />
              {visible && !active ? (
                <button
                  aria-label={`${position === "previous" ? labels.previous : labels.next}: ${getLocalizedText(service.name, locale)}`}
                  className="absolute inset-0 z-10 rounded-lg focus-visible:outline-offset-[-4px]"
                  onClick={() => show(index)}
                  type="button"
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {total > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            aria-label={labels.previous}
            className="grid size-12 place-items-center rounded-full border border-[var(--line-strong)] bg-white text-[var(--teal-dark)] shadow-sm transition-colors duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] hover:bg-[var(--aqua-soft)]"
            onClick={() => show(activeService - 1)}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d={locale === "ur" ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
          <p
            className="min-w-16 text-center text-xs font-extrabold text-[var(--muted-text)]"
            aria-live="polite"
          >
            <bdi>{activeService + 1}</bdi> / <bdi>{total}</bdi>
          </p>
          <button
            aria-label={labels.next}
            className="grid size-12 place-items-center rounded-full bg-[var(--teal)] text-white shadow-[0_8px_24px_-12px_rgba(32,147,224,0.75)] transition-colors duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] hover:bg-[var(--teal-dark)]"
            onClick={() => show(activeService + 1)}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d={locale === "ur" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
