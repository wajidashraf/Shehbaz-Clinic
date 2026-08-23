import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClinicContactSection } from "@/components/content/clinic-contact-section";
import { FeaturedDoctorSection } from "@/components/content/featured-doctor-section";
import { ServicesCarousel } from "@/components/content/services-carousel";
import { UrgentHelpSection } from "@/components/content/urgent-help-section";
import { HeroSection } from "@/components/layout/HeroSection";
import { TestimonialsSection } from "@/components/layout/testimonials-section";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { demoServices } from "@/content/demo-content";
import { featuredHomepageDentist } from "@/content/homepage-content";
import type { Locale } from "@/i18n/config";
import { ClinicHighlights } from "@/components/ui/ClinicHighlights";
import { AboutSection } from "@/components/ui/about-section";
import { PatientTrustSection } from "@/components/ui/patient-trust-section";
import { FaqSection } from "@/components/ui/faq-section";
export const dynamic = "force-static";

type HomePageProps = { params: Promise<{ locale: Locale }> };

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const home = await getTranslations("Home");

  return (
    <main id="main-content">
      <HeroSection home={home} locale={locale} />
      <ClinicHighlights locale={locale} />
      <AboutSection locale={locale} />

      <FeaturedDoctorSection doctor={featuredHomepageDentist} locale={locale} />

      {/* Services carusel */}
      <section
        id="services"
        className="
        scroll-mt-28
        bg-[var(--aqua-light)]
        py-16
        sm:py-20
        lg:py-24
      "
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-7">
            <SectionHeading
              description={home("servicesDescription")}
              eyebrow={home("servicesEyebrow")}
              title={home("servicesTitle")}
            />
          </div>

          <div className="mt-10 lg:mt-12">
            <ServicesCarousel locale={locale} services={demoServices} />
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <PatientTrustSection />
      <FaqSection />

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
