import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { isLocale } from "@/i18n/config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;

  if (!requestedLocale || !isLocale(requestedLocale)) {
    notFound();
  }

  return {
    locale: requestedLocale,
    messages: (await import(`../messages/${requestedLocale}.json`)).default,
    timeZone: "Asia/Karachi",
  };
});
