import { setRequestLocale } from "next-intl/server";
import { BookingWizard } from "@/components/booking/booking-wizard";
import type { Locale } from "@/i18n/config";
import { listBookingDoctors } from "@/modules/booking/booking-doctors.server";
import { resolveBookingPrefill } from "@/modules/booking/demo-booking";

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
  const dentists = await listBookingDoctors();
  const prefill = resolveBookingPrefill(
    query,
    dentists.map((dentist) => dentist.id),
  );

  return (
    <main
      className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-[var(--aqua-soft)]"
      id="main-content"
    >
      <span
        aria-hidden="true"
        className="absolute -start-28 top-20 size-72 rounded-full bg-[var(--aqua)]/55 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="absolute -end-24 bottom-12 size-64 rounded-full bg-[var(--saffron)]/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
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
