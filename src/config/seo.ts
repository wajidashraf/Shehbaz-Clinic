import type { Metadata } from "next";

import { clinicConfig } from "@/config/public-config";
import type { Locale } from "@/i18n/config";

export const SITE_URL = new URL("https://shahbazdental.com");

const socialImage = "/images/demo/dentalRoom.avif";

export function localizedHomeUrl(locale: Locale) {
  return new URL(`/${locale}`, SITE_URL).toString().replace(/\/$/, "");
}

export const languageAlternates = {
  en: localizedHomeUrl("en"),
  ur: localizedHomeUrl("ur"),
  "x-default": localizedHomeUrl("en"),
};

type LocaleMetadataCopy = {
  description: string;
  keywords: string[];
  title: string;
};

export function buildClinicMetadata(
  locale: Locale,
  copy: LocaleMetadataCopy,
): Metadata {
  const canonicalUrl = localizedHomeUrl(locale);

  return {
    metadataBase: SITE_URL,
    title: copy.title,
    description: copy.description,
    keywords: copy.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: clinicConfig.name,
      title: copy.title,
      description: copy.description,
      locale: locale === "ur" ? "ur_PK" : "en_PK",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [socialImage],
    },
    other: {
      google: "notranslate",
    },
  };
}

export function clinicJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: clinicConfig.name,
    url: localizedHomeUrl(locale),
    telephone: clinicConfig.phone,
    image: new URL(socialImage, SITE_URL).toString(),
    inLanguage: locale,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinicConfig.streetAddress,
      addressLocality: clinicConfig.location.city,
      addressRegion: `${clinicConfig.location.district}, ${clinicConfig.location.province}`,
      postalCode: clinicConfig.location.postalCode,
      addressCountry: clinicConfig.location.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: clinicConfig.coordinates.latitude,
      longitude: clinicConfig.coordinates.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "20:00",
    },
  };
}

export function serializeJsonLd(
  data: ReturnType<typeof clinicJsonLd> | object,
) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
