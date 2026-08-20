import Link from "next/link";
import { clinicConfig } from "@/config/public-config";
import type { Locale } from "@/i18n/config";

type SiteFooterProps = {
  locale: Locale;
  labels: {
    summary: string;
    locality: string;
    demonstration: string;
    services: string;
    dentists: string;
    book: string;
  };
};

export function SiteFooter({ labels, locale }: SiteFooterProps) {
  return (
    <footer className="border-t border-[var(--line)] bg-white text-[var(--ink)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.3fr_0.7fr] lg:px-8 lg:py-16">
        <div>
          <Link
            className="inline-flex items-center gap-3 font-extrabold tracking-[-0.02em]"
            href={`/${locale}`}
          >
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-[38%_62%_52%_48%] bg-[var(--teal)] text-white"
            >
              S
            </span>
            {clinicConfig.name}
          </Link>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted-text)]">
            {labels.summary}
          </p>
          <p className="mt-3 text-sm font-bold text-[var(--teal-dark)]">
            <bdi>{labels.locality}</bdi>
          </p>
        </div>
        <div className="md:text-end">
          <nav
            aria-label={labels.summary}
            className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold md:justify-end"
          >
            <Link href={`/${locale}`}>{locale === "ur" ? "صفحہ اول" : "Home"}</Link>
            <Link href={`/${locale}/services`}>{labels.services}</Link>
            <Link href={`/${locale}/dentists`}>{labels.dentists}</Link>
            <Link href={`/${locale}/book`}>{labels.book}</Link>
          </nav>
          <div className="mt-6 inline-flex max-w-sm rounded-2xl bg-[var(--aqua-soft)] px-4 py-3 text-start text-xs leading-5 text-[var(--muted-text)] md:text-end">
            {labels.demonstration}
          </div>
        </div>
      </div>
    </footer>
  );
}
