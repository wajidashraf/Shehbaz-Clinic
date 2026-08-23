import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { clinicConfig } from "@/config/public-config";

const translations = {
  en: {
    Metadata: {
      title: "Shahbaz Dental Clinic | Dentist in Samundri, Faisalabad",
      description:
        "Visit Shahbaz Dental Clinic in Samundri, District Faisalabad for dentist consultations, dental treatment, and help with common dental problems. Book an appointment online.",
      keywords:
        "dental clinic, dentist, dental doctor, dental treatment, dental problems, Samundri, Faisalabad",
    },
  },
  ur: {
    Metadata: {
      title: "شہباز ڈینٹل کلینک | سمندری، فیصل آباد میں دانتوں کا ڈاکٹر",
      description:
        "سمندری، ضلع فیصل آباد میں شہباز ڈینٹل کلینک سے دانتوں کے ڈاکٹر کا مشورہ، علاج اور عام دانتوں کے مسائل میں مدد حاصل کریں۔ آن لائن اپائنٹمنٹ بک کریں۔",
      keywords:
        "ڈینٹل کلینک, دانتوں کا ڈاکٹر, دانتوں کا علاج, دانتوں کے مسائل, سمندری, فیصل آباد",
    },
  },
} as const;

vi.mock("next-intl", () => ({
  hasLocale: (locales: readonly string[], locale: string) =>
    locales.includes(locale),
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("next-intl/server", () => ({
  getMessages: vi.fn(async () => ({})),
  getTranslations: vi.fn(
    async (
      input?:
        string | { locale?: keyof typeof translations; namespace?: "Metadata" },
    ) => {
      const locale =
        typeof input === "object" && input.locale ? input.locale : "en";
      const namespace = typeof input === "object" ? input.namespace : input;

      return (key: string) => {
        if (namespace === "Metadata") {
          return translations[locale].Metadata[
            key as keyof (typeof translations)[typeof locale]["Metadata"]
          ];
        }

        return key;
      };
    },
  ),
  setRequestLocale: vi.fn(),
}));

vi.mock("@/components/layout/site-footer", () => ({
  SiteFooter: () => null,
}));
vi.mock("@/components/layout/site-header", () => ({
  SiteHeader: () => null,
}));
vi.mock("@/components/layout/whatsapp-chat", () => ({
  WhatsAppChat: () => null,
}));

import LocaleLayout, { generateMetadata } from "@/app/[locale]/layout";

describe("localized layout metadata", () => {
  it.each(["en", "ur"] as const)(
    "generates the complete %s metadata from locale translations",
    async (locale) => {
      const metadata = await generateMetadata({
        children: null,
        params: Promise.resolve({ locale }),
      });

      expect(metadata).toMatchObject({
        title: translations[locale].Metadata.title,
        description: translations[locale].Metadata.description,
        keywords: translations[locale].Metadata.keywords.split(", "),
        alternates: {
          canonical: `https://shahbazdental.com/${locale}`,
          languages: {
            en: "https://shahbazdental.com/en",
            ur: "https://shahbazdental.com/ur",
            "x-default": "https://shahbazdental.com/en",
          },
        },
        openGraph: {
          url: `https://shahbazdental.com/${locale}`,
          images: ["/images/demo/dentalRoom.avif"],
        },
        twitter: {
          card: "summary_large_image",
          images: ["/images/demo/dentalRoom.avif"],
        },
      });
    },
  );

  it("renders escaped clinic JSON-LD in the localized layout", async () => {
    const mutableClinicConfig = clinicConfig as { name: string };
    const originalName = mutableClinicConfig.name;
    mutableClinicConfig.name = "Shahbaz < Dental Clinic";

    const layout = await LocaleLayout({
      children: <main id="main-content">Home</main>,
      params: Promise.resolve({ locale: "ur" }),
    });
    const { container } = render(layout);

    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).toHaveTextContent("Shahbaz \\u003c Dental Clinic");
    expect(script?.textContent).toContain('"inLanguage":"ur"');
    expect(script?.textContent).toContain(
      '"url":"https://shahbazdental.com/ur"',
    );

    mutableClinicConfig.name = originalName;
  });
});

afterEach(() => {
  vi.clearAllMocks();
});
