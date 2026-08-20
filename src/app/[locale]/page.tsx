import { getTranslations, setRequestLocale } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";
import type { Locale } from "@/i18n/config";

type HomePageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const translations = await getTranslations("Home");

  return (
    <main id="main-content">
      <section className="relative isolate overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,var(--teal)_0_72%,var(--saffron)_72%_78%,var(--aqua)_78%)]"
        />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-28">
          <div className="self-center">
            <p className="text-sm font-extrabold tracking-[0.14em] text-[var(--teal)] uppercase">
              {translations("eyebrow")}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl leading-[1.08] font-extrabold tracking-[-0.045em] text-balance sm:text-6xl">
              {translations("title")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {translations("description")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={`/${locale}/book`}>
                {translations("book")}
              </ButtonLink>
              <ButtonLink href={`/${locale}/services`} variant="secondary">
                {translations("explore")}
              </ButtonLink>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[2rem] bg-[var(--ink)] p-7 text-white shadow-[0_30px_80px_-45px_rgba(11,34,57,0.7)] sm:p-9">
            <div
              aria-hidden="true"
              className="absolute -end-16 -top-16 size-56 rounded-full border-[28px] border-[var(--teal)] opacity-55"
            />
            <div className="relative">
              <p className="text-sm font-bold text-[var(--aqua)]">
                {translations("locationLabel")}
              </p>
              <p className="mt-3 max-w-xs text-2xl leading-snug font-extrabold">
                <bdi>{translations("location")}</bdi>
              </p>
              <div className="my-8 h-px bg-white/20" />
              <p className="text-sm font-bold text-[var(--aqua)]">
                {translations("detailStatus")}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/75">
                {translations("detailsPending")}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 md:grid-cols-2 lg:px-8 lg:py-20">
        <article className="rounded-[1.75rem] border border-[var(--line)] bg-white p-7 sm:p-9">
          <p className="text-sm font-extrabold text-[var(--teal)]">
            {translations("careLabel")}
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.025em]">
            {translations("careTitle")}
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            {translations("careDescription")}
          </p>
        </article>
        <article className="rounded-[1.75rem] bg-[var(--aqua)] p-7 sm:p-9">
          <p className="text-sm font-extrabold text-[var(--teal-dark)]">
            {translations("urgentLabel")}
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.025em]">
            {translations("urgentTitle")}
          </h2>
          <p className="mt-4 leading-7 text-slate-700">
            {translations("urgentDescription")}
          </p>
        </article>
      </section>
    </main>
  );
}
