import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { DentistsCarousel } from "@/components/content/dentists-carousel";
import { DoctorProfile } from "@/components/content/doctor-profile";
import { getLocalizedText } from "@/content/demo-content";
import type { Locale } from "@/i18n/config";
import { findDoctor, listDoctors } from "@/modules/doctors/doctor.repository";

export const dynamic = "force-dynamic";

type DoctorProfilePageProps = {
  params: Promise<{ doctorId: string; locale: Locale }>;
};

export async function generateMetadata({ params }: DoctorProfilePageProps): Promise<Metadata> {
  const { doctorId, locale } = await params;
  const doctor = await findDoctor(doctorId);
  if (!doctor) return {};
  return {
    title: `${getLocalizedText(doctor.name, locale)} | Shahbaz Dental Clinic`,
    description: getLocalizedText(doctor.biography, locale),
  };
}

export default async function DoctorProfilePage({ params }: DoctorProfilePageProps) {
  const { doctorId, locale } = await params;
  setRequestLocale(locale);

  const [translations, doctor, dentists] = await Promise.all([
    getTranslations("Dentists"),
    findDoctor(doctorId),
    listDoctors(),
  ]);

  if (!doctor) notFound();
  const otherDentists = dentists.filter((item) => item.id !== doctor.id);

  return (
    <main id="main-content">
      <section className="bg-[linear-gradient(180deg,var(--aqua-light)_0%,white_100%)] px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <Link
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-extrabold text-[var(--teal-dark)] transition-[color,background-color,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-white"
            href={`/${locale}/dentists`}
          >
            <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
              <path d={locale === "ur" ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            {translations("backToDentists")}
          </Link>

          <div className="mt-5">
            <DoctorProfile
              doctor={doctor}
              labels={{
                about: translations("about"),
                book: translations("book"),
                bookingDescription: translations("bookingDescription"),
                bookingTitle: translations("bookingTitle"),
                education: translations("education"),
                focusAreas: translations("focusAreas"),
                profile: translations("profile"),
                registration: translations("registration"),
                workingDays: translations("workingDays"),
              }}
              locale={locale}
            />
          </div>
        </div>
      </section>

      {otherDentists.length > 0 ? (
        <section className="scroll-mt-28 bg-white px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--teal-dark)]">
              {translations("eyebrow")}
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-[-0.04em] text-[var(--primary-ink)] sm:text-4xl">
              {translations("otherDentists")}
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-[var(--muted-text)]">
              {translations("otherDentistsDescription")}
            </p>
            <div className="mt-9">
              <DentistsCarousel
                dentists={otherDentists}
                labels={{
                  carousel: translations("carousel"),
                  demoBadge: translations("demoBadge"),
                  next: translations("next"),
                  previous: translations("previous"),
                  viewProfile: translations("viewProfile"),
                }}
                locale={locale}
              />
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
