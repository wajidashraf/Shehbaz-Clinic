import { clinicConfig } from "@/config/public-config";

type HeaderTopBarProps = {
  labels: { address: string; openDaily: string };
};

export function HeaderTopBar({ labels }: HeaderTopBarProps) {
  return (
    <div className="hidden bg-[var(--primary-ink)] md:block">
      <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-between gap-6 px-6 lg:px-8">
        {/* Opening Hours */}
        <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
          <svg
            aria-hidden="true"
            className="size-4 shrink-0 text-white/80"
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
            {labels.openDaily}: <bdi>{clinicConfig.openingHours.display}</bdi>
          </span>
        </div>

        {/* Location */}
        {clinicConfig.mapsUrl ? (
          <a
            className="
              flex min-w-0 items-center gap-2
              text-xs font-semibold text-white/90
              transition-colors duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]
              hover:text-white
            "
            href={clinicConfig.mapsUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg
              aria-hidden="true"
              className="size-4 shrink-0 text-white/80"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />

              <circle
                cx="12"
                cy="10"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>

            <span className="max-w-[24rem] truncate">{labels.address}</span>
          </a>
        ) : null}

        {/* Clinic phone numbers */}
        <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
          <svg
            aria-hidden="true"
            className="size-4 shrink-0 text-white/80"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M8.5 4.5 10 8l-2 1.5c1.2 2.6 3.4 4.8 6 6l1.5-2 3.5 1.5c.4.2.7.6.6 1.1-.3 2.1-2.1 3.7-4.2 3.7C9.2 19.8 4.2 14.8 4.2 8.6c0-2.1 1.6-3.9 3.7-4.2.2 0 .4 0 .6.1Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            />
          </svg>
          <a
            className="transition-colors duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] hover:text-white"
            href={`tel:${clinicConfig.phone.replace(/\s+/g, "")}`}
          >
            <bdi>{clinicConfig.phone}</bdi>
          </a>
          <span aria-hidden="true" className="text-white/35">
            |
          </span>
          <a
            className="transition-colors duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] hover:text-white"
            href={`tel:${clinicConfig.landline.replace(/-/g, "")}`}
          >
            <bdi>{clinicConfig.landline}</bdi>
          </a>
        </div>
      </div>
    </div>
  );
}
