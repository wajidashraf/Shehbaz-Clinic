import { SectionHeading } from "@/components/ui/section-heading";
import { clinicConfig } from "@/config/public-config";
import type { Locale } from "@/i18n/config";

type ClinicContactSectionProps = {
  labels: {
    address: string;
    addressLabel: string;
    book: string;
    daily: string;
    description: string;
    directions: string;
    eyebrow: string;
    hoursLabel: string;
    mapTitle: string;
    phoneLabel: string;
    title: string;
  };
  locale: Locale;
};

const mapEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3141.827692748456!2d72.95830837524394!3d31.061367274427404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3922f1a4d8da9c6d%3A0x41881ef246bc1cd9!2sShahbaz%20Dental%20Clinic!5e1!3m2!1sen!2s!4v1787335698364!5m2!1sen!2s";

const details = [
  {
    key: "phone",
    icon: (
      <path d="M8.5 4.5 10 8l-2 1.5c1.2 2.6 3.4 4.8 6 6l1.5-2 3.5 1.5c.4.2.7.6.6 1.1-.3 2.1-2.1 3.7-4.2 3.7C9.2 19.8 4.2 14.8 4.2 8.6c0-2.1 1.6-3.9 3.7-4.2.2 0 .4 0 .6.1Z" />
    ),
  },
  {
    key: "address",
    icon: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
  {
    key: "hours",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
] as const;

export function ClinicContactSection({ labels }: ClinicContactSectionProps) {
  const phoneHref = clinicConfig.phoneHref;
  const landlineHref = clinicConfig.landlineHref;

  return (
    <section
      id="contact"
      className="relative scroll-mt-28 overflow-hidden bg-[var(--primary-ink)] py-14 text-white sm:py-16 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-56 top-0 size-[34rem] rounded-full bg-[var(--teal)]/25 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-40 bottom-0 size-[30rem] rounded-full bg-cyan-300/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl [&_h2]:text-white [&_p]:text-white/75">
          <SectionHeading
            description={labels.description}
            eyebrow=""
            title={labels.title}
          />
        </div>

        {/* Content + Map */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-14">
          {/* LEFT CONTACT CONTENT */}
          <div className="min-w-0">
            <dl className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-1 lg:gap-5">
              {details.map((item) => {
                const label =
                  item.key === "phone"
                    ? labels.phoneLabel
                    : item.key === "address"
                      ? labels.addressLabel
                      : labels.hoursLabel;

                const value =
                  item.key === "phone"
                    ? clinicConfig.phone
                    : item.key === "address"
                      ? labels.address
                      : `${clinicConfig.openingHours.display} · ${labels.daily}`;

                return (
                  <div
                    key={item.key}
                    className="flex min-w-0 items-start gap-3 py-1"
                  >
                    {/* Icon */}
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/10 text-[var(--aqua)] sm:size-11">
                      <svg
                        aria-hidden="true"
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                      >
                        {item.icon}
                      </svg>
                    </span>

                    {/* Text */}
                    <div className="min-w-0 pt-0.5">
                      <dt className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--aqua)] sm:text-[11px]">
                        {label}
                      </dt>

                      <dd className="mt-1 text-sm font-semibold leading-5 text-white sm:text-[15px] sm:leading-6">
                        {item.key === "phone" ? (
                          <span className="flex flex-col gap-0.5">
                            <a
                              dir="ltr"
                              href={phoneHref}
                              className="transition-colors duration-300 hover:text-[var(--aqua)]"
                            >
                              <bdi>{value}</bdi>
                            </a>

                            <a
                              dir="ltr"
                              href={landlineHref}
                              className="text-xs font-medium text-white/65 transition-colors duration-300 hover:text-[var(--aqua)] sm:text-sm"
                            >
                              <bdi>{clinicConfig.landline}</bdi>
                            </a>
                          </span>
                        ) : (
                          <bdi>{value}</bdi>
                        )}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </div>

          {/* RIGHT GOOGLE MAP */}
          <div className="overflow-hidden rounded-xl border border-white/15 bg-white/10 p-2 shadow-[0_30px_80px_-34px_rgba(0,0,0,0.65)] backdrop-blur-sm">
            <iframe
              allowFullScreen
              className="h-[20rem] w-full rounded-lg border-0 bg-[var(--aqua-soft)] sm:h-[24rem] md:h-[26rem] lg:h-[25rem]"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              src={mapEmbedUrl}
              title={labels.mapTitle}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
