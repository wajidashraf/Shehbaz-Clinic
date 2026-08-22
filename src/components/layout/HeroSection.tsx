import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";

type HeroSectionProps = {
  locale: "en" | "ur";
  home: (key: string) => string;
};

export function HeroSection({ locale, home }: HeroSectionProps) {
  const isRtl = locale === "ur";

  return (
    <section
      aria-label={home("title")}
      className=" relative isolate min-h-[clamp(36rem,68dvh,46rem)] overflow-hidden bg-[var(--mineral)] lg:min-h-[calc(100dvh-7.5rem)]"
    >
      {/* Hero image frame */}
      <div
        className="
    absolute inset-0 overflow-hidden
    border-0 bg-[var(--aqua)] p-0
    shadow-none

    lg:inset-y-[9%]
    lg:end-[max(2rem,calc((100vw-80rem)/2+2rem))]
    lg:start-auto
    lg:w-[min(calc(43vw-20px),40rem)]
    lg:rounded-4xl
    lg:border-[5px]
    lg:border-[var(--line-strong)]
    lg:bg-white
    lg:p-2
    lg:shadow-[0_30px_80px_-38px_rgba(7,48,71,0.5)]
  "
      >
        <div
          className="
      relative size-full overflow-hidden
      rounded-none bg-[var(--aqua)]
      lg:rounded-4xl
    "
        >
          <Image
            alt={home("imageAlt")}
            className="object-cover object-center lg:object-[52%_center]"
            fill
            preload
            sizes="(max-width: 1023px) 100vw, 43vw"
            src="/images/demo/care-room.webp"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,48,71,0.02)_0%,rgba(7,48,71,0.12)_100%)] lg:hidden"
          />
        </div>
      </div>

      {/* Mobile text readability overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(180deg,rgba(0,103,143,0)_0%,rgba(0,103,143,0.72)_22%,rgba(7,48,71,0.96)_100%)] backdrop-blur-[2px] lg:hidden"
      />

      {/* Desktop decorative shape */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-40 -top-44 hidden size-[38rem] rounded-full bg-[var(--aqua)] opacity-70 blur-3xl lg:block"
      />

      {/* Main content */}
      <div className=" relative z-10 mx-auto flex min-h-[clamp(36rem,68dvh,46rem)] max-w-7xl items-end px-5 py-6 sm:px-6 sm:py-8 lg:min-h-[calc(100dvh-7.5rem)] lg:items-center lg:px-8 lg:py-16">
        <div className="w-full text-center lg:max-w-[42%] lg:pe-8 lg:text-start">
          <p
            className={`mx-auto hidden w-fit items-center gap-2 rounded-full border border-white/25 bg-white/14 px-3.5 py-2 text-[0.68rem] font-extrabold text-white shadow-sm backdrop-blur-md lg:mx-0 lg:inline-flex lg:border-[var(--line)] lg:bg-white lg:text-[var(--teal-dark)] ${
              isRtl
                ? "leading-6 tracking-normal"
                : "uppercase tracking-[0.13em]"
            }`}
          >
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-[var(--saffron)]"
            />

            {home("eyebrow")}
          </p>

          <h1
            className={`mx-auto mt-10 max-w-[15ch] text-[clamp(2.1rem,9.2vw,3rem)] font-extrabold leading-[1.06] text-balance text-white sm:max-w-[17ch] lg:mx-0 lg:mt-6 lg:max-w-[11ch] lg:text-[clamp(3.6rem,5.1vw,4.75rem)] lg:text-[var(--primary-ink)] ${
              isRtl
                ? "tracking-normal"
                : "tracking-[-0.052em] [word-spacing:0.09em]"
            }`}
          >
            {home("title")}
          </h1>

          <p className="mx-auto mt-4 max-w-[36rem] text-sm leading-6 text-pretty text-white/90 sm:text-base sm:leading-7 lg:mx-0 lg:mt-5 lg:max-w-xl lg:text-lg lg:leading-8 lg:text-[var(--muted-text)]">
            {home("description")}
          </p>

          <div className="mx-auto mt-5 grid max-w-md grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 lg:mx-0 lg:mt-8 lg:flex lg:max-w-none lg:flex-wrap lg:gap-3">
            <ButtonLink
              className="w-full lg:w-auto"
              href={`/${locale}/book`}
              icon={
                <svg
                  aria-hidden="true"
                  className="hidden size-5 lg:inline-block"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M8 3v4M16 3v4M3 10h18"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                </svg>
              }
              size="large"
            >
              {home("book")}
            </ButtonLink>

            <ButtonLink
              className="w-full border-white/70 bg-white/92 lg:w-auto lg:border-[var(--line-strong)] lg:bg-white"
              href={`/${locale}#services`}
              icon={
                <svg
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d={isRtl ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              }
              variant="secondary"
            >
              {home("explore")}
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* PHC Registration - top right */}
      <div
        className="
          absolute
          end-[max(1rem,calc((100vw-90rem)/2+3rem))]
          bottom-[8%]
          z-20
          hidden items-center gap-3
          rounded-xl border border-white/80
          bg-white/95 px-4 py-3
          text-[var(--primary-ink)]
          shadow-[0_14px_38px_-20px_rgba(7,48,71,0.95)]
          backdrop-blur-md
          lg:flex
        "
      >
        <span className="grid size-9 place-items-center rounded-lg bg-[var(--aqua-soft)] text-[var(--teal)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
            />
          </svg>
        </span>

        <span>
          <strong className="block text-sm leading-5">
            {home("registrationLabel")}
          </strong>

          <bdi className="block text-xs font-bold text-[var(--muted-text)]">
            24988
          </bdi>
        </span>
      </div>
    </section>
  );
}
