import { redirect } from "next/navigation";

import { findDemoService } from "@/content/demo-content";
import type { Locale } from "@/i18n/config";

type BookingPageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookingPage({
  params,
  searchParams,
}: BookingPageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const requestedService = Array.isArray(query.service)
    ? query.service[0]
    : query.service;
  const serviceId = requestedService
    ? findDemoService(requestedService)?.id
    : undefined;
  const serviceQuery = serviceId
    ? `&service=${encodeURIComponent(serviceId)}`
    : "";

  redirect(`/${locale}?booking=1${serviceQuery}`);
}
