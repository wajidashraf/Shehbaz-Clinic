import { ButtonLink } from "@/components/ui/button-link";
import { clinicConfig } from "@/config/public-config";

type UrgentHelpSectionProps = {
  labels: {
    action: string;
    description: string;
    eyebrow: string;
    title: string;
  };
};

export function UrgentHelpSection({ labels }: UrgentHelpSectionProps) {
  const mobileHref = clinicConfig.phoneHref;
  const landlineHref = clinicConfig.landlineHref;

  return (
    <section className="border-y border-red-100 bg-red-50/70 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--danger)]">
            {labels.eyebrow}
          </p>
          <h2 className="mt-2 text-xl font-extrabold text-[var(--primary-ink)] sm:text-2xl">
            {labels.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted-text)]">
            {labels.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-extrabold text-[var(--danger)]">
            <a
              className="transition-colors duration-300 hover:text-red-800"
              href={mobileHref}
            >
              <bdi>{clinicConfig.phone}</bdi>
            </a>
            <a
              className="transition-colors duration-300 hover:text-red-800"
              href={landlineHref}
            >
              <bdi>{clinicConfig.landline}</bdi>
            </a>
          </div>
        </div>
        <ButtonLink className="shrink-0" href={mobileHref} variant="danger">
          {labels.action}
        </ButtonLink>
      </div>
    </section>
  );
}
