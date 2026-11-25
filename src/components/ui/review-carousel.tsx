"use client";

import { useEffect, useState, type ReactNode } from "react";

export function ReviewCarousel({
  children,
  label,
  locale,
}: {
  children: ReactNode[];
  label: string;
  locale: "en" | "ur";
}) {
  const [index, setIndex] = useState(0);
  const [moving, setMoving] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;

    function updateTimer() {
      clearInterval(timer);
      if (!paused && !preference.matches && children.length > 2) {
        timer = setInterval(() => {
          if (!document.hidden) setMoving(true);
        }, 6_000);
      }
    }

    updateTimer();
    preference.addEventListener("change", updateTimer);
    return () => {
      clearInterval(timer);
      preference.removeEventListener("change", updateTimer);
    };
  }, [children.length, paused]);

  // A third card enters as the first card leaves the clipped viewport.
  const count = Math.min(3, children.length);

  return (
    <div
      aria-label={label}
      aria-roledescription="carousel"
      className="review-carousel overflow-hidden rounded-2xl"
      dir={locale === "ur" ? "rtl" : "ltr"}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement))
          setPaused(false);
      }}
      role="region"
      tabIndex={0}
    >
      <div
        className={`review-carousel-track ${moving ? "review-carousel-moving" : ""}`}
        onTransitionEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.propertyName === "transform"
          ) {
            setIndex((current) => (current + 1) % children.length);
            setMoving(false);
          }
        }}
      >
        {Array.from({ length: count }, (_, offset) => {
          const position = (index + offset) % children.length;
          return (
            <div
              aria-hidden={offset > 1 || undefined}
              className="review-carousel-card"
              key={position}
            >
              {children[position]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
