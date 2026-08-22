import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClinicContactSection } from "@/components/content/clinic-contact-section";
import { DentistsCarousel } from "@/components/content/dentists-carousel";
import { FeaturedDoctorSection } from "@/components/content/featured-doctor-section";
import { ServicesCarousel } from "@/components/content/services-carousel";
import { UrgentHelpSection } from "@/components/content/urgent-help-section";
import { HeroSection } from "@/components/layout/HeroSection";
import { TestimonialsSection } from "@/components/layout/testimonials-section";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { demoServices } from "@/content/demo-content";
import type { Locale } from "@/i18n/config";
import { listDoctors } from "@/modules/doctors/doctor.repository";
import { listPublishedTestimonials } from "@/modules/testimonials/testimonial.repository";
export const dynamic = "force-dynamic";

type HomePageProps = { params: Promise<{ locale: Locale }> };

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [home, services, dentists, doctorRecords, testimonials] =
    await Promise.all([
      getTranslations("Home"),
      getTranslations("Services"),
      getTranslations("Dentists"),
      listDoctors(),
      listPublishedTestimonials(),
    ]);
  const featuredDoctor = doctorRecords.find((doctor) => doctor.isFeatured);

  return (
    <main id="main-content">
      <HeroSection home={home} locale={locale} />

      {featuredDoctor ? (
        <FeaturedDoctorSection
          doctor={featuredDoctor}
          labels={{
            eyebrow: home("featuredDoctorEyebrow"),
            focus: home("featuredDoctorFocus"),
            heading: home("featuredDoctorHeading"),
            pause: home("pauseGallery"),
            resume: home("resumeGallery"),
            specialty: home("featuredDoctorSpecialty"),
            subheading: home("featuredDoctorDescription"),
            viewProfile: home("viewProfile"),
          }}
          locale={locale}
        />
      ) : null}

      <section
        className="relative scroll-mt-28 overflow-hidden bg-[var(--aqua-light)] py-20 sm:py-24 lg:py-28"
        id="services"
      >
        {/* Background effects */}
        <div
          aria-hidden="true"
          className="
          pointer-events-none
          absolute -start-48 top-12
          size-[30rem]
          rounded-full
          bg-cyan-400/10
          blur-3xl
        "
        />

        <div
          aria-hidden="true"
          className="
          pointer-events-none
          absolute -end-52 bottom-[-10rem]
          size-[34rem]
          rounded-full
          bg-[var(--teal)]/10
          blur-3xl
        "
        />

        <div
          aria-hidden="true"
          className="
          pointer-events-none
          absolute left-1/2 top-0
          h-px w-[70%]
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-white/15
          to-transparent
        "
        />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
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
                book: services("viewDetails"),
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

      <section
        className="scroll-mt-28 bg-white py-20 sm:py-24 lg:py-28"
        id="dentists"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
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
          <div className="mt-10">
            <DentistsCarousel
              dentists={doctorRecords}
              labels={{
                carousel: home("dentistsCarousel"),
                demoBadge: dentists("demoBadge"),
                next: home("nextDentist"),
                previous: home("previousDentist"),
                viewProfile: dentists("viewProfile"),
              }}
              locale={locale}
            />
          </div>
        </div>
      </section>

      <TestimonialsSection
        labels={{
          book: home("testimonialsBook"),
          description: home("testimonialsDescription"),
          eyebrow: home("testimonialsEyebrow"),
          heading: home("testimonialsTitle"),
          next: home("nextTestimonial"),
          pause: home("pauseTestimonials"),
          pointOne: home("testimonialsPointOne"),
          pointThree: home("testimonialsPointThree"),
          pointTwo: home("testimonialsPointTwo"),
          previous: home("previousTestimonial"),
          resume: home("resumeTestimonials"),
        }}
        locale={locale}
        testimonials={testimonials}
      />

      <ClinicContactSection
        labels={{
          address: home("clinicAddress"),
          addressLabel: home("addressLabel"),
          book: home("book"),
          daily: home("daily"),
          description: home("contactDescription"),
          directions: home("getDirections"),
          eyebrow: home("contactEyebrow"),
          hoursLabel: home("hoursLabel"),
          mapTitle: home("mapTitle"),
          phoneLabel: home("phoneLabel"),
          title: home("contactTitle"),
        }}
        locale={locale}
      />

      <UrgentHelpSection
        labels={{
          action: home("callNow"),
          description: home("urgentDescription"),
          eyebrow: home("urgentLabel"),
          title: home("urgentTitle"),
        }}
      />

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[var(--teal-dark)]">
            {home("finalEyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[var(--primary-ink)] sm:text-4xl">
            {home("finalTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[var(--muted-text)]">
            {home("finalDescription")}
          </p>
          <ButtonLink className="mt-7" href={`/${locale}/book`} size="large">
            {home("finalAction")}
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
