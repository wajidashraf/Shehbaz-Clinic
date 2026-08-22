import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServicesDirectory } from "@/components/content/services-directory";
import { ButtonLink } from "@/components/ui/button-link";
import { demoServices } from "@/content/demo-content";
import type { Locale } from "@/i18n/config";

type ServicesPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const translations = await getTranslations("Services");

  return (
    <main id="main-content">
      <section className="bg-[var(--mineral)]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
          <p className="flex items-center gap-2 text-xs font-extrabold tracking-[0.14em] text-[var(--teal-dark)] uppercase before:block before:h-0.5 before:w-4 before:bg-[var(--saffron)]">
            {translations("eyebrow")}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl leading-[1.08] font-extrabold tracking-[-0.05em] text-balance sm:text-6xl">
            {translations("title")}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted-text)]">
            {translations("description")}
          </p>
          <div className="mt-8 flex max-w-2xl gap-4 rounded-lg border border-[var(--line)] bg-[var(--aqua-soft)] p-5">
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--teal)] text-sm font-extrabold text-[var(--primary-ink)]"
            >
              i
            </span>
            <div>
              <h2 className="font-extrabold">{translations("demoTitle")}</h2>
              <p className="mt-1 text-sm leading-6 text-[var(--muted-text)]">
                {translations("demoDescription")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ServicesDirectory
        labels={{
          all: translations("all"),
          book: translations("book"),
          duration: translations("duration"),
          minutes: translations("minutes"),
          viewDetails: translations("viewDetails"),
        }}
        locale={locale}
        services={demoServices}
      />

      <section className="border-y border-[var(--line)] bg-white">
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
