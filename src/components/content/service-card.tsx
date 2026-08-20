import type { Locale } from "@/i18n/config";
import type { DemoService } from "@/content/demo-content";
import { getLocalizedText } from "@/content/demo-content";
import { ButtonLink } from "@/components/ui/button-link";

type ServiceCardProps = {
  labels: {
    book: string;
    duration: string;
    minutes: string;
  };
  locale: Locale;
  service: DemoService;
};

export function ServiceCard({ labels, locale, service }: ServiceCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-[1.75rem] border border-[var(--line)] bg-white p-6 shadow-[0_18px_50px_-38px_rgba(18,48,53,0.45)] transition-[transform,border-color,box-shadow] hover:-translate-y-1 hover:border-[var(--line-strong)] hover:shadow-[0_24px_58px_-36px_rgba(18,48,53,0.52)] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full bg-[var(--aqua-soft)] px-3 py-1.5 text-xs font-extrabold text-[var(--teal-dark)]">
          {getLocalizedText(service.category, locale)}
        </span>
        <span
          aria-hidden="true"
          className="block h-1.5 w-10 rounded-full bg-[var(--saffron)]"
        />
      </div>
      <h3 className="mt-6 text-xl leading-snug font-extrabold tracking-[-0.025em] sm:text-2xl">
        {getLocalizedText(service.name, locale)}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-7 text-[var(--muted-text)]">
        {getLocalizedText(service.summary, locale)}
      </p>
      <p className="mt-5 border-t border-[var(--line)] pt-4 text-xs font-bold text-[var(--muted-text)]">
        {labels.duration}: <bdi>{service.durationMinutes}</bdi> {labels.minutes}
      </p>
      <div className="mt-5">
        <ButtonLink href={`/${locale}/book?service=${service.id}`}>
          {labels.book}
        </ButtonLink>
      </div>
    </article>
  );
}
