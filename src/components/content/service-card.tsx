import Image from "next/image";

import { ButtonLink } from "@/components/ui/button-link";
import {
  getLocalizedText,
  type DemoService,
} from "@/content/demo-content";
import type { Locale } from "@/i18n/config";

type ServiceCardProps = {
  labels: {
    book: string;
    duration: string;
    minutes: string;
  };

  locale: Locale;

  service: DemoService;

  /**
   * Used by the home carousel to visually emphasize
   * the service currently in the center.
   */
  active?: boolean;

  /**
   * Optional explicit image.
   *
   * If omitted, the component expects:
   * /images/services/<service-id>.webp
   */
  imageSrc?: string;
};

export function ServiceCard({
  labels,
  locale,
  service,
  active = false,
  imageSrc,
}: ServiceCardProps) {
  const serviceName = getLocalizedText(
    service.name,
    locale,
  );

  const serviceCategory = getLocalizedText(
    service.category,
    locale,
  );

  const serviceSummary = getLocalizedText(
    service.summary,
    locale,
  );

  const resolvedImageSrc =
    imageSrc ??
    `/images/services/${service.id}.webp`;

  return (
    <article
      className={`
        group
        relative
        flex
        h-full
        min-h-[28rem]
        flex-col
        overflow-hidden
        rounded-[1.65rem]
        border
        bg-white

        transition-[border-color,box-shadow,background-color]
        duration-700
        ease-[cubic-bezier(0.22,1,0.36,1)]

        ${
          active
            ? `
            border-[4px]
              border-[color-mix(in_srgb,var(--teal)_24%,white)]
              shadow-[0_30px_70px_-30px_rgba(15,23,42,0.34)]
            `
            : `
              border-[var(--line)]
              shadow-[0_18px_48px_-36px_rgba(15,23,42,0.28)]
            `
        }
      `}
    >
      {/* Very subtle premium background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-36
          bg-[linear-gradient(180deg,var(--aqua-soft)_0%,rgba(255,255,255,0)_100%)]
          opacity-70
        "
      />

      <div
        className="
          relative
          z-10
          flex
          h-full
          flex-col
          px-5
          pb-6
          pt-5
          sm:px-6
          sm:pb-7
          sm:pt-6
        "
      >
        {/* Category */}
        <div className="flex min-h-7 justify-center">
          <span
            className="
              inline-flex
              rounded-full
              border
              border-[color-mix(in_srgb,var(--teal)_12%,transparent)]
              bg-white/80
              px-3
              py-1.5
              text-[0.68rem]
              font-extrabold
              tracking-[0.04em]
              text-[var(--teal-dark)]
              shadow-sm
              backdrop-blur-sm
            "
          >
            {serviceCategory}
          </span>
        </div>

        {/* Treatment image */}
        <div className="relative mx-auto mt-5">
          {/* Soft teal glow behind image */}
          <div
            aria-hidden="true"
            className={`
              absolute
              inset-2
              rounded-[1.4rem]
              bg-[var(--teal)]
              blur-xl
              transition-opacity
              duration-700

              ${
                active
                  ? "opacity-20"
                  : "opacity-10"
              }
            `}
          />

          <div
            className={`
              relative
              size-28
              overflow-hidden
              rounded-[1.35rem]
              border-[3px]
              border-white
              bg-[var(--aqua-soft)]
              ring-1
              ring-[color-mix(in_srgb,var(--teal)_18%,transparent)]

              transition-[transform,box-shadow]
              duration-700
              ease-[cubic-bezier(0.22,1,0.36,1)]

              ${
                active
                  ? `
                    shadow-[0_18px_38px_-14px_rgba(15,23,42,0.35)]
                  `
                  : `
                    shadow-[0_12px_28px_-16px_rgba(15,23,42,0.25)]
                  `
              }
            `}
          >
            <Image
              alt={serviceName}
              className="
                object-cover
                object-center
                transition-transform
                duration-1000
                ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:scale-[1.035]
              "
              fill
              sizes="112px"
              src={resolvedImageSrc}
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-slate-950/10
                via-transparent
                to-white/5
              "
            />
          </div>
        </div>

        {/* Service name */}
        <h3
          className={`
            mt-6
            text-center
            leading-snug
            font-extrabold
            tracking-[-0.025em]
            text-[var(--ink)]
            transition-[font-size,color]
            duration-500

            ${
              active
                ? "text-xl sm:text-[1.4rem]"
                : "text-lg sm:text-xl"
            }
          `}
        >
          <bdi>{serviceName}</bdi>
        </h3>

        {/* Description */}
        <p
          className="
            mx-auto
            mt-3
            line-clamp-3
            max-w-sm
            flex-1
            text-center
            text-sm
            leading-6
            text-[var(--muted-text)]
          "
        >
          {serviceSummary}
        </p>

        {/* Duration */}
        <div
          className="
            mt-5
            flex
            items-center
            justify-center
            gap-2
            border-t
            border-[var(--line)]
            pt-4
            text-xs
            font-bold
            text-[var(--muted-text)]
          "
        >
          <svg
            aria-hidden="true"
            className="size-4 text-[var(--teal-dark)]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.8"
            />

            <path
              d="M12 7v5l3 2"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>

          <span>
            {labels.duration}:{" "}
            <bdi>{service.durationMinutes}</bdi>{" "}
            {labels.minutes}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-5 flex justify-center">
          <ButtonLink
            className="w-full sm:w-auto"
            href={`/${locale}/book?service=${service.id}`}
            size="default"
            variant={active ? "primary" : "secondary"}
          >
            {labels.book}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}