import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";
import { getLocalizedText } from "@/content/demo-content";
import type { Locale } from "@/i18n/config";
import type { DoctorRecord } from "@/modules/doctors/doctor.types";

type DentistCardProps = {
  dentist: DoctorRecord;
  labels: {
    demoBadge: string;
    viewProfile: string;
  };
  locale: Locale;
};

export function DentistCard({ dentist, labels, locale }: DentistCardProps) {
  const name = getLocalizedText(dentist.name, locale);
  const focusAreas = dentist.focusAreas.slice(0, 2);

  return (
    <article className="group grid min-h-[31rem] overflow-hidden rounded-lg border border-[var(--line)] bg-white shadow-[0_24px_64px_-46px_rgba(7,48,71,0.48)] sm:min-h-0 sm:grid-cols-[minmax(15rem,0.82fr)_minmax(0,1.18fr)]">
      <div className="relative min-h-64 overflow-hidden bg-[var(--aqua)] sm:min-h-[27rem]">
        <Image
          alt={getLocalizedText(dentist.imageAlt, locale)}
          className="object-cover object-top transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-[1.015] motion-reduce:transition-none"
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 42vw, 360px"
          src={dentist.image}
        />
        <span className="absolute start-4 top-4 rounded-full border border-white/70 bg-white/92 px-3 py-1.5 text-xs font-extrabold text-[var(--teal-dark)] shadow-sm backdrop-blur-sm">
          {labels.demoBadge}
        </span>
      </div>

      <div className="flex min-w-0 flex-col justify-center p-6 sm:p-8 lg:p-10">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--teal-dark)]">
          {getLocalizedText(dentist.title, locale)}
        </p>
        <h3 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-0.035em] text-[var(--primary-ink)] sm:text-3xl">
          <bdi>{name}</bdi>
        </h3>
        {getLocalizedText(dentist.qualification, locale) ? (
          <p className="mt-2 text-sm font-bold leading-6 text-[var(--ink)]">
            <bdi>{getLocalizedText(dentist.qualification, locale)}</bdi>
          </p>
        ) : null}
        {getLocalizedText(dentist.registration, locale) ? (
          <p className="mt-4 inline-flex w-fit rounded-full border border-[var(--line)] bg-[var(--aqua-soft)] px-3 py-1.5 text-xs font-extrabold text-[var(--teal-dark)]">
            <bdi>{getLocalizedText(dentist.registration, locale)}</bdi>
          </p>
        ) : null}
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--muted-text)]">
          {getLocalizedText(dentist.biography, locale)}
        </p>
        {focusAreas.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {focusAreas.map((focus) => (
              <li
                className="rounded-full bg-[var(--mineral)] px-3 py-1.5 text-xs font-bold text-[var(--ink)]"
                key={getLocalizedText(focus, locale)}
              >
                {getLocalizedText(focus, locale)}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-6 border-t border-[var(--line)] pt-5">
          <ButtonLink
            href={`/${locale}/dentists/${dentist.id}`}
            icon={
              <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
                <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            }
            size="default"
            variant="secondary"
          >
            {labels.viewProfile}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
