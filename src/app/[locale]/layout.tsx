import "@fontsource-variable/manrope";
import "@fontsource-variable/noto-sans-arabic";
import "../globals.css";

import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getDirection, locales } from "@/i18n/config";
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
  if (!hasLocale(routing.locales, locale)) return {};
  const translations = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: translations("title"),
    description: translations("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const [messages, navigation, footer] = await Promise.all([
    getMessages(),
    getTranslations("Navigation"),
    getTranslations("Footer"),
  ]);

  return (
    <html dir={getDirection(locale)} lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <a
            className="fixed start-4 top-4 z-50 -translate-y-24 rounded-full bg-white px-4 py-3 font-bold shadow-lg focus:translate-y-0"
            href="#main-content"
          >
            {locale === "ur" ? "مرکزی مواد پر جائیں" : "Skip to main content"}
          </a>
          <SiteHeader
            labels={{
              primaryNavigation: navigation("primaryNavigation"),
              home: navigation("home"),
              services: navigation("services"),
              book: navigation("book"),
              login: navigation("login"),
              switchLanguage: navigation("switchLanguage"),
            }}
            locale={locale}
          />
          {children}
          <SiteFooter
            labels={{
              summary: footer("summary"),
              addressPending: footer("addressPending"),
              contactPending: footer("contactPending"),
              privacy: footer("privacy"),
              accessibility: footer("accessibility"),
            }}
            locale={locale}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
