import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DemoNotice } from "@/components/content/demo-notice";
import { DentistCard } from "@/components/content/dentist-card";
import { FeaturedDoctorSection } from "@/components/content/featured-doctor-section";
import { ServicesCarousel } from "@/components/content/services-carousel";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { demoServices } from "@/content/demo-content";
import type { Locale } from "@/i18n/config";
import { listDoctors } from "@/modules/doctors/doctor.repository";

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
      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.86fr_1.14fr] lg:px-8 lg:py-20">
          <div className="relative z-10">
            <p className="inline-flex rounded-full bg-[var(--aqua-soft)] px-4 py-2 text-xs font-extrabold tracking-[0.12em] text-[var(--teal-dark)] uppercase">
              {home("eyebrow")}
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl leading-[1.06] font-extrabold tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl">
              {home("title")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted-text)]">
              {home("description")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/${locale}/book`}>{home("book")}</ButtonLink>
              <ButtonLink href={`/${locale}/services`} variant="secondary">
                {home("explore")}
              </ButtonLink>
            </div>
            <p className="mt-8 border-s-2 border-[var(--saffron)] ps-4 text-sm font-bold text-[var(--muted-text)]">
              <bdi>{home("location")}</bdi>
            </p>
          </div>

          <div className="relative pb-4 pe-4">
            <div
              aria-hidden="true"
              className="absolute inset-x-5 -bottom-1 top-5 rounded-[2.5rem_2.5rem_2.5rem_0.75rem] bg-[var(--teal)] rtl:rounded-[2.5rem_2.5rem_0.75rem_2.5rem]"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem_2.5rem_2.5rem_0.75rem] bg-[var(--aqua)] rtl:rounded-[2.5rem_2.5rem_0.75rem_2.5rem]">
              <Image
                alt={
                  locale === "ur"
                    ? "ڈینٹل کلینک میں مریض اور نگہداشت فراہم کرنے والے کی مصنوعی تصویر"
                    : "Synthetic image of a patient speaking with a dental care professional"
                }
                className="object-cover object-center"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 56vw"
                src="/images/demo/clinic-hero.webp"
              />
            </div>
            <span className="absolute end-0 top-6 rounded-s-2xl bg-white px-4 py-3 text-xs font-extrabold text-[var(--teal-dark)] shadow-lg">
              {home("demoTitle")}
            </span>
          </div>
        </div>
      </section>

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

      <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-6 lg:px-8">
        <DemoNotice
          description={home("demoDescription")}
          title={home("demoTitle")}
        />
      </div>

      <section className="content-auto mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <SectionHeading
            description={home("servicesDescription")}
            eyebrow={home("servicesEyebrow")}
            title={home("servicesTitle")}
          />
          <ButtonLink href={`/${locale}/services`} variant="secondary">
            {home("viewServices")}
          </ButtonLink>
        </div>
        <div className="mt-10">
          <ServicesCarousel
            labels={{
              book: services("book"),
              duration: services("duration"),
              minutes: services("minutes"),
              next: home("nextService"),
              pause: home("pauseServices"),
              previous: home("previousService"),
              resume: home("resumeServices"),
            }}
            locale={locale}
            services={demoServices}
          />
        </div>
      </section>

      <section className="content-auto bg-[var(--aqua-soft)] py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2.25rem] bg-white shadow-[0_24px_70px_-42px_rgba(18,48,53,0.48)]">
            <Image
              alt={
                locale === "ur"
                  ? "صاف اور روشن ڈینٹل ٹریٹمنٹ روم کی مصنوعی تصویر"
                  : "Synthetic image of a clean, bright dental treatment room"
              }
              className="object-cover"
              fill
              sizes="(max-width: 1023px) 100vw, 45vw"
              src="/images/demo/care-room.webp"
            />
          </div>
          <div>
            <SectionHeading
              description={home("careDescription")}
              eyebrow={home("careEyebrow")}
              title={home("careTitle")}
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                [home("careOneTitle"), home("careOneDescription")],
                [home("careTwoTitle"), home("careTwoDescription")],
                [home("careThreeTitle"), home("careThreeDescription")],
              ].map(([title, description]) => (
                <article className="rounded-3xl bg-white p-5" key={title}>
                  <div className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-2 block size-2.5 shrink-0 rounded-full bg-[var(--saffron)]"
                    />
                    <div>
                      <h3 className="font-extrabold">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[var(--muted-text)]">
                        {description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

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

      <section className="content-auto border-y border-[var(--line)] bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow={home("stepsEyebrow")}
            title={home("stepsTitle")}
          />
          <ol className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
            {[home("stepOne"), home("stepTwo"), home("stepThree")].map(
              (step, index) => (
                <li
                  className="rounded-3xl border border-[var(--line)] bg-[var(--mineral)] p-6"
                  key={step}
                >
                  <span className="grid size-10 place-items-center rounded-full bg-[var(--teal)] font-extrabold text-white">
                    <bdi>{index + 1}</bdi>
                  </span>
                  <p className="mt-5 text-lg font-extrabold">{step}</p>
                </li>
              ),
            )}
          </ol>
        </div>
      </section>

      <section className="content-auto mx-auto grid max-w-7xl gap-6 px-5 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <article className="rounded-[2rem] bg-[var(--teal)] p-7 text-white sm:p-9">
          <p className="text-sm font-extrabold text-white/80">
            {home("locationLabel")}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.035em]">
            <bdi>{home("location")}</bdi>
          </h2>
          <p className="mt-4 leading-7 text-white/85">
            {home("locationDescription")}
          </p>
        </article>
        <article className="rounded-[2rem] border border-[var(--line)] bg-white p-7 sm:p-9">
          <p className="text-sm font-extrabold text-[var(--danger)]">
            {home("urgentLabel")}
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.025em]">
            {home("urgentTitle")}
          </h2>
          <p className="mt-4 leading-7 text-[var(--muted-text)]">
            {home("urgentDescription")}
          </p>
        </article>
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
