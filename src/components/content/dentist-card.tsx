import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { getLocalizedText } from "@/content/demo-content";
import { ButtonLink } from "@/components/ui/button-link";
import type { DoctorRecord } from "@/modules/doctors/doctor.types";

type DentistCardProps = {
  dentist: DoctorRecord;
  labels: {
    book: string;
    demoBadge: string;
    languages: string;
    workingDays: string;
  };
  locale: Locale;
};

export function DentistCard({ dentist, labels, locale }: DentistCardProps) {
  return (
    <article className="overflow-hidden rounded-[1.9rem] border border-[var(--line)] bg-white shadow-[0_22px_64px_-42px_rgba(18,48,53,0.5)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--aqua)]">
        <Image
          alt={getLocalizedText(dentist.imageAlt, locale)}
          className="object-cover transition-transform duration-300 hover:scale-[1.02]"
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
          src={dentist.image}
        />
        <span className="absolute start-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-[var(--teal-dark)] shadow-sm">
          {labels.demoBadge}
        </span>
      </div>
      <div className="p-6 sm:p-7">
        <p className="text-sm font-extrabold text-[var(--teal-dark)]">
          {getLocalizedText(dentist.title, locale)}
        </p>
        <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.03em]">
          {getLocalizedText(dentist.name, locale)}
        </h3>
        {getLocalizedText(dentist.qualification, locale) ? (
          <p className="mt-2 text-sm font-extrabold text-[var(--ink)]">
            {getLocalizedText(dentist.qualification, locale)}
          </p>
        ) : null}
        {getLocalizedText(dentist.education, locale) ? (
          <p className="mt-1 text-xs leading-5 text-[var(--muted-text)]">
            {getLocalizedText(dentist.education, locale)}
          </p>
        ) : null}
        {getLocalizedText(dentist.registration, locale) ? (
          <p className="mt-3 inline-flex w-fit rounded-full border border-[var(--line)] bg-[var(--aqua-soft)] px-3 py-1 text-xs font-extrabold text-[var(--teal-dark)]">
            {getLocalizedText(dentist.registration, locale)}
          </p>
        ) : null}
        <p className="mt-3 text-sm leading-7 text-[var(--muted-text)]">
          {getLocalizedText(dentist.biography, locale)}
        </p>
        {dentist.focusAreas.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {dentist.focusAreas.map((focus) => (
              <li
                className="rounded-full bg-[var(--mineral)] px-3 py-1.5 text-xs font-bold text-[var(--ink)]"
                key={getLocalizedText(focus, locale)}
              >
                {getLocalizedText(focus, locale)}
              </li>
            ))}
          </ul>
        ) : null}
        {getLocalizedText(dentist.languages, locale) ||
        getLocalizedText(dentist.workingDays, locale) ? (
          <dl className="mt-5 space-y-3 border-t border-[var(--line)] pt-5 text-sm">
            {getLocalizedText(dentist.languages, locale) ? (
              <div>
                <dt className="font-extrabold text-[var(--ink)]">
                  {labels.languages}
                </dt>
                <dd className="mt-1 text-[var(--muted-text)]">
                  {getLocalizedText(dentist.languages, locale)}
                </dd>
              </div>
            ) : null}
            {getLocalizedText(dentist.workingDays, locale) ? (
              <div>
                <dt className="font-extrabold text-[var(--ink)]">
                  {labels.workingDays}
                </dt>
                <dd className="mt-1 text-[var(--muted-text)]">
                  {getLocalizedText(dentist.workingDays, locale)}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : null}
        <div className="mt-6">
          <ButtonLink href={`/${locale}/book?dentist=${dentist.id}`}>
            {labels.book}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
