import { getTranslations, setRequestLocale } from "next-intl/server";
import { DentistCard } from "@/components/content/dentist-card";
import { FeaturedDoctorSection } from "@/components/content/featured-doctor-section";
import { ServicesCarousel } from "@/components/content/services-carousel";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { demoServices } from "@/content/demo-content";
import type { Locale } from "@/i18n/config";
import { listDoctors } from "@/modules/doctors/doctor.repository";
import { HeroSection } from "@/components/layout/HeroSection";
import { BookingStepsSection } from "@/components/ui/BookingSteps";
 import Link from "next/link";

export const dynamic = "force-dynamic";

type HomePageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [home, services, dentistsTranslations, dentistRecords] =
    await Promise.all([
      getTranslations("Home"),
      getTranslations("Services"),
      getTranslations("Dentists"),
      listDoctors(),
    ]);
  const featuredDoctor = dentistRecords.find((doctor) => doctor.isFeatured);

  return (
    <main id="main-content">
      <HeroSection locale={locale} home={home} />

      {featuredDoctor ? (
        <FeaturedDoctorSection
          doctor={featuredDoctor}
          key={featuredDoctor.id}
          labels={{
            book: dentistsTranslations("book"),
            eyebrow: home("featuredDoctorEyebrow"),
            heading: home("featuredDoctorHeading"),
            pause: home("pauseGallery"),
            resume: home("resumeGallery"),
            subheading: home("featuredDoctorDescription"),
            workingHours: home("workingHours"),
          }}
          locale={locale}
        />
      ) : null}

      <section
        className="
    content-auto
    relative
    isolate
    w-full
    overflow-hidden

    bg-[linear-gradient(135deg,#f5fbfc_0%,#edf7f9_48%,#f8fcfd_100%)]
  "
      >
        {/* Soft neutral glow - left */}
        <div
          aria-hidden="true"
          className="
      pointer-events-none
      absolute
      -start-40
      top-8
      -z-10

      size-[32rem]

      rounded-full

      bg-[var(--line-strong)]

      opacity-[0.16]

      blur-3xl
    "
        />

        {/* Soft teal glow - right */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -end-48
            bottom-0
            -z-10
            size-[34rem]
            rounded-full
            bg-[var(--teal)]
            opacity-[0.06]
            blur-3xl
          "
        />

        {/* White center highlight */}
        <div
          aria-hidden="true"
          className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          -z-10
          h-[28rem]
          w-[72%]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/55
          blur-3xl
        "
        />

        {/* Main content */}
        <div
          className="
          relative
          mx-auto
          max-w-7xl
          px-5
          py-20
          sm:px-6
          lg:px-8
          lg:py-28
        "
        >
          {/* Heading */}
          <div
            className="
            flex
            flex-col
            justify-between
            gap-7
            md:flex-row
            md:items-end
          "
          >
            <SectionHeading
              description={home("servicesDescription")}
              eyebrow={home("servicesEyebrow")}
              title={home("servicesTitle")}
            />

            <ButtonLink href={`/${locale}/services`} variant="secondary">
              {home("viewServices")}
            </ButtonLink>
          </div>

          {/* Carousel */}
          <div className="mt-10">
            <ServicesCarousel
              labels={{
                book: services("book"),
                duration: services("duration"),
                minutes: services("minutes"),
                next: home("nextService"),
                previous: home("previousService"),
              }}
              locale={locale}
              services={demoServices}
            />
          </div>
        </div>
      </section>

      {/* Map */}


<section className="relative overflow-hidden bg-[linear-gradient(135deg,#f7fbfc_0%,#eef8fa_48%,#ffffff_100%)] py-20 lg:py-28">
  {/* Ambient background */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute -start-32 top-8 size-[26rem] rounded-full bg-[var(--aqua-soft)] opacity-80 blur-3xl"
  />

  <div
    aria-hidden="true"
    className="pointer-events-none absolute -end-24 bottom-0 size-[24rem] rounded-full bg-[var(--teal)] opacity-[0.06] blur-3xl"
  />

  <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14 lg:px-8">
    {/* Left: Contact information */}
    <div>
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--teal-dark)]">
        {locale === "ur" ? "رابطہ" : "Contact Information"}
      </p>

      <h2 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-[var(--ink)] sm:text-4xl">
        {locale === "ur"
          ? "ہم تک آسانی سے پہنچیں"
          : "Visit Shahbaz Dental Clinic with Ease"}
      </h2>

      <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted-text)]">
        {locale === "ur"
          ? "کلینک کا مقام، رابطہ نمبر، اور اوقاتِ کار ایک ہی جگہ دیکھیں۔"
          : "Find our clinic location, contact number, and opening hours in one place."}
      </p>

      <div className="mt-8 grid gap-4">
        {/* Phone */}
        <article className="rounded-[1.75rem] border border-[var(--line)] bg-white/85 p-5 shadow-[0_18px_50px_-35px_rgba(18,48,53,0.22)] backdrop-blur-sm sm:p-6">
          <div className="flex items-start gap-4">
            <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-[var(--aqua-soft)] text-[var(--teal-dark)]">
              <svg
                aria-hidden="true"
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.6 2.6.7A2 2 0 0 1 22 16.9Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </span>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--muted-text)]">
                {locale === "ur" ? "فون نمبر" : "Phone Number"}
              </p>

              <a
                className="mt-1 block text-2xl font-extrabold tracking-[-0.02em] text-[var(--ink)] transition-colors hover:text-[var(--teal-dark)]"
                href="tel:+923443420001"
              >
                +92 344 3420001
              </a>
            </div>
          </div>
        </article>

        {/* Address */}
        <article className="rounded-[1.75rem] border border-[var(--line)] bg-white/85 p-5 shadow-[0_18px_50px_-35px_rgba(18,48,53,0.22)] backdrop-blur-sm sm:p-6">
          <div className="flex items-start gap-4">
            <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-[var(--aqua-soft)] text-[var(--teal-dark)]">
              <svg
                aria-hidden="true"
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="12"
                  cy="9"
                  r="2.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </span>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--muted-text)]">
                {locale === "ur" ? "مقام" : "Location"}
              </p>

              <p className="mt-1 text-xl font-extrabold leading-tight tracking-[-0.02em] text-[var(--ink)]">
                {locale === "ur"
                  ? "سرکلر روڈ، اہلے حدیث مسجد کے قریب، سمندری، فیصل آباد، پنجاب، پاکستان"
                  : "Circular Road near Ahle Hadees Masjid, Samundri, Faisalabad, Punjab, Pakistan"}
              </p>
            </div>
          </div>
        </article>

        {/* Opening Hours */}
        <article className="rounded-[1.75rem] border border-[var(--line)] bg-white/85 p-5 shadow-[0_18px_50px_-35px_rgba(18,48,53,0.22)] backdrop-blur-sm sm:p-6">
          <div className="flex items-start gap-4">
            <span className="grid size-13 shrink-0 place-items-center rounded-2xl bg-[var(--aqua-soft)] text-[var(--teal-dark)]">
              <svg
                aria-hidden="true"
                className="size-6"
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
            </span>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--muted-text)]">
                {locale === "ur" ? "اوقاتِ کار" : "Opening Hours"}
              </p>

              <p className="mt-1 text-xl font-extrabold tracking-[-0.02em] text-[var(--ink)]">
                9:00 AM – 8:00 PM
              </p>

              <p className="mt-1 text-sm font-semibold text-[var(--muted-text)]">
                {locale === "ur" ? "روزانہ" : "Daily"}
              </p>
            </div>
          </div>
        </article>
      </div>

      {/* CTA Row */}
      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--teal)] px-5 py-3 text-sm font-extrabold text-white shadow-[0_8px_24px_color-mix(in_srgb,var(--teal)_30%,transparent)] transition-[background-color,transform,box-shadow] duration-300 hover:-translate-y-px hover:bg-[var(--teal-dark)] hover:shadow-[0_12px_28px_color-mix(in_srgb,var(--teal)_38%,transparent)]"
          href="tel:+923443420001"
        >
          {locale === "ur" ? "ابھی کال کریں" : "Call Now"}
        </Link>

        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--line-strong)] bg-white px-5 py-3 text-sm font-extrabold text-[var(--ink)] transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-px hover:border-[var(--teal)] hover:bg-[var(--aqua-soft)] hover:text-[var(--teal-dark)]"
          href="https://www.google.com/maps/place/Shahbaz+Dental+Clinic/@31.0613673,72.9608833,17z"
          rel="noopener noreferrer"
          target="_blank"
        >
          {locale === "ur" ? "گوگل میپس میں کھولیں" : "Open in Google Maps"}
        </Link>
      </div>
    </div>

    {/* Right: Map */}
    <div
      className="
        relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/70 p-2 shadow-[0_28px_80px_-34px_rgba(18,48,53,0.30)] backdrop-blur-xl
      "
    >
      <div
        className="
          absolute inset-0 rounded-[2.25rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_100%)] pointer-events-none
        "
        aria-hidden="true"
      />

      <div className="relative overflow-hidden rounded-[1.8rem] border border-[var(--line)] bg-[var(--aqua-soft)]">
        <iframe
          allowFullScreen
          className="h-[420px] w-full md:h-[500px]"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3141.827692748456!2d72.95830837524394!3d31.061367274427404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3922f1a4d8da9c6d%3A0x41881ef246bc1cd9!2sShahbaz%20Dental%20Clinic!5e1!3m2!1sen!2s!4v1787335698364!5m2!1sen!2s"
          title="Shahbaz Dental Clinic location map"
        />
      </div>
    </div>
  </div>
</section>
      {/* Map */}

      <section className="content-auto mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <SectionHeading
            description={home("dentistsDescription")}
            eyebrow={home("dentistsEyebrow")}
            title={home("dentistsTitle")}
          />
          <ButtonLink href={`/${locale}/dentists`} variant="secondary">
            {home("viewDentists")}
          </ButtonLink>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {dentistRecords.map((dentist) => (
            <DentistCard
              dentist={dentist}
              key={dentist.id}
              labels={{
                book: dentistsTranslations("book"),
                demoBadge: dentistsTranslations("demoBadge"),
                languages: dentistsTranslations("languages"),
                workingDays: dentistsTranslations("workingDays"),
              }}
              locale={locale}
            />
          ))}
        </div>
      </section>

      <BookingStepsSection
        locale={locale}
        eyebrow={home("stepsEyebrow")}
        title={home("stepsTitle")}
        steps={{
          one: home("stepOne"),
          two: home("stepTwo"),
          three: home("stepThree"),
        }}
        descriptions={{
          one: "stepOneDesc",
          two: "stepTwoDesc",
          three: "stepThreeDesc",
        }}
      />

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f6fbfc_0%,#eef8fa_50%,#ffffff_100%)]">
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -start-32 top-10 size-[28rem] rounded-full bg-[var(--aqua-soft)] opacity-70 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-32 bottom-0 size-[24rem] rounded-full bg-[var(--teal)] opacity-[0.05] blur-3xl"
        />

        <div className="content-auto relative mx-auto grid max-w-7xl gap-6 px-5 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          {/* Location Card */}
          <article
            className="
        group
        relative
        overflow-hidden

        rounded-[2rem]

        border
        border-[color-mix(in_srgb,var(--teal)_18%,white)]

        bg-white/80

        p-7

        shadow-[0_24px_70px_-35px_rgba(15,118,110,0.35)]

        backdrop-blur-xl

        transition-all
        duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]

        hover:-translate-y-1
        hover:shadow-[0_32px_80px_-35px_rgba(15,118,110,0.45)]

        sm:p-9
      "
          >
            {/* Accent */}
            <div
              aria-hidden="true"
              className="
          absolute
          inset-x-0
          top-0
          h-1

          bg-gradient-to-r
          from-[var(--teal)]
          via-[var(--aqua)]
          to-transparent
        "
            />

            <div className="flex items-start justify-between gap-5">
              <div>
                <p
                  className="
              text-xs
              font-extrabold
              uppercase
              tracking-[0.16em]
              text-[var(--teal-dark)]
            "
                >
                  {home("locationLabel")}
                </p>

                <h2
                  className="
              mt-4
              text-3xl
              leading-tight
              font-extrabold
              tracking-[-0.04em]
              text-[var(--ink)]

              sm:text-4xl
            "
                >
                  <bdi>{home("location")}</bdi>
                </h2>
              </div>

              {/* Location Icon */}
              <span
                className="
            grid
            size-14
            shrink-0
            place-items-center

            rounded-2xl

            bg-[var(--aqua-soft)]

            text-[var(--teal-dark)]

            transition-transform
            duration-500

            group-hover:scale-110
          "
              >
                <svg
                  aria-hidden="true"
                  className="size-7"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <circle
                    cx="12"
                    cy="9"
                    r="2.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>
            </div>

            <p
              className="
          mt-5
          max-w-xl
          leading-7
          text-[var(--muted-text)]
        "
            >
              <bdi>{home("locationDescription")}</bdi>
            </p>

            {/* Small trust row */}
            <div
              className="
          mt-7
          flex
          flex-wrap
          gap-3
        "
            >
              <span
                className="
            rounded-full
            bg-[var(--aqua-soft)]
            px-4
            py-2

            text-xs
            font-bold

            text-[var(--teal-dark)]
          "
              >
                Easy Access
              </span>

              <span
                className="
            rounded-full
            bg-slate-50
            px-4
            py-2

            text-xs
            font-bold

            text-[var(--muted-text)]
          "
              >
                Patient Friendly
              </span>
            </div>
          </article>

          {/* Emergency Card */}
          <article
            className="
        group
        relative

        overflow-hidden

        rounded-[2rem]

        border
        border-[color-mix(in_srgb,var(--danger)_15%,white)]

        bg-white

        p-7

        shadow-[0_20px_60px_-35px_rgba(220,38,38,0.28)]

        transition-all
        duration-500

        hover:-translate-y-1

        hover:shadow-[0_30px_70px_-35px_rgba(220,38,38,0.38)]

        sm:p-9
      "
          >
            {/* Red accent */}
            <div
              aria-hidden="true"
              className="
          absolute
          inset-x-0
          top-0
          h-1

          bg-gradient-to-r
          from-red-500
          via-red-400
          to-transparent
        "
            />

            <div className="flex items-start justify-between gap-5">
              <div>
                <p
                  className="
              text-xs
              font-extrabold

              uppercase

              tracking-[0.16em]

              text-[var(--danger)]
            "
                >
                  {home("urgentLabel")}
                </p>

                <h2
                  className="
              mt-4

              text-3xl

              leading-tight

              font-extrabold

              tracking-[-0.035em]

              text-[var(--ink)]
            "
                >
                  {home("urgentTitle")}
                </h2>
              </div>

              {/* Emergency Icon */}
              <span
                className="
            grid
            size-14

            shrink-0

            place-items-center

            rounded-2xl

            bg-red-50

            text-[var(--danger)]

            transition-transform
            duration-500

            group-hover:scale-110
          "
              >
                <svg
                  aria-hidden="true"
                  className="size-7"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 8v5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  <circle cx="12" cy="17" r="1" fill="currentColor" />

                  <path
                    d="M10.3 3.8 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>
            </div>

            <p
              className="
          mt-5
          leading-7
          text-[var(--muted-text)]
        "
            >
              {home("urgentDescription")}
            </p>

            <div
              className="
          mt-7

          flex

          items-center

          gap-3

          rounded-2xl

          bg-red-50

          px-5

          py-4
        "
            >
              <span
                className="
            size-3
            rounded-full
            bg-red-500
            animate-pulse
          "
              />

              <span
                className="
            text-sm
            font-bold
            text-red-700
          "
              >
                Available for urgent dental concerns
              </span>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-[var(--aqua)] py-16 sm:py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-7 px-5 sm:px-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-extrabold tracking-[0.16em] text-[var(--teal-dark)] uppercase">
              {home("finalEyebrow")}
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
              {home("finalTitle")}
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-[var(--muted-text)]">
              {home("finalDescription")}
            </p>
          </div>
          <ButtonLink href={`/${locale}/book`}>
            {home("finalAction")}
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
