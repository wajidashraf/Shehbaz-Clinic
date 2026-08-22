import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";
import { getLocalizedText, type DemoService } from "@/content/demo-content";
import { getServiceImageSource } from "@/content/service-images";
import type { Locale } from "@/i18n/config";

type ServiceCardProps = {
  active?: boolean;
  preview?: boolean;
  href?: string;
  imageSrc?: string;
  labels: {
    book: string;
    duration: string;
    minutes: string;
  };
  locale: Locale;
  service: DemoService;
};

export function ServiceCard({
  active = false,
  preview = false,
  href,
  imageSrc,
  labels,
  locale,
  service,
}: ServiceCardProps) {
  const name = getLocalizedText(service.name, locale);

  return (
    <article
      aria-hidden={preview || undefined}
      className={`group flex h-full min-h-[32rem] scroll-mt-28 flex-col overflow-hidden rounded-lg border bg-white transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ${
        active
          ? " border-5 p-1 border-[color-mix(in_srgb,var(--teal)_74%,white)] shadow-[0_28px_70px_-38px_rgba(7,48,71,0.5)]"
          : "border-[var(--line)] shadow-[0_20px_54px_-42px_rgba(7,48,71,0.4)]"
      }`}
      id={preview ? undefined : service.id}
    >
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-[var(--aqua)]">
        <Image
          alt={name}
          className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-[1.02] motion-reduce:transition-none"
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 54vw, 560px"
          src={imageSrc ?? getServiceImageSource(service)}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(7,48,71,0.42)_100%)]"
        />
        <span className="absolute start-4 top-4 rounded-full border border-white/70 bg-white/92 px-3 py-1.5 text-xs font-extrabold text-[var(--teal-dark)] shadow-sm backdrop-blur-sm">
          {getLocalizedText(service.category, locale)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="text-2xl font-extrabold leading-tight tracking-[-0.035em] text-balance text-[var(--primary-ink)] sm:text-[1.75rem]">
          <bdi>{name}</bdi>
        </h3>
        <p className="mt-3 flex-1 text-base leading-7 text-pretty text-[var(--muted-text)]">
          {getLocalizedText(service.summary, locale)}
        </p>
        <div className="mt-5 flex items-center gap-2 border-t border-[var(--line)] pt-4 text-xs font-bold text-[var(--muted-text)]">
          <svg
            aria-hidden="true"
            className="size-4 shrink-0 text-[var(--teal-dark)]"
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
            {labels.duration}: <bdi>{service.durationMinutes}</bdi>{" "}
            {labels.minutes}
          </span>
        </div>
        <div className="mt-5">
          {preview ? (
            <span className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--line-strong)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--ink)]">
              {labels.book}
            </span>
          ) : (
            <ButtonLink
              className="w-full sm:w-auto"
              href={href ?? `/${locale}/book?service=${service.id}`}
              variant={active ? "primary" : "secondary"}
            >
              {labels.book}
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  );
}
