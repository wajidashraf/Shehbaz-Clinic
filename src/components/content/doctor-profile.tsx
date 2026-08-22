import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";
import { getLocalizedText } from "@/content/demo-content";
import type { Locale } from "@/i18n/config";
import { canDoctorAcceptAppointments } from "@/modules/doctors/doctor-profile-policy";
import type { DoctorRecord } from "@/modules/doctors/doctor.types";

type DoctorProfileProps = {
  doctor: DoctorRecord;
  labels: {
    about: string;
    book: string;
    bookingDescription: string;
    bookingTitle: string;
    education: string;
    focusAreas: string;
    profile: string;
    registration: string;
    workingDays: string;
  };
  locale: Locale;
};

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20">
      <path d="m5 10 3 3 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export function DoctorProfile({ doctor, labels, locale }: DoctorProfileProps) {
  const canBook = canDoctorAcceptAppointments(doctor.id);
  const biography = getLocalizedText(doctor.biography, locale);
  const education = getLocalizedText(doctor.education, locale);
  const workingDays = getLocalizedText(doctor.workingDays, locale);

  return (
    <article data-testid="doctor-profile">
      <section className="overflow-hidden rounded-lg border border-[var(--line)] bg-white shadow-[0_28px_80px_-52px_rgba(7,48,71,0.5)] lg:grid lg:grid-cols-[minmax(20rem,0.86fr)_minmax(0,1.14fr)]">
        <div className="bg-[var(--aqua-light)] p-4 sm:p-6">
          <div className="relative min-h-[25rem] overflow-hidden rounded-lg border-4 border-white shadow-[0_24px_55px_-30px_rgba(7,48,71,0.65)] sm:min-h-[32rem] lg:h-full lg:min-h-[37rem]">
            <Image
              alt={getLocalizedText(doctor.imageAlt, locale)}
              className="object-cover object-top"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 42vw"
              src={doctor.image}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-center p-6 sm:p-9 lg:p-12">
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--teal-dark)]">
            <span aria-hidden="true" className="size-2 rounded-full bg-[var(--saffron)]" />
            {labels.profile}
          </p>
          <p className="mt-6 text-sm font-extrabold text-[var(--teal-dark)]">
            {getLocalizedText(doctor.title, locale)}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-balance text-[var(--primary-ink)] sm:text-5xl">
            <bdi>{getLocalizedText(doctor.name, locale)}</bdi>
          </h1>

          {getLocalizedText(doctor.qualification, locale) ? (
            <p className="mt-4 text-base font-bold leading-7 text-[var(--ink)]">
              <bdi>{getLocalizedText(doctor.qualification, locale)}</bdi>
            </p>
          ) : null}

          {getLocalizedText(doctor.registration, locale) ? (
            <dl className="mt-6 w-fit rounded-lg border border-[var(--line)] bg-[var(--aqua-light)] px-4 py-3">
              <dt className="text-[0.68rem] font-extrabold uppercase tracking-[0.1em] text-[var(--muted-text)]">
                {labels.registration}
              </dt>
              <dd className="mt-1 font-extrabold text-[var(--teal-dark)]">
                <bdi>{getLocalizedText(doctor.registration, locale)}</bdi>
              </dd>
            </dl>
          ) : null}

          <p className="mt-7 max-w-2xl text-pretty leading-8 text-[var(--muted-text)]">{biography}</p>
        </div>
      </section>

      <section className={`mt-8 grid items-start gap-6 ${canBook ? "lg:grid-cols-[minmax(0,1fr)_22rem]" : ""}`}>
        <div className={`grid gap-6 ${canBook ? "" : "mx-auto w-full max-w-4xl"}`}>
          <section className="rounded-lg border border-[var(--line)] bg-white p-6 shadow-[0_20px_50px_-42px_rgba(7,48,71,0.55)] sm:p-8">
            <h2 className="text-2xl font-extrabold tracking-[-0.025em] text-[var(--primary-ink)]">{labels.about}</h2>
            <p className="mt-4 max-w-3xl text-pretty leading-8 text-[var(--muted-text)]">{biography}</p>
          </section>

          {education ? (
            <section className="rounded-lg border border-[var(--line)] bg-[var(--aqua-light)] p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold tracking-[-0.025em] text-[var(--primary-ink)]">{labels.education}</h2>
              <p className="mt-4 leading-8 text-[var(--muted-text)]">{education}</p>
            </section>
          ) : null}

          {doctor.focusAreas.length > 0 ? (
            <section className="rounded-lg border border-[var(--line)] bg-white p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold tracking-[-0.025em] text-[var(--primary-ink)]">{labels.focusAreas}</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {doctor.focusAreas.map((focus) => (
                  <li
                    className="flex items-start gap-3 rounded-lg border border-[var(--line)] bg-[var(--aqua-light)] p-4 text-sm font-bold leading-6 text-[var(--ink)]"
                    key={getLocalizedText(focus, locale)}
                  >
                    <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-white text-[var(--teal-dark)] shadow-sm">
                      <CheckIcon />
                    </span>
                    {getLocalizedText(focus, locale)}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {workingDays ? (
            <section className="rounded-lg border border-[var(--line)] bg-white p-6 sm:p-8">
              <h2 className="text-lg font-extrabold text-[var(--primary-ink)]">{labels.workingDays}</h2>
              <p className="mt-2 leading-7 text-[var(--muted-text)]">{workingDays}</p>
            </section>
          ) : null}
        </div>

        {canBook ? (
          <aside className="rounded-lg bg-[var(--primary-ink)] p-6 text-white shadow-[0_24px_56px_-32px_rgba(7,48,71,0.72)] lg:sticky lg:top-28 sm:p-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--saffron)]">{labels.profile}</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.025em]">{labels.bookingTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-white/75">{labels.bookingDescription}</p>
            <div className="mt-6">
              <ButtonLink className="w-full justify-center" href={`/${locale}/book?dentist=${doctor.id}`} size="large" variant="secondary">
                {labels.book}
              </ButtonLink>
            </div>
          </aside>
        ) : null}
      </section>
    </article>
  );
}
