import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { defaultLocale, isLocale } from "@/i18n/config";

export default async function NotFound() {
  const requestedLocale = await getLocale();
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const translations = await getTranslations({ locale, namespace: "NotFound" });

  return (
    <main className="mx-auto min-h-[60vh] max-w-3xl px-5 py-24 text-center">
      <h1 className="text-4xl font-extrabold tracking-[-0.04em]">
        {translations("title")}
      </h1>
      <p className="mt-4 text-slate-600">{translations("description")}</p>
      <Link
        className="mt-8 inline-flex min-h-11 items-center rounded-full bg-[var(--teal)] px-5 font-bold text-white"
        href={`/${locale}`}
      >
        {translations("home")}
      </Link>
    </main>
  );
}
