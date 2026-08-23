import Link from "next/link";
import { clinicConfig } from "@/config/public-config";
import type { Locale } from "@/i18n/config";

type MobileNavigationProps = {
  locale: Locale;
  labels: {
    book: string;
    call: string;
    directions: string;
    mobileNavigation: string;
    whatsapp: string;
  };
};

function CallIcon() {
  return (
    <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M21 15.7v3a2 2 0 0 1-2.2 2A17.7 17.7 0 0 1 3.3 5.2 2 2 0 0 1 5.3 3h3a2 2 0 0 1 2 1.7c.1.8.3 1.6.7 2.4a2 2 0 0 1-.5 2.2l-1.2 1.2a14 14 0 0 0 4.2 4.2l1.2-1.2a2 2 0 0 1 2.2-.5c.8.4 1.6.6 2.4.7A2 2 0 0 1 21 15.7Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M20.5 11.8a8.4 8.4 0 0 1-12.4 7.4L4 20.4l1.2-4a8.4 8.4 0 1 1 15.3-4.6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M9.1 8.1c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4-.1.6.6 1.2 1.6 2.2 2.8 2.8.2.1.4.1.6-.1l.8-.9c.2-.2.4-.3.7-.1l1.8.9c.3.1.4.3.4.6 0 .5-.3 1.4-.8 1.8-.5.5-1.4.8-2.3.6-1.3-.3-3.1-1-4.7-2.5-1.3-1.2-2.3-2.8-2.7-4.1-.4-1.2.1-2.3.7-2.9Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2.5"
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
  );
}

function DirectionsIcon() {
  return (
    <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function MobileNavigation({ locale, labels }: MobileNavigationProps) {
  const phoneHref = `tel:${clinicConfig.phone.replace(/\s+/g, "")}`;
  const whatsappNumber = clinicConfig.whatsapp.number.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${whatsappNumber}`;

  const itemClass =
    "flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 py-3 text-center text-[11px] font-extrabold leading-none text-[var(--primary-ink)] transition-colors duration-300 hover:bg-[var(--aqua-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--teal)]";

  return (
    <nav
      aria-label={labels.mobileNavigation}
      className="fixed inset-x-0 bottom-0 z-50 w-full border-t border-[var(--line)] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_28px_-20px_rgba(7,48,71,0.3)] md:hidden"
    >
      <div className="flex w-full flex-row items-stretch">
        {/* CALL */}
        <a href={phoneHref} className={itemClass}>
          <span className="text-[var(--teal)]">
            <CallIcon />
          </span>
          <span>{labels.call}</span>
        </a>

        {/* WHATSAPP */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={itemClass}
        >
          <span className="text-[#25D366]">
            <WhatsAppIcon />
          </span>
          <span>{labels.whatsapp}</span>
        </a>

        {/* BOOK */}
        <Link href={`/${locale}/book`} className={itemClass}>
          <span className="text-[var(--teal)]">
            <BookIcon />
          </span>
          <span>{labels.book}</span>
        </Link>

        {/* DIRECTIONS */}
        <a
          href={clinicConfig.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={itemClass}
        >
          <span className="text-[#ef4444]">
            <DirectionsIcon />
          </span>
          <span>{labels.directions}</span>
        </a>
      </div>
    </nav>
  );
}
