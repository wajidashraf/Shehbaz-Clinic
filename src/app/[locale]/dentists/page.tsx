import { getTranslations, setRequestLocale } from "next-intl/server";
import { DemoNotice } from "@/components/content/demo-notice";
import { DentistCard } from "@/components/content/dentist-card";
import { ButtonLink } from "@/components/ui/button-link";
import type { Locale } from "@/i18n/config";
import { listDoctors } from "@/modules/doctors/doctor.repository";

export const dynamic = "force-dynamic";

type DentistsPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function DentistsPage({ params }: DentistsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [translations, dentists] = await Promise.all([
    getTranslations("Dentists"),
    listDoctors(),
  ]);

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
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted-text)]">
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

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {dentists.map((dentist) => (
            <DentistCard
              dentist={dentist}
              key={dentist.id}
              labels={{
                book: translations("book"),
                demoBadge: translations("demoBadge"),
                languages: translations("languages"),
                workingDays: translations("workingDays"),
              }}
              locale={locale}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--aqua)]">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-7 px-5 py-14 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <h2 className="text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">
              {translations("noPreferenceTitle")}
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-[var(--muted-text)]">
              {translations("noPreferenceDescription")}
            </p>
          </div>
          <ButtonLink href={`/${locale}/book?dentist=no-preference`}>
            {translations("noPreferenceAction")}
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
