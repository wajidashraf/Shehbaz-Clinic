"use client";

import { useEffect, useRef, useState } from "react";

import {
  demoServices,
  findDemoService,
  getLocalizedText,
} from "@/content/demo-content";
import { clinicConfig } from "@/config/public-config";
import type { Locale } from "@/i18n/config";
import { normalizePakistanMobile } from "@/modules/booking/pakistan-mobile";

type BookingRequestModalProps = {
  locale: Locale;
};

type BookingRequestDraft = {
  details: string;
  email: string;
  mobile: string;
  patientName: string;
  preferredDate: string;
  serviceId: string;
};

type BookingRequestErrors = Partial<
  Record<keyof BookingRequestDraft, string>
>;

const defaultServiceId = "check-up";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const copy = {
  en: {
    title: "Book Appointment",
    description:
      "Please fill in your details and we will contact you to confirm availability.",
    patientName: "Full name",
    patientPlaceholder: "Ahmad Ali",
    mobile: "Mobile number",
    mobilePlaceholder: "03xx xxxxxxx",
    service: "Select service",
    date: "Preferred date",
    email: "Email (optional)",
    emailPlaceholder: "you@example.com",
    details: "Additional details (optional)",
    detailsPlaceholder: "Describe your dental problem, symptoms, or concerns",
    words: "words",
    notice:
      "By submitting, you understand that this request does not automatically confirm an appointment. The clinic will contact you for confirmation.",
    submit: "Send Appointment Request",
    close: "Close appointment form",
    requiredName: "Enter your full name.",
    requiredMobile: "Enter a valid Pakistani mobile number.",
    requiredService: "Select a dental service.",
    requiredDate: "Select a preferred date that is not in the past.",
    invalidEmail: "Enter a valid email address or leave it blank.",
    detailsTooLong: "Please limit details to 100 words.",
    messageTitle: "Appointment request",
    messageName: "Patient name",
    messageMobile: "Mobile number",
    messageService: "Service",
    messageDate: "Preferred date",
    messageEmail: "Email",
    messageDetails: "Additional details",
    messageClosing: "Please contact me to confirm availability.",
  },
  ur: {
    title: "اپائنٹمنٹ کی درخواست",
    description:
      "اپنی تفصیلات درج کریں، دستیابی کی تصدیق کے لیے کلینک آپ سے رابطہ کرے گا۔",
    patientName: "مریض کا نام",
    patientPlaceholder: "مریض کا نام",
    mobile: "موبائل نمبر",
    mobilePlaceholder: "03xx xxxxxxx",
    service: "خدمت منتخب کریں",
    date: "پسندیدہ تاریخ",
    email: "ای میل (اختیاری)",
    emailPlaceholder: "you@example.com",
    details: "مزید تفصیلات (اختیاری)",
    detailsPlaceholder: "اگر ضروری ہو تو دانتوں کے مسئلے کی تفصیل لکھیں",
    words: "الفاظ",
    notice:
      "فارم بھیجنے سے اپائنٹمنٹ خودکار طور پر کنفرم نہیں ہوگی۔ تصدیق کے لیے کلینک آپ سے رابطہ کرے گا۔",
    submit: "اپائنٹمنٹ کی درخواست واٹس ایپ کریں",
    close: "اپائنٹمنٹ فارم بند کریں",
    requiredName: "مریض کا پورا نام درج کریں۔",
    requiredMobile: "درست پاکستانی موبائل نمبر درج کریں۔",
    requiredService: "ڈینٹل خدمت منتخب کریں۔",
    requiredDate: "آج یا اس کے بعد کی پسندیدہ تاریخ منتخب کریں۔",
    invalidEmail: "درست ای میل درج کریں یا اسے خالی چھوڑ دیں۔",
    detailsTooLong: "براہ کرم تفصیلات 100 الفاظ تک محدود رکھیں۔",
    messageTitle: "اپائنٹمنٹ کی درخواست",
    messageName: "مریض کا نام",
    messageMobile: "موبائل نمبر",
    messageService: "خدمت",
    messageDate: "پسندیدہ تاریخ",
    messageEmail: "ای میل",
    messageDetails: "مزید تفصیلات",
    messageClosing: "دستیابی کی تصدیق کے لیے مجھ سے رابطہ کریں۔",
  },
} as const;

function clinicDateKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: clinicConfig.timeZone,
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}-${value.month}-${value.day}`;
}

function countWords(value: string): number {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/u).length : 0;
}

function emptyDraft(serviceId = defaultServiceId): BookingRequestDraft {
  return {
    details: "",
    email: "",
    mobile: "",
    patientName: "",
    preferredDate: "",
    serviceId: findDemoService(serviceId)?.id ?? defaultServiceId,
  };
}

export function BookingRequestModal({ locale }: BookingRequestModalProps) {
  const labels = copy[locale];
  const isRtl = locale === "ur";
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<BookingRequestDraft>(() => emptyDraft());
  const [errors, setErrors] = useState<BookingRequestErrors>({});
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const detailsWordCount = countWords(draft.details);

  function openModal(serviceId?: string) {
    previousActiveElement.current = document.activeElement as HTMLElement | null;
    setDraft(emptyDraft(serviceId));
    setErrors({});
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.has("booking")) {
      currentUrl.searchParams.delete("booking");
      currentUrl.searchParams.delete("service");
      window.history.replaceState({}, "", `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
    }
    window.setTimeout(() => previousActiveElement.current?.focus(), 0);
  }

  useEffect(() => {
    function interceptBookingLink(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== `/${locale}/book`
      ) {
        return;
      }

      event.preventDefault();
      openModal(url.searchParams.get("service") ?? undefined);
    }

    document.addEventListener("click", interceptBookingLink, true);

    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.get("booking") === "1") {
      const timeoutId = window.setTimeout(
        () => openModal(currentUrl.searchParams.get("service") ?? undefined),
        0,
      );
      return () => {
        window.clearTimeout(timeoutId);
        document.removeEventListener("click", interceptBookingLink, true);
      };
    }

    return () => document.removeEventListener("click", interceptBookingLink, true);
  }, [locale]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("input, select")?.focus();
    }, 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function setField(field: keyof BookingRequestDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedMobile = normalizePakistanMobile(draft.mobile);
    const nextErrors: BookingRequestErrors = {};
    if (draft.patientName.trim().length < 2) {
      nextErrors.patientName = labels.requiredName;
    }
    if (!normalizedMobile) nextErrors.mobile = labels.requiredMobile;
    if (!findDemoService(draft.serviceId)) {
      nextErrors.serviceId = labels.requiredService;
    }
    if (!draft.preferredDate || draft.preferredDate < clinicDateKey()) {
      nextErrors.preferredDate = labels.requiredDate;
    }
    if (draft.email.trim() && !emailPattern.test(draft.email.trim())) {
      nextErrors.email = labels.invalidEmail;
    }
    if (detailsWordCount > 100) {
      nextErrors.details = labels.detailsTooLong;
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const service = findDemoService(draft.serviceId)!;
    const messageLines = [
      `*${labels.messageTitle}*`,
      `${labels.messageName}: ${draft.patientName.trim()}`,
      `${labels.messageMobile}: ${normalizedMobile}`,
      `${labels.messageService}: ${getLocalizedText(service.name, locale)}`,
      `${labels.messageDate}: ${draft.preferredDate}`,
    ];
    if (draft.email.trim()) {
      messageLines.push(`${labels.messageEmail}: ${draft.email.trim()}`);
    }
    if (draft.details.trim()) {
      messageLines.push(`${labels.messageDetails}: ${draft.details.trim()}`);
    }
    messageLines.push("", labels.messageClosing);
    window.open(
      clinicConfig.whatsapp.href(messageLines.join("\n")),
      "_blank",
      "noopener,noreferrer",
    );
  }

  if (!open) return null;

  const fieldClassName =
    "mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-slate-50/95 px-4 text-base text-slate-900 outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-slate-400 focus:border-[#1976d2] focus:ring-3 focus:ring-blue-100";
  const labelClassName =
    "block text-xs font-extrabold uppercase tracking-[0.02em] text-slate-600";

  return (
    <div
      className="fixed inset-0 z-[120] grid place-items-center overflow-y-auto bg-[#0b365b]/72 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div
        aria-labelledby="booking-request-title"
        aria-modal="true"
        className="my-auto w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/35 bg-white/95 shadow-[0_32px_90px_-28px_rgba(4,35,65,0.75)] backdrop-blur-xl sm:rounded-[2.25rem]"
        dir={isRtl ? "rtl" : "ltr"}
        ref={dialogRef}
        role="dialog"
      >
        <header className="relative bg-[linear-gradient(135deg,#1676c8,#258fdc)] px-6 py-7 text-white sm:px-9 sm:py-9">
          <button
            aria-label={labels.close}
            className="absolute end-5 top-5 grid size-11 place-items-center rounded-full bg-white/18 text-white transition-colors duration-200 hover:bg-white/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:end-8 sm:top-8"
            onClick={closeModal}
            type="button"
          >
            <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </button>
          <h2 className="pe-14 text-2xl font-extrabold tracking-[-0.03em] sm:text-4xl" id="booking-request-title">
            {labels.title}
          </h2>
          <p className="mt-4 max-w-xl pe-8 text-sm font-semibold leading-6 text-white/92 sm:text-lg sm:leading-7">
            {labels.description}
          </p>
        </header>

        <form className="px-5 py-6 sm:px-9 sm:py-8" noValidate onSubmit={submitRequest}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={labelClassName}>
              {labels.patientName}
              <input
                aria-describedby={errors.patientName ? "request-name-error" : undefined}
                aria-invalid={Boolean(errors.patientName)}
                autoComplete="name"
                className={fieldClassName}
                onChange={(event) => setField("patientName", event.target.value)}
                placeholder={labels.patientPlaceholder}
                value={draft.patientName}
              />
              {errors.patientName ? <span className="mt-2 block text-xs normal-case tracking-normal text-red-700" id="request-name-error">{errors.patientName}</span> : null}
            </label>

            <label className={labelClassName}>
              {labels.mobile}
              <input
                aria-describedby={errors.mobile ? "request-mobile-error" : undefined}
                aria-invalid={Boolean(errors.mobile)}
                autoComplete="tel"
                className={fieldClassName}
                dir="ltr"
                inputMode="tel"
                onChange={(event) => setField("mobile", event.target.value)}
                placeholder={labels.mobilePlaceholder}
                value={draft.mobile}
              />
              {errors.mobile ? <span className="mt-2 block text-xs normal-case tracking-normal text-red-700" id="request-mobile-error">{errors.mobile}</span> : null}
            </label>
          </div>

          <label className={`${labelClassName} mt-5`}>
            {labels.service}
            <select
              aria-describedby={errors.serviceId ? "request-service-error" : undefined}
              aria-invalid={Boolean(errors.serviceId)}
              className={fieldClassName}
              onChange={(event) => setField("serviceId", event.target.value)}
              value={draft.serviceId}
            >
              {demoServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {getLocalizedText(service.name, locale)}
                </option>
              ))}
            </select>
            {errors.serviceId ? <span className="mt-2 block text-xs normal-case tracking-normal text-red-700" id="request-service-error">{errors.serviceId}</span> : null}
          </label>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className={labelClassName}>
              {labels.date}
              <input
                aria-describedby={errors.preferredDate ? "request-date-error" : undefined}
                aria-invalid={Boolean(errors.preferredDate)}
                className={fieldClassName}
                min={clinicDateKey()}
                onChange={(event) => setField("preferredDate", event.target.value)}
                type="date"
                value={draft.preferredDate}
              />
              {errors.preferredDate ? <span className="mt-2 block text-xs normal-case tracking-normal text-red-700" id="request-date-error">{errors.preferredDate}</span> : null}
            </label>

            <label className={labelClassName}>
              {labels.email}
              <input
                aria-describedby={errors.email ? "request-email-error" : undefined}
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
                className={fieldClassName}
                inputMode="email"
                onChange={(event) => setField("email", event.target.value)}
                placeholder={labels.emailPlaceholder}
                type="email"
                value={draft.email}
              />
              {errors.email ? <span className="mt-2 block text-xs normal-case tracking-normal text-red-700" id="request-email-error">{errors.email}</span> : null}
            </label>
          </div>

          <div className="mt-5">
            <label className={labelClassName} htmlFor="request-details">
              {labels.details}
            </label>
            <textarea
              aria-describedby="request-details-feedback"
              aria-invalid={Boolean(errors.details)}
              className={`${fieldClassName} min-h-24 resize-y py-3`}
              id="request-details"
              onChange={(event) => setField("details", event.target.value)}
              placeholder={labels.detailsPlaceholder}
              rows={3}
              value={draft.details}
            />
            <div
              className="mt-2 flex items-start justify-between gap-4 text-xs normal-case tracking-normal"
              id="request-details-feedback"
            >
              <span className="text-red-700">
                {errors.details ?? ""}
              </span>
              <span
                className={
                  detailsWordCount > 100
                    ? "shrink-0 font-semibold text-red-700"
                    : "shrink-0 text-slate-500"
                }
              >
                {detailsWordCount} / 100 {labels.words}
              </span>
            </div>
          </div>

          <p className="mt-5 text-xs italic leading-5 text-slate-500">
            * {labels.notice}
          </p>

          <button
            className="mt-6 inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-[#0b4778] px-6 text-center text-base font-extrabold text-white shadow-[0_14px_30px_-18px_rgba(11,71,120,0.7)] transition-[background-color,box-shadow] duration-200 hover:bg-[#083a65] hover:shadow-[0_18px_38px_-20px_rgba(11,71,120,0.85)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-300"
            type="submit"
          >
            {labels.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
