import Link from "next/link";
import { clinicConfig } from "@/config/public-config";
import type { Locale } from "@/i18n/config";

type SiteFooterProps = {
  locale: Locale;
  labels: {
    summary: string;
    addressPending: string;
    contactPending: string;
    privacy: string;
    accessibility: string;
  };
};

export function SiteFooter({ labels, locale }: SiteFooterProps) {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--ink)] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-2 lg:px-8">
        <div>
          <p className="font-extrabold">{clinicConfig.name}</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/75">
            {labels.summary}
          </p>
        </div>
        <div className="space-y-2 text-sm text-white/75 md:text-end">
          <p>{labels.addressPending}</p>
          <p>{labels.contactPending}</p>
          <div className="flex gap-5 md:justify-end">
            <Link href={`/${locale}/privacy`}>{labels.privacy}</Link>
            <Link href={`/${locale}/accessibility`}>
              {labels.accessibility}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
