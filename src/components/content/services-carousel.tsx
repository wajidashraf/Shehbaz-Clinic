"use client";

import { useEffect, useRef, useState } from "react";
import { ServiceCard } from "@/components/content/service-card";
import type { DemoService } from "@/content/demo-content";
import type { Locale } from "@/i18n/config";

type ServicesCarouselProps = {
  labels: {
    book: string;
    duration: string;
    minutes: string;
    next: string;
    pause: string;
    previous: string;
    resume: string;
  };
  locale: Locale;
  services: readonly DemoService[];
};

export function ServicesCarousel({
  labels,
  locale,
  services,
}: ServicesCarouselProps) {
  const [activeService, setActiveService] = useState(0);
  const [paused, setPaused] = useState(false);
  const [timerVersion, setTimerVersion] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  function scrollToCard(index: number) {
    const container = track.current;
    const card = container?.children.item(index) as HTMLElement | null;
    if (container && card) {
      container.scrollTo?.({ left: card.offsetLeft, behavior: "smooth" });
    }
  }

  function show(index: number) {
    const normalized = (index + services.length) % services.length;
    setActiveService(normalized);
    scrollToCard(normalized);
  }

  function move(direction: number) {
    show(activeService + direction);
    setTimerVersion((version) => version + 1);
  }

  useEffect(() => {
    if (
      services.length <= 1 ||
      paused ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const interval = window.setInterval(() => {
      setActiveService((current) => {
        const next = (current + 1) % services.length;
        scrollToCard(next);
        return next;
      });
    }, 5_000);
    return () => window.clearInterval(interval);
  }, [paused, services.length, timerVersion]);

  if (services.length === 0) return null;

  return (
    <div data-active-service={activeService} data-testid="services-carousel">
      <div
        className="grid snap-x snap-mandatory auto-cols-[calc(100%-1rem)] grid-flow-col gap-5 overflow-x-auto overscroll-x-contain pb-5 sm:auto-cols-[calc(50%-0.625rem)] xl:auto-cols-[calc(33.333%-0.85rem)]"
        ref={track}
      >
        {services.map((service) => (
          <div className="snap-start" key={service.id}>
            <ServiceCard labels={labels} locale={locale} service={service} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="hidden gap-2 sm:flex" aria-hidden="true">
          {services.map((service, index) => (
            <span
              className={`h-2 rounded-full transition-[width,background-color] ${
                index === activeService
                  ? "w-7 bg-[var(--teal)]"
                  : "w-2 bg-[var(--line-strong)]"
              }`}
              key={service.id}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            aria-label={labels.previous}
            className="grid size-11 place-items-center rounded-full border border-[var(--line-strong)] bg-white text-xl font-bold transition-colors hover:bg-[var(--aqua-soft)]"
            onClick={() => move(-1)}
            type="button"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            aria-label={labels.next}
            className="grid size-11 place-items-center rounded-full bg-[var(--teal)] text-xl font-bold text-white transition-colors hover:bg-[var(--teal-dark)]"
            onClick={() => move(1)}
            type="button"
          >
            <span aria-hidden="true">→</span>
          </button>
          {services.length > 1 ? (
            <button
              aria-pressed={paused}
              className="min-h-11 rounded-full border border-[var(--line-strong)] bg-white px-4 text-sm font-extrabold transition-colors hover:bg-[var(--aqua-soft)]"
              onClick={() => setPaused((current) => !current)}
              type="button"
            >
              {paused ? labels.resume : labels.pause}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
