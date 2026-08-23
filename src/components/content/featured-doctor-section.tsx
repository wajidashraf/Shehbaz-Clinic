import Image from "next/image";
import Link from "next/link";
import { getLocalizedText } from "@/content/demo-content";
import type { Locale } from "@/i18n/config";
import type { DoctorRecord } from "@/modules/doctors/doctor.types";

type FeaturedDoctorSectionProps = {
  doctor: DoctorRecord;
  locale: Locale;
};

export function FeaturedDoctorSection({
  doctor,
  locale,
}: FeaturedDoctorSectionProps) {
  const name = getLocalizedText(doctor.name, locale);
  const title = getLocalizedText(doctor.title, locale);
  const qualification = getLocalizedText(doctor.qualification, locale);
  const education = getLocalizedText(doctor.education, locale);
  const registration = getLocalizedText(doctor.registration, locale);
  const biography = getLocalizedText(doctor.biography, locale);
  const imageAlt = doctor.imageAlt[locale] || doctor.imageAlt.en;
  const labels =
    locale === "ur"
      ? {
          registration: "رجسٹریشن",
          experience: "تجربہ",
          years: "سال",
          practicingSince: "پریکٹس کا آغاز",
          book: "مشاورت بک کریں",
        }
      : {
          registration: "Registration",
          experience: "Experience",
          years: "Years",
          practicingSince: "Practicing since",
          book: "Book Consultation",
        };

  const experienceStartYear = 2015;
  const currentYear = new Date().getFullYear();
  const experienceYears = Math.max(0, currentYear - experienceStartYear);

  return (
    <section
      id="dentist"
      className="scroll-mt-28 bg-white py-10 sm:py-12 md:py-14 lg:py-16"
      data-testid="featured-doctor-section"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <article className="grid overflow-hidden rounded-[1.5rem] border border-[var(--teal)]/35 bg-[var(--primary-ink)] p-3 shadow-[0_32px_80px_-44px_var(--primary-ink)] sm:rounded-[1.75rem] sm:p-4 md:p-5 lg:grid-cols-[minmax(320px,400px)_minmax(0,1fr)] lg:gap-7 lg:rounded-[2rem] lg:p-6 xl:grid-cols-[minmax(360px,440px)_minmax(0,1fr)] xl:gap-8">
          {/* Doctor Image */}
          <div className="relative min-h-[300px] overflow-hidden rounded-[1.25rem] border-2 border-[var(--teal-dark)] bg-[var(--aqua-light)] sm:min-h-[360px] sm:rounded-[1.5rem] md:min-h-[420px] lg:min-h-[500px] xl:min-h-[520px]">
            <Image
              src={doctor.image}
              alt={imageAlt}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 400px, 440px"
              className="object-cover object-top"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--primary-ink)]/15 via-transparent to-transparent"
            />
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-col justify-center px-2 py-7 text-white sm:px-4 sm:py-8 md:px-5 md:py-9 lg:px-4 lg:py-8 xl:px-6 xl:py-10">
            {/* Doctor Role */}
            {title ? (
              <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--aqua)] sm:text-[11px] md:text-xs">
                {title}
              </p>
            ) : null}

            {/* Name */}
            <h2 className="mt-2 text-2xl font-extrabold leading-tight tracking-[-0.025em] text-white sm:text-3xl lg:text-[2.15rem] xl:text-[2.35rem]">
              {name}
            </h2>

            {/* Qualification */}
            {qualification ? (
              <p className="mt-2 text-sm font-bold leading-5 text-white/80 sm:text-base sm:leading-6 lg:text-[17px]">
                {qualification}
              </p>
            ) : null}

            {/* Registration + Experience */}
            <div className="mt-5 divide-y divide-white/12 border-y border-white/12 sm:mt-6">
              {registration ? (
                <div className="flex flex-col gap-1.5 py-3 sm:flex-row sm:items-center sm:gap-5 sm:py-4">
                  <div className="flex min-w-[125px] items-center gap-2 text-[var(--aqua)]">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full border border-[var(--aqua)]">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="size-3"
                      >
                        <path
                          d="m7 12 3 3 7-7"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>

                    <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] sm:text-[11px]">
                      {labels.registration}
                    </span>
                  </div>

                  <p className="ps-7 text-[13px] font-bold leading-5 text-white sm:ps-0 sm:text-sm">
                    {registration}
                  </p>
                </div>
              ) : null}

              <div className="flex flex-col gap-1.5 py-3 sm:flex-row sm:items-center sm:gap-5 sm:py-4">
                <div className="flex min-w-[125px] items-center gap-2 text-[var(--aqua)]">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full border border-[var(--aqua)]">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="size-3"
                    >
                      <path
                        d="m7 12 3 3 7-7"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] sm:text-[11px]">
                    {labels.experience}
                  </span>
                </div>

                <p className="ps-7 text-[13px] font-bold leading-5 text-white sm:ps-0 sm:text-sm">
                  {experienceYears}+ {labels.years}
                  <span className="font-medium text-white/60">
                    {" "}
                    · {labels.practicingSince} {experienceStartYear}
                  </span>
                </p>
              </div>
            </div>

            {/* Education */}
            {education ? (
              <div className="mt-4 flex items-start gap-3 sm:mt-5">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-[var(--aqua)] text-[var(--aqua)] sm:size-6 sm:border-2">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="size-3 sm:size-3.5"
                  >
                    <path
                      d="m7 12 3 3 7-7"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <p className="text-[13px] leading-5 text-white/75 sm:text-sm sm:leading-6 lg:text-[15px]">
                  {education}
                </p>
              </div>
            ) : null}

            {/* Biography */}
            {biography ? (
              <p className="mt-4 max-w-3xl border-s-2 border-[var(--aqua)] ps-3 text-[13px] leading-5 text-white/70 sm:mt-5 sm:border-s-[3px] sm:ps-4 sm:text-sm sm:leading-6 lg:text-[15px]">
                {biography}
              </p>
            ) : null}

            {/* Book Consultation */}
            <div className="mt-6 sm:mt-7">
              <Link
                href={`/${locale}/book`}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white bg-white px-5 py-2.5 text-sm font-extrabold text-[var(--primary-ink)] shadow-[0_12px_28px_-18px_rgba(0,0,0,0.45)] transition-[background-color,color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-[var(--aqua)] hover:bg-[var(--aqua)] hover:text-[var(--primary-ink)] hover:shadow-[0_18px_38px_-20px_rgba(0,0,0,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aqua)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary-ink)] sm:min-h-12 sm:w-auto sm:px-6 sm:py-3 sm:text-base"
              >
                {labels.book}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
