import { getTranslations, setRequestLocale } from "next-intl/server";
import { DemoNotice } from "@/components/content/demo-notice";
import { ServiceCard } from "@/components/content/service-card";
import { ButtonLink } from "@/components/ui/button-link";
import { demoServices, getLocalizedText } from "@/content/demo-content";
import type { Locale } from "@/i18n/config";

type ServicesPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const translations = await getTranslations("Services");
  const categories = Array.from(
    new Map(
      demoServices.map((service) => [
        getLocalizedText(service.category, locale),
        service.category,
      ]),
    ).values(),
  );

  return (
    <main id="main-content">
      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p className="text-xs font-extrabold tracking-[0.16em] text-[var(--teal-dark)] uppercase">
            {translations("eyebrow")}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl leading-[1.08] font-extrabold tracking-[-0.05em] text-balance sm:text-6xl">
            {translations("title")}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted-text)]">
            {translations("description")}
          </p>
          <div className="mt-8 max-w-4xl">
            <DemoNotice
              description={translations("demoDescription")}
              title={translations("demoTitle")}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        {categories.map((category) => {
          const categoryName = getLocalizedText(category, locale);
          const categoryServices = demoServices.filter(
            (service) =>
              getLocalizedText(service.category, locale) === categoryName,
          );

          return (
            <section
              aria-labelledby={`category-${categoryServices[0]?.id}`}
              key={categoryName}
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-10 rounded-full bg-[var(--saffron)]"
                />
                <h2
                  className="text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl"
                  id={`category-${categoryServices[0]?.id}`}
                >
                  {categoryName}
                </h2>
              </div>
              <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {categoryServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    labels={{
                      book: translations("book"),
                      duration: translations("duration"),
                      minutes: translations("minutes"),
                    }}
                    locale={locale}
                    service={service}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="border-y border-[var(--line)] bg-[var(--aqua-soft)]">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-7 px-5 py-14 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <h2 className="text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
              {translations("closingTitle")}
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-[var(--muted-text)]">
              {translations("closingDescription")}
            </p>
          </div>
          <ButtonLink href={`/${locale}/book?service=consultation`}>
            {translations("closingAction")}
          </ButtonLink>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="border-s-4 border-[var(--saffron)] ps-5">
          <h2 className="font-extrabold">{translations("disclaimerTitle")}</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted-text)]">
            {translations("disclaimerDescription")}
          </p>
        </div>
      </section>
    </main>
  );
}
