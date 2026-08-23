import { describe, expect, it } from "vitest";

import {
  buildClinicMetadata,
  clinicJsonLd,
  languageAlternates,
  localizedHomeUrl,
  serializeJsonLd,
  SITE_URL,
} from "@/config/seo";

const englishCopy = {
  description:
    "Visit Shahbaz Dental Clinic in Samundri, District Faisalabad for dentist consultations, dental treatment, and help with common dental problems.",
  keywords: [
    "dental clinic",
    "dentist",
    "dental doctor",
    "dental treatment",
    "dental problems",
    "Samundri",
    "Faisalabad",
  ],
  title: "Shahbaz Dental Clinic | Dentist in Samundri, Faisalabad",
};

const urduCopy = {
  description:
    "سمندری، ضلع فیصل آباد میں شہباز ڈینٹل کلینک سے دانتوں کے ڈاکٹر کا مشورہ، علاج اور عام دانتوں کے مسائل میں مدد حاصل کریں۔",
  keywords: [
    "ڈینٹل کلینک",
    "دانتوں کا ڈاکٹر",
    "دانتوں کا علاج",
    "دانتوں کے مسائل",
    "سمندری",
    "فیصل آباد",
  ],
  title: "شہباز ڈینٹل کلینک | سمندری، فیصل آباد میں دانتوں کا ڈاکٹر",
};

describe("production SEO helpers", () => {
  it("uses the one production origin and exact localized home URLs", () => {
    expect(SITE_URL).toEqual(new URL("https://shahbazdental.com"));
    expect(localizedHomeUrl("en")).toBe("https://shahbazdental.com/en");
    expect(localizedHomeUrl("ur")).toBe("https://shahbazdental.com/ur");
    expect(languageAlternates).toEqual({
      en: "https://shahbazdental.com/en",
      ur: "https://shahbazdental.com/ur",
      "x-default": "https://shahbazdental.com/en",
    });
  });

  it.each([
    ["en", englishCopy, "en_PK"],
    ["ur", urduCopy, "ur_PK"],
  ] as const)(
    "builds complete localized metadata for %s",
    (locale, copy, openGraphLocale) => {
      const metadata = buildClinicMetadata(locale, copy);

      expect(metadata).toMatchObject({
        metadataBase: SITE_URL,
        title: copy.title,
        description: copy.description,
        keywords: copy.keywords,
        alternates: {
          canonical: localizedHomeUrl(locale),
          languages: languageAlternates,
        },
        robots: { index: true, follow: true },
        openGraph: {
          type: "website",
          url: localizedHomeUrl(locale),
          locale: openGraphLocale,
          images: ["/images/demo/dentalRoom.avif"],
        },
        twitter: {
          card: "summary_large_image",
          images: ["/images/demo/dentalRoom.avif"],
        },
        other: { google: "notranslate" },
      });
    },
  );

  it("keeps JSON-LD limited to verified clinic facts", () => {
    const jsonLd = clinicJsonLd("ur");

    expect(jsonLd).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Dentist",
      name: "Shahbaz Dental Clinic",
      url: "https://shahbazdental.com/ur",
      telephone: "+92 344 3420001",
      image: "https://shahbazdental.com/images/demo/dentalRoom.avif",
      inLanguage: "ur",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Circular Road near Ahle Hadees Masjid, Samundri",
        addressLocality: "Samundri",
        addressRegion: "Faisalabad, Punjab",
        postalCode: "37300",
        addressCountry: "Pakistan",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 31.0613673,
        longitude: 72.9608833,
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
    });
    expect(jsonLd).not.toHaveProperty("aggregateRating");
    expect(jsonLd).not.toHaveProperty("review");
    expect(jsonLd).not.toHaveProperty("priceRange");
    expect(jsonLd).not.toHaveProperty("email");
    expect(jsonLd).not.toHaveProperty("sameAs");
  });

  it("serializes JSON-LD safely for an inline script", () => {
    expect(serializeJsonLd({ name: "Clinic <script>" })).toBe(
      '{"name":"Clinic \\u003cscript>"}',
    );
  });
});
