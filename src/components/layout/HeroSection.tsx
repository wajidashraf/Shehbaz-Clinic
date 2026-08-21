import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";

// ═══════════════════════════════════════════════════════════════
//  Premium Hero Section — Dental Clinic
//  Supports: English + Urdu (RTL) | Responsive | Viewport-fit
// ═══════════════════════════════════════════════════════════════

interface HeroSectionProps {
  locale: "en" | "ur";
  home: (key: string) => string;
}

export function HeroSection({ locale, home }: HeroSectionProps) {
  const isRTL = locale === "ur";

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-gradient-to-b
        from-[var(--mineral)]
        via-white
        to-[var(--mineral)]
      "
      aria-label={home("title")}
    >
      {/* ── Ambient background glows ───────────────────────── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Top-left teal glow */}
        <div
          className="
            absolute
            -top-[20%]
            -start-[10%]
            h-[600px]
            w-[600px]
            rounded-full
            bg-[var(--aqua)]
            opacity-40
            blur-[120px]
            sm:h-[700px]
            sm:w-[700px]
          "
        />
        {/* Bottom-right subtle glow */}
        <div
          className="
            absolute
            -bottom-[10%]
            -end-[5%]
            h-[400px]
            w-[400px]
            rounded-full
            bg-[var(--aqua-soft)]
            opacity-60
            blur-[100px]
            sm:h-[500px]
            sm:w-[500px]
          "
        />
        {/* Fine grain texture overlay for premium feel */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ── Main content grid ──────────────────────────────── */}
      <div
        className="
          relative
          z-10
          mx-auto
          grid
          max-w-7xl
          min-h-[calc(100dvh-4rem)]
          items-center
          gap-10
          px-5
          py-10
          sm:px-6
          sm:py-14
          lg:grid-cols-[0.9fr_1.1fr]
          lg:gap-16
          lg:px-8
          lg:py-0
        "
      >
        {/* ── Left column: copy ───────────────────────────── */}
        <div className="flex flex-col justify-center">
          {/* Eyebrow badge */}
          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2.5
              rounded-full
              border
              border-[var(--line)]
              bg-white/80
              px-4
              py-2
              text-xs
              font-extrabold
              uppercase
              tracking-[0.12em]
              text-[var(--teal-dark)]
              shadow-sm
              backdrop-blur-sm
            "
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--teal)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--teal)]" />
            </span>
            {home("eyebrow")}
          </div>

          {/* Headline */}
          <h1
            className="
              mt-6
              max-w-3xl
              text-[2.5rem]
              font-extrabold
              leading-[1.05]
              tracking-[-0.055em]
              text-balance
              text-[var(--primary-ink)]
              sm:text-[3.5rem]
              lg:text-[4rem]
              xl:text-[4.5rem]
            "
          >
            {home("title")}
          </h1>

          {/* Description */}
          <p
            className="
              mt-5
              max-w-lg
              text-base
              leading-relaxed
              text-[var(--muted-text)]
              sm:text-lg
              sm:leading-8
            "
          >
            {home("description")}
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink
              href={`/${locale}/book`}
              variant="primary"
              size="large"
              icon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
            >
              {home("book")}
            </ButtonLink>

            <ButtonLink
              href={`/${locale}/services`}
              variant="secondary"
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline
                    points={isRTL ? "15 18 9 12 15 6" : "9 18 15 12 9 6"}
                  />
                </svg>
              }
            >
              {home("explore")}
            </ButtonLink>
          </div>
        </div>

        {/* ── Right column: image composition ─────────────── */}
        <div className="relative flex items-center justify-center lg:justify-end">
          {/* Decorative background shape */}
          <div
            aria-hidden="true"
            className={`
              absolute
              inset-x-4
              -bottom-2
              top-4
              rounded-[2rem_2rem_2rem_0.5rem]
              bg-[var(--teal)]
              opacity-90
              shadow-[0_20px_60px_color-mix(in_srgb,var(--teal)_25%,transparent)]
              ${isRTL ? "rounded-[2rem_2rem_0.5rem_2rem]" : ""}
            `}
          />

          {/* Main image frame */}
          <div
            className={`
              relative
              aspect-[4/3]
              w-full
              max-w-xl
              overflow-hidden
              rounded-[2rem_2rem_2rem_0.5rem]
              bg-[var(--aqua)]
              shadow-[0_12px_40px_rgba(7,48,71,0.12)]
              ring-1
              ring-white/40
              ${isRTL ? "rounded-[2rem_2rem_0.5rem_2rem]" : ""}
            `}
          >
            <Image
              alt={
                locale === "ur"
                  ? "صاف اور روشن ڈینٹل ٹریٹمنٹ روم کی مصنوعی تصویر"
                  : "Synthetic image of a clean, bright dental treatment room"
              }
              className="object-cover"
              fill
              sizes="(max-width: 1023px) 100vw, 45vw"
              src="/images/demo/care-room.webp"
            />

            {/* Subtle vignette overlay for depth */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 30% 20%, transparent 50%, rgba(7,48,71,0.06) 100%)`,
              }}
              aria-hidden="true"
            />
          </div>

          {/* Floating badge */}
          <span
            className={`
              absolute
              top-2
              rounded-2xl
              bg-white/95
              px-4
              py-2.5
              text-xs
              font-extrabold
              text-[var(--teal-dark)]
              shadow-[0_4px_20px_rgba(7,48,71,0.1)]
              backdrop-blur-md
              border
              border-[var(--line)]/50
              ${isRTL ? "start-0 rounded-se-none" : "end-0 rounded-ss-none"}
            `}
          >
            {home("demoTitle")}
          </span>

          {/* Floating stat card (bottom) */}
          <div
            className={`
              absolute
              -bottom-4
              hidden
              items-center
              gap-3
              rounded-2xl
              bg-white
              px-5
              py-3.5
              shadow-[0_8px_30px_rgba(7,48,71,0.1)]
              border
              border-[var(--line)]/40
              sm:flex
              ${isRTL ? "start-4" : "end-4"}
            `}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--aqua-soft)] text-[var(--teal)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-extrabold leading-none text-[var(--primary-ink)]">
                PHC REG Number
              </p>
              <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--muted-text)]">
                24988
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
