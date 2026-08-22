import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/content/service-detail";
import {
  demoServices,
  findDemoService,
  getLocalizedText,
  getRelatedDemoServices,
} from "@/content/demo-content";
import type { Locale } from "@/i18n/config";

type ServiceDetailPageProps = {
  params: Promise<{ locale: Locale; serviceId: string }>;
};

export function generateStaticParams() {
  return demoServices.map((service) => ({ serviceId: service.id }));
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { locale, serviceId } = await params;
  const service = findDemoService(serviceId);
  if (!service) return {};

  return {
    title: `${getLocalizedText(service.name, locale)} | Shahbaz Dental Clinic`,
    description: getLocalizedText(service.summary, locale),
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { locale, serviceId } = await params;
  const service = findDemoService(serviceId);
  if (!service) notFound();

  setRequestLocale(locale);
  const translations = await getTranslations("Services");

  return (
    <main id="main-content">
      <ServiceDetail
        labels={{
          back: translations("backToServices"),
          book: translations("book"),
          bookingDescription: translations("bookingDescription"),
          bookingTitle: translations("bookingTitle"),
          clinicalNote: translations("clinicalNote"),
          duration: translations("duration"),
          minutes: translations("minutes"),
          overview: translations("overview"),
          related: translations("relatedServices"),
          suitableFor: translations("suitableFor"),
          viewDetails: translations("viewDetails"),
          whatToExpect: translations("whatToExpect"),
        }}
        locale={locale}
        relatedServices={getRelatedDemoServices(service.id)}
        service={service}
      />
    </main>
  );
}
