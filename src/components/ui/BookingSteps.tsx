"use client";

import type { Locale } from "@/i18n/config";

// ═══════════════════════════════════════════════════════════════
//  BookingStepsSection — Premium Edition
//  Visual timeline showing the appointment booking journey.
//  Supports 3–6 steps. Falls back gracefully if descriptions missing.
// ═══════════════════════════════════════════════════════════════

type StepConfig = {
  title: string;
  description?: string;
  icon: React.ReactNode;
};

type BookingStepsSectionProps = {
  locale: Locale;
  eyebrow: string;
  title: string;
  steps: {
    one: string;
    two: string;
    three: string;
    four?: string;
    five?: string;
    six?: string;
  };
  descriptions?: {
    one?: string;
    two?: string;
    three?: string;
    four?: string;
    five?: string;
    six?: string;
  };
};

export function BookingStepsSection({
  locale,
  eyebrow,
  title,
  steps,
  descriptions,
}: BookingStepsSectionProps) {
  const isRTL = locale === "ur";

  const stepList: StepConfig[] = [
    {
      title: steps.one,
      description: descriptions?.one,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M8 13h2" /><path d="M8 17h2" /><path d="M14 13h2" /><path d="M14 17h2" />
        </svg>
      ),
    },
    {
      title: steps.two,
      description: descriptions?.two,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      title: steps.three,
      description: descriptions?.three,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    ...(steps.four
      ? [
          {
            title: steps.four,
            description: descriptions?.four,
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            ),
          },
        ]
      : []),
    ...(steps.five
      ? [
          {
            title: steps.five,
            description: descriptions?.five,
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ),
          },
        ]
      : []),
    ...(steps.six
      ? [
          {
            title: steps.six,
            description: descriptions?.six,
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            ),
          },
        ]
      : []),
  ];

  return (
    <section className="relative overflow-hidden border-y border-[var(--line)] bg-gradient-to-b from-white via-[var(--mineral)] to-white py-20 sm:py-24 lg:py-28">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-[20%] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--aqua)] opacity-20 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--teal-dark)] shadow-sm backdrop-blur-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            {eyebrow}
          </span>
          <h2 className="mt-5 text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.04em] text-[var(--primary-ink)] text-balance sm:text-[2.5rem] lg:text-[3rem]">
            {title}
          </h2>
        </div>

        {/* Steps grid */}
        <ol
          className="relative mx-auto mt-14 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Connecting line (desktop only) */}
          {stepList.length > 1 && (
            <div
              className="pointer-events-none absolute top-[3.25rem] hidden h-px w-full lg:block"
              aria-hidden="true"
            >
              <div className="mx-auto h-full max-w-4xl bg-gradient-to-r from-transparent via-[var(--line-strong)] to-transparent" />
            </div>
          )}

          {stepList.map((step, index) => (
            <li
              key={step.title}
              className="group relative"
            >
              <div className="relative flex h-full flex-col rounded-lg border border-[var(--line)] bg-white p-6 shadow-[0_1px_3px_rgba(7,48,71,0.04)] transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[0_12px_40px_rgba(7,48,71,0.08)] sm:p-7">
                {/* Step number + icon row */}
                <div className="flex items-start justify-between">
                  {/* Icon container */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--aqua-soft)] text-[var(--teal)] shadow-sm ring-1 ring-[var(--line)]/50 transition-colors duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:bg-[var(--aqua)] group-hover:text-[var(--teal-dark)]">
                    {step.icon}
                  </div>

                  {/* Step number */}
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line-strong)] bg-white text-xs font-extrabold text-[var(--teal-dark)] shadow-sm transition-[background-color,border-color,color] duration-300 group-hover:border-[var(--teal)] group-hover:bg-[var(--teal)] group-hover:text-white">
                    <bdi>{index + 1}</bdi>
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-5 text-lg font-extrabold tracking-[-0.02em] text-[var(--primary-ink)] sm:text-xl">
                  {step.title}
                </h3>

                {/* Description */}
                {step.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted-text)]">
                    {step.description}
                  </p>
                ) : null}

                {/* Bottom accent line */}
                <div className="mt-auto pt-5">
                  <div className="h-0.5 w-20 origin-start scale-x-60 rounded-full bg-[var(--line)] transition-[background-color,transform] duration-300 group-hover:scale-x-100 group-hover:bg-[var(--teal)]" />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
