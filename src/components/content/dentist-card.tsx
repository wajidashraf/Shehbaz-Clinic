import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { DemoDentist } from "@/content/demo-content";
import { getLocalizedText } from "@/content/demo-content";
import { ButtonLink } from "@/components/ui/button-link";

type DentistCardProps = {
  dentist: DemoDentist;
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
          {getLocalizedText(dentist.area, locale)}
        </p>
        <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.03em]">
          {getLocalizedText(dentist.name, locale)}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[var(--muted-text)]">
          {getLocalizedText(dentist.biography, locale)}
        </p>
        <dl className="mt-5 space-y-3 border-t border-[var(--line)] pt-5 text-sm">
          <div>
            <dt className="font-extrabold text-[var(--ink)]">{labels.languages}</dt>
            <dd className="mt-1 text-[var(--muted-text)]">
              {getLocalizedText(dentist.languages, locale)}
            </dd>
          </div>
          <div>
            <dt className="font-extrabold text-[var(--ink)]">{labels.workingDays}</dt>
            <dd className="mt-1 text-[var(--muted-text)]">
              {getLocalizedText(dentist.workingDays, locale)}
            </dd>
          </div>
        </dl>
        <div className="mt-6">
          <ButtonLink href={`/${locale}/book?dentist=${dentist.id}`}>
            {labels.book}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
