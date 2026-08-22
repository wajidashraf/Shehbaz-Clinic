import Image from "next/image";
import Link from "next/link";
import { ServiceCard } from "@/components/content/service-card";
import { ButtonLink } from "@/components/ui/button-link";
import { getLocalizedText, type DemoService } from "@/content/demo-content";
import { getServiceImageSource } from "@/content/service-images";
import type { Locale } from "@/i18n/config";

type ServiceDetailProps = {
  labels: {
    back: string;
    book: string;
    bookingDescription: string;
    bookingTitle: string;
    clinicalNote: string;
    duration: string;
    minutes: string;
    overview: string;
    related: string;
    suitableFor: string;
    viewDetails: string;
    whatToExpect: string;
  };
  locale: Locale;
  relatedServices: readonly DemoService[];
  service: DemoService;
};

function ArrowIcon({ locale }: { locale: Locale }) {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d={locale === "ur" ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function ServiceDetail({
  labels,
  locale,
  relatedServices,
  service,
}: ServiceDetailProps) {
  const name = getLocalizedText(service.name, locale);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-[var(--aqua-light)] px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute -end-36 -top-40 size-[30rem] rounded-full bg-white/80 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <Link
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-extrabold text-[var(--teal-dark)] transition-[background-color,color] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)]"
            href={`/${locale}/services`}
          >
            <ArrowIcon locale={locale} />
            {labels.back}
          </Link>

          <article className="mt-5 overflow-hidden rounded-lg border border-white bg-white shadow-[0_30px_80px_-54px_rgba(7,48,71,0.62)] lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(25rem,0.92fr)]">
            <div className="relative min-h-[20rem] overflow-hidden bg-[var(--aqua)] sm:min-h-[30rem] lg:min-h-[39rem]">
              <Image
                alt={name}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 56vw"
                src={getServiceImageSource(service)}
              />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(7,48,71,0.34)_100%)]" />
            </div>

            <div className="flex min-w-0 flex-col justify-center p-6 sm:p-10 lg:p-12">
              <p className="text-xs font-extrabold tracking-[0.14em] text-[var(--teal-dark)] uppercase">
                {getLocalizedText(service.category, locale)}
              </p>
              <h1 className="mt-4 text-4xl leading-[1.06] font-extrabold tracking-[-0.05em] text-balance text-[var(--primary-ink)] sm:text-5xl lg:text-[clamp(3rem,4.5vw,4.3rem)]">
                <bdi>{name}</bdi>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-pretty text-[var(--muted-text)]">
                {getLocalizedText(service.summary, locale)}
              </p>
              <div className="mt-8 inline-flex w-fit items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--aqua-soft)] px-4 py-3 text-sm font-extrabold text-[var(--teal-dark)]">
                <ClockIcon />
                <span>
                  {labels.duration}: <bdi>{service.durationMinutes}</bdi> {labels.minutes}
                </span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-14">
          <div className="min-w-0">
            <section aria-labelledby="service-overview">
              <p className="text-xs font-extrabold tracking-[0.14em] text-[var(--teal-dark)] uppercase">
                {getLocalizedText(service.category, locale)}
              </p>
              <h2 id="service-overview" className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[var(--primary-ink)] sm:text-4xl">
                {labels.overview}
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-9 text-pretty text-[var(--muted-text)]">
                {getLocalizedText(service.details, locale)}
              </p>
            </section>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <section className="rounded-lg border border-[var(--line)] bg-[var(--aqua-soft)] p-6 sm:p-7" aria-labelledby="service-suitable-for">
                <h2 id="service-suitable-for" className="text-xl font-extrabold tracking-[-0.025em] text-[var(--primary-ink)]">
                  {labels.suitableFor}
                </h2>
                <ul className="mt-5 space-y-4">
                  {service.suitableFor.map((item) => (
                    <li className="flex gap-3 text-sm leading-7 font-semibold text-[var(--ink)]" key={item.en}>
                      <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rounded-full bg-[var(--saffron)]" />
                      {getLocalizedText(item, locale)}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-lg border border-[var(--line)] bg-white p-6 shadow-[0_20px_50px_-42px_rgba(7,48,71,0.45)] sm:p-7" aria-labelledby="service-expectations">
                <h2 id="service-expectations" className="text-xl font-extrabold tracking-[-0.025em] text-[var(--primary-ink)]">
                  {labels.whatToExpect}
                </h2>
                <ol className="mt-5 space-y-4">
                  {service.expectations.map((item, index) => (
                    <li className="flex gap-3 text-sm leading-7 font-semibold text-[var(--ink)]" key={item.en}>
                      <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--teal-dark)] text-xs font-extrabold text-white">
                        <bdi>{index + 1}</bdi>
                      </span>
                      {getLocalizedText(item, locale)}
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <aside className="mt-8 rounded-lg border-s-4 border-[var(--saffron)] bg-[var(--mineral)] p-6 sm:p-7">
              <h2 className="font-extrabold text-[var(--primary-ink)]">{labels.clinicalNote}</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-text)]">
                {getLocalizedText(service.clinicalNote, locale)}
              </p>
            </aside>
          </div>

          <aside className="rounded-lg border border-[var(--line)] bg-[var(--primary-ink)] p-6 text-white shadow-[0_24px_60px_-38px_rgba(7,48,71,0.72)] lg:sticky lg:top-28 sm:p-7">
            <p className="text-xs font-extrabold tracking-[0.14em] text-[var(--saffron)] uppercase">
              {getLocalizedText(service.category, locale)}
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.035em]">{labels.bookingTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-white/75">{labels.bookingDescription}</p>
            <div className="mt-6 flex items-center gap-3 border-y border-white/15 py-4 text-sm font-bold">
              <ClockIcon />
              <span><bdi>{service.durationMinutes}</bdi> {labels.minutes}</span>
            </div>
            <ButtonLink className="mt-6 w-full" href={`/${locale}/book?service=${service.id}`} size="large">
              {labels.book}
            </ButtonLink>
          </aside>
        </div>
      </section>

      {relatedServices.length > 0 ? (
        <section className="border-t border-[var(--line)] bg-[var(--aqua-light)] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-extrabold tracking-[-0.04em] text-[var(--primary-ink)] sm:text-4xl">
              {labels.related}
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedServices.map((relatedService) => (
                <ServiceCard
                  href={`/${locale}/services/${relatedService.id}`}
                  key={relatedService.id}
                  labels={{
                    book: labels.viewDetails,
                    duration: labels.duration,
                    minutes: labels.minutes,
                  }}
                  locale={locale}
                  service={relatedService}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
