import "@fontsource-variable/manrope";
import "@fontsource-variable/noto-sans-arabic";
import "../globals.css";

import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppChat } from "@/components/layout/whatsapp-chat";
import {
  buildClinicMetadata,
  clinicJsonLd,
  serializeJsonLd,
} from "@/config/seo";
import { getDocumentLanguageAttributes, locales } from "@/i18n/config";
import { routing } from "@/i18n/routing";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    return {};
  }

  const translations = await getTranslations({
    locale,
    namespace: "Metadata",
  });

  return buildClinicMetadata(locale, {
    title: translations("title"),
    description: translations("description"),
    keywords: translations("keywords")
      .split(",")
      .map((keyword) => keyword.trim()),
  });
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const structuredData = serializeJsonLd(clinicJsonLd(locale));

  const [messages, navigation, footer, whatsapp] = await Promise.all([
    getMessages(),
    getTranslations("Navigation"),
    getTranslations("Footer"),
    getTranslations("WhatsApp"),
  ]);

  return (
    <html {...getDocumentLanguageAttributes(locale)}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Skip to main content */}
          <a
            className="
              fixed start-4 top-4 z-50
              -translate-y-24
              rounded-full
              bg-white
              px-4 py-3
              font-bold
              shadow-lg
              focus:translate-y-0
            "
            href="#main-content"
          >
            {locale === "ur" ? "مرکزی مواد پر جائیں" : "Skip to main content"}
          </a>

          {/* Header */}
          <SiteHeader
            labels={{
              about: navigation("about"),
              clinicName: navigation("clinicName"),
              primaryNavigation: navigation("primaryNavigation"),
              home: navigation("home"),
              services: navigation("services"),
              theDentist: navigation("theDentist"),
              reviews: navigation("reviews"),
              portfolio: navigation("portfolio"),
              contact: navigation("contact"),
              book: navigation("book"),
              call: navigation("call"),
              directions: navigation("directions"),
              mobileNavigation: navigation("mobileNavigation"),
              quickActions: navigation("quickActions"),
              whatsapp: navigation("whatsapp"),
              openDaily: navigation("openDaily"),
              address: navigation("address"),
              bookShort: navigation("bookShort"),
              switchLanguage: navigation("switchLanguage"),
              openMenu: navigation("openMenu"),
              closeMenu: navigation("closeMenu"),
            }}
            locale={locale}
          />

          {/* Page content */}
          {children}

          {/* Footer */}
          <SiteFooter
            labels={{
              about: footer("about"),
              addressLabel: footer("addressLabel"),
              daily: footer("daily"),
              contact: footer("contact"),
              hoursLabel: footer("hoursLabel"),
              quickLinks: footer("quickLinks"),
              reviews: footer("reviews"),
              rights: footer("rights"),
              serviceChildren: footer("serviceChildren"),
              serviceCleaning: footer("serviceCleaning"),
              serviceConsultation: footer("serviceConsultation"),
              serviceRootCanal: footer("serviceRootCanal"),
              summary: footer("summary"),
              locality: footer("locality"),
              services: footer("services"),
              theDentist: footer("theDentist"),
              book: footer("book"),
            }}
            locale={locale}
          />

          {/* WhatsApp */}
          <WhatsAppChat
            labels={{
              open: whatsapp("open"),
              close: whatsapp("close"),
              online: whatsapp("online"),
              welcome: whatsapp("welcome"),
              quickQuestions: whatsapp("quickQuestions"),
              bookAppointment: whatsapp("bookAppointment"),
              askTreatment: whatsapp("askTreatment"),
              clinicTimings: whatsapp("clinicTimings"),
              talkToTeam: whatsapp("talkToTeam"),
              messageLabel: whatsapp("messageLabel"),
              messagePlaceholder: whatsapp("messagePlaceholder"),
              send: whatsapp("send"),
              emptyMessage: whatsapp("emptyMessage"),
            }}
            locale={locale}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
