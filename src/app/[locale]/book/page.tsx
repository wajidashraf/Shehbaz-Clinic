import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { DemoNotice } from "@/components/content/demo-notice";
import type { Locale } from "@/i18n/config";
import { resolveBookingPrefill } from "@/modules/booking/demo-booking";
import { listDoctors } from "@/modules/doctors/doctor.repository";

export const dynamic = "force-dynamic";

type BookingPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookingPage({
  params,
  searchParams,
}: BookingPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);
  const [translations, dentists] = await Promise.all([
    getTranslations("Booking"),
    listDoctors(),
  ]);
  const prefill = resolveBookingPrefill(
    query,
    dentists.map((dentist) => dentist.id),
  );

  return (
    <main id="main-content">
      <section className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <p className="text-xs font-extrabold tracking-[0.16em] text-[var(--teal-dark)] uppercase">
                {translations("eyebrow")}
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl leading-[1.08] font-extrabold tracking-[-0.05em] text-balance sm:text-6xl">
                {translations("title")}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted-text)]">
                {translations("description")}
              </p>
            </div>
            <DemoNotice
              description={translations("demoDescription")}
              title={translations("demoTitle")}
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-18">
        <BookingWizard
          dentists={dentists}
          initialDentistId={prefill.dentistId}
          initialServiceId={prefill.serviceId}
          locale={locale}
        />
      </div>
    </main>
  );
}
