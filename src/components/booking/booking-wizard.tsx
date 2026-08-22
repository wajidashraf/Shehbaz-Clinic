"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { FiCheck, FiCheckCircle } from "react-icons/fi";
import {
  demoServices,
  findDemoService,
  getLocalizedText,
} from "@/content/demo-content";
import type { Locale } from "@/i18n/config";
import {
  createBookingDraft,
  validateBookingStep,
} from "@/modules/booking/demo-booking";
import type {
  BookingDraft,
  BookingErrors,
  BookingField,
  BookingStep,
  BookingValidationMessages,
} from "@/modules/booking/demo-booking";
import type { DoctorRecord } from "@/modules/doctors/doctor.types";

type BookingWizardProps = {
  dentists: readonly DoctorRecord[];
  initialDentistId: string;
  initialServiceId: string;
  locale: Locale;
};

const validationSteps: readonly BookingStep[] = [
  "service",
  "dentist",
  "time",
  "details",
  "review",
];
const availabilityTimeoutMs = 10_000;
const fieldClassName =
  "mt-2 min-h-12 w-full rounded-lg border border-[var(--line-strong)] bg-white px-4 text-[var(--primary-ink)] outline-none transition-[border-color,box-shadow] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus:border-[var(--teal)] focus:ring-3 focus:ring-[var(--aqua)] disabled:cursor-not-allowed disabled:bg-[var(--surface-muted)] disabled:text-[var(--muted-text)]";

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p className="mt-2 text-sm font-bold text-[var(--danger)]" id={id}>
      {message}
    </p>
  ) : null;
}

function SelectArrow() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 end-3 grid place-items-center text-[var(--teal-dark)]"
    >
      <svg fill="none" height="18" viewBox="0 0 18 18" width="18">
        <path
          d="m5 7 4 4 4-4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    </span>
  );
}

export function BookingWizard({
  dentists,
  initialDentistId,
  initialServiceId,
  locale,
}: BookingWizardProps) {
  const translations = useTranslations("Booking");
  const [draft, setDraft] = useState(() =>
    createBookingDraft({
      dentistId: initialDentistId,
      serviceId: initialServiceId,
    }),
  );
  const [errors, setErrors] = useState<BookingErrors>({});
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [availabilityState, setAvailabilityState] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");
  const [bookingReference, setBookingReference] = useState("");
  const [timePending, setTimePending] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const availabilityRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => availabilityRequest.current?.abort();
  }, []);

  const validationMessages: BookingValidationMessages = {
    requiredService: translations("requiredService"),
    requiredDentist: translations("requiredDentist"),
    requiredDate: translations("requiredDate"),
    requiredTime: translations("requiredTime"),
    requiredName: translations("requiredName"),
    requiredMobile: translations("requiredMobile"),
    invalidEmail: translations("invalidEmail"),
    requiredConsent: translations("requiredConsent"),
  };

  function setField<K extends BookingField>(field: K, value: BookingDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function loadAvailability(dentistId: string, date: string) {
    availabilityRequest.current?.abort();
    const controller = new AbortController();
    availabilityRequest.current = controller;
    let requestTimedOut = false;
    const timeoutId = window.setTimeout(() => {
      requestTimedOut = true;
      controller.abort();
    }, availabilityTimeoutMs);
    setAvailabilityState("loading");
    setAvailableTimes([]);

    try {
      const response = await fetch(
        `/api/v1/availability?dentistId=${encodeURIComponent(dentistId)}&dateKey=${encodeURIComponent(date)}`,
        { signal: controller.signal },
      );
      if (!response.ok) throw new Error("availability-unavailable");
      const result = (await response.json()) as {
        slots: Array<{ time: string }>;
      };
      if (availabilityRequest.current !== controller) return;
      setAvailableTimes(result.slots.map((slot) => slot.time));
      setAvailabilityState("loaded");
    } catch {
      if (controller.signal.aborted && !requestTimedOut) return;
      setAvailabilityState("error");
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  function handleDentistChange(dentistId: string) {
    availabilityRequest.current?.abort();
    setDraft((current) => ({
      ...current,
      date: "",
      dentistId,
      time: "",
    }));
    setErrors((current) => {
      const next = { ...current };
      delete next.dentistId;
      delete next.date;
      delete next.time;
      return next;
    });
    setAvailableTimes([]);
    setAvailabilityState("idle");
  }

  function handleDateChange(date: string) {
    setDraft((current) => ({ ...current, date, time: "" }));
    setErrors((current) => {
      const next = { ...current };
      delete next.date;
      delete next.time;
      return next;
    });
    setAvailableTimes([]);
    if (!date || !draft.dentistId) {
      availabilityRequest.current?.abort();
      setAvailabilityState("idle");
      return;
    }
    void loadAvailability(draft.dentistId, date);
  }

  async function handleSubmit() {
    const nextErrors = validationSteps.reduce<BookingErrors>(
      (allErrors, step) => ({
        ...allErrors,
        ...validateBookingStep(step, draft, validationMessages),
      }),
      {},
    );
    if (availabilityState === "loaded" && availableTimes.length === 0) {
      delete nextErrors.time;
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setSubmissionError("");
    const response = await fetch("/api/v1/appointments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        serviceId: draft.serviceId,
        dentistId: draft.dentistId,
        dateKey: draft.date,
        time: draft.time,
        patientName: draft.fullName,
        mobile: draft.mobile,
        email: draft.email,
        locale,
        consent: draft.consent,
      }),
    }).catch(() => null);
    setSubmitting(false);

    if (!response?.ok) {
      setSubmissionError(
        response?.status === 409
          ? translations("slotUnavailable")
          : translations("bookingFailed"),
      );
      return;
    }

    const result = (await response.json()) as {
      publicReference: string;
      timePending?: boolean;
    };
    setTimePending(Boolean(result.timePending));
    setBookingReference(result.publicReference);
  }

  function handleRestart() {
    availabilityRequest.current?.abort();
    setDraft(
      createBookingDraft({
        dentistId: initialDentistId,
        serviceId: initialServiceId,
      }),
    );
    setAvailableTimes([]);
    setAvailabilityState("idle");
    setBookingReference("");
    setTimePending(false);
    setSubmissionError("");
    setErrors({});
  }

  const selectedService = findDemoService(draft.serviceId);
  const selectedDentist = dentists.find(
    (dentist) => dentist.id === draft.dentistId,
  );
  const selectedDate = draft.date
    ? new Intl.DateTimeFormat(locale === "ur" ? "ur-PK" : "en-PK", {
        dateStyle: "medium",
        timeZone: "Asia/Karachi",
      }).format(new Date(`${draft.date}T00:00:00+05:00`))
    : "";
  const selectedTime = draft.time
    ? new Intl.DateTimeFormat(locale === "ur" ? "ur-PK" : "en-PK", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Asia/Karachi",
      }).format(new Date(`2026-01-01T${draft.time}:00+05:00`))
    : "";
  const slotPlaceholder =
    availabilityState === "loading"
      ? translations("loadingSlots")
      : availabilityState === "error"
        ? translations("availabilityFailed")
        : availabilityState === "loaded" && availableTimes.length === 0
          ? translations("noSlots")
          : draft.date
            ? translations("chooseTime")
            : translations("selectDateFirst");

  if (bookingReference) {
    return (
      <section
        aria-labelledby="booking-confirmation-title"
        className="overflow-hidden rounded-lg border border-[var(--line)] bg-white shadow-[0_28px_80px_-42px_rgba(4,71,83,0.5)]"
      >
        <div className="bg-[var(--teal-dark)] px-6 py-8 text-white sm:px-9">
          <span className="grid size-14 place-items-center rounded-full border border-white/30 bg-white/12 text-2xl">
            <FiCheckCircle aria-hidden="true" />
          </span>
          <h2
            className="mt-5 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl"
            id="booking-confirmation-title"
          >
            {translations("confirmationTitle")}
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-white/85">
            {translations("confirmationDescription")}
          </p>
        </div>

        <div className="p-6 sm:p-9">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--aqua-soft)] p-5">
            <p className="text-xs font-extrabold tracking-[0.12em] text-[var(--teal-dark)] uppercase">
              {translations("appointmentReference")}
            </p>
            <p className="mt-2 text-2xl font-extrabold">
              <bdi>{bookingReference}</bdi>
            </p>
          </div>
          <dl className="mt-5 grid gap-4 border-y border-[var(--line)] py-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-extrabold tracking-[0.08em] text-[var(--muted-text)] uppercase">
                {translations("selectedService")}
              </dt>
              <dd className="mt-1 font-bold">
                {selectedService
                  ? getLocalizedText(selectedService.name, locale)
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-extrabold tracking-[0.08em] text-[var(--muted-text)] uppercase">
                {translations("selectedDentist")}
              </dt>
              <dd className="mt-1 font-bold">
                {draft.dentistId === "no-preference"
                  ? translations("noPreference")
                  : selectedDentist
                    ? getLocalizedText(selectedDentist.name, locale)
                    : "—"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-extrabold tracking-[0.08em] text-[var(--muted-text)] uppercase">
                {translations("selectedTime")}
              </dt>
              <dd className="mt-1 font-bold">
                <bdi>
                  {timePending
                    ? `${selectedDate} · ${translations("timePendingLabel")}`
                    : `${selectedDate} · ${selectedTime}`}
                </bdi>
              </dd>
            </div>
          </dl>
          <p className="mt-5 flex items-start gap-2 text-sm leading-6 font-bold text-[var(--teal-dark)]">
            <FiCheck aria-hidden="true" className="mt-1 shrink-0" />
            {translations(
              timePending ? "timePendingConfirmation" : "smsConfirmation",
            )}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              className="min-h-11 cursor-pointer rounded-lg bg-[var(--teal)] px-5 py-3 text-sm font-extrabold transition-[color,background-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-[var(--teal-dark)] hover:text-white hover:shadow-lg"
              onClick={handleRestart}
              type="button"
            >
              {translations("startAgain")}
            </button>
            <Link
              className="inline-flex min-h-11 items-center rounded-lg border border-[var(--line-strong)] bg-white px-5 py-3 text-sm font-extrabold transition-[background-color,border-color] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-[var(--teal)] hover:bg-[var(--aqua-soft)]"
              href={`/${locale}`}
            >
              {translations("returnHome")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="booking-form-title"
      className="overflow-hidden rounded-lg border border-[var(--line)] bg-white shadow-[0_28px_80px_-42px_rgba(4,71,83,0.5)]"
    >
      <div className="relative overflow-hidden bg-[var(--teal-dark)] px-6 py-8 text-white sm:px-9 sm:py-9">
        <span
          aria-hidden="true"
          className="absolute -end-16 -top-20 size-48 rounded-full border-[26px] border-white/5"
        />
        <p className="relative text-xs font-extrabold tracking-[0.16em] text-[var(--saffron)] uppercase">
          {translations("eyebrow")}
        </p>
        <h1
          className="relative mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl"
          id="booking-form-title"
        >
          {translations("title")}
        </h1>
        <p className="relative mt-3 max-w-2xl leading-7 text-white/82">
          {translations("simpleFormDescription")}
        </p>
      </div>

      <form
        className="p-5 sm:p-8 lg:p-9"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <div aria-live="polite" className="sr-only">
          {Object.values(errors)[0] ?? submissionError}
        </div>

        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          <div>
            <label className="text-sm font-extrabold" htmlFor="booking-name">
              {translations("fullName")}
            </label>
            <input
              aria-describedby={errors.fullName ? "name-error" : undefined}
              aria-invalid={Boolean(errors.fullName)}
              autoComplete="name"
              className={fieldClassName}
              id="booking-name"
              onChange={(event) => setField("fullName", event.target.value)}
              placeholder={translations("fullNameExample")}
              value={draft.fullName}
            />
            <FieldError id="name-error" message={errors.fullName} />
          </div>

          <div>
            <label className="text-sm font-extrabold" htmlFor="booking-mobile">
              {translations("mobile")}
            </label>
            <input
              aria-describedby={errors.mobile ? "mobile-error" : undefined}
              aria-invalid={Boolean(errors.mobile)}
              autoComplete="tel"
              className={fieldClassName}
              dir="ltr"
              id="booking-mobile"
              inputMode="tel"
              onChange={(event) => setField("mobile", event.target.value)}
              placeholder={translations("mobileExample")}
              value={draft.mobile}
            />
            <FieldError id="mobile-error" message={errors.mobile} />
          </div>

          <div>
            <label className="text-sm font-extrabold" htmlFor="booking-service">
              {translations("selectedService")}
            </label>
            <div className="relative">
              <select
                aria-describedby={
                  errors.serviceId ? "service-error" : undefined
                }
                aria-invalid={Boolean(errors.serviceId)}
                className={`${fieldClassName} appearance-none pe-10`}
                id="booking-service"
                onChange={(event) => setField("serviceId", event.target.value)}
                value={draft.serviceId}
              >
                <option value="">{translations("chooseService")}</option>
                {demoServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {getLocalizedText(service.name, locale)}
                  </option>
                ))}
              </select>
              <SelectArrow />
            </div>
            <FieldError id="service-error" message={errors.serviceId} />
          </div>

          <div>
            <label className="text-sm font-extrabold" htmlFor="booking-dentist">
              {translations("selectedDentist")}
            </label>
            <div className="relative">
              <select
                aria-describedby={
                  errors.dentistId ? "dentist-error" : undefined
                }
                aria-invalid={Boolean(errors.dentistId)}
                className={`${fieldClassName} appearance-none pe-10`}
                id="booking-dentist"
                onChange={(event) => handleDentistChange(event.target.value)}
                value={draft.dentistId}
              >
                <option value="">{translations("chooseDentist")}</option>
                <option value="no-preference">
                  {translations("noPreference")}
                </option>
                {dentists.map((dentist) => (
                  <option key={dentist.id} value={dentist.id}>
                    {getLocalizedText(dentist.name, locale)}
                  </option>
                ))}
              </select>
              <SelectArrow />
            </div>
            <FieldError id="dentist-error" message={errors.dentistId} />
          </div>

          <div>
            <label className="text-sm font-extrabold" htmlFor="booking-date">
              {translations("dateLabel")}
            </label>
            <input
              aria-describedby={errors.date ? "date-error" : undefined}
              aria-invalid={Boolean(errors.date)}
              className={fieldClassName}
              id="booking-date"
              min={new Date().toISOString().slice(0, 10)}
              onChange={(event) => handleDateChange(event.target.value)}
              type="date"
              value={draft.date}
            />
            <FieldError id="date-error" message={errors.date} />
          </div>

          <div>
            <label className="text-sm font-extrabold" htmlFor="booking-time">
              {translations("timeLabel")}
            </label>
            <div className="relative">
              <select
                aria-describedby={errors.time ? "time-error" : undefined}
                aria-invalid={Boolean(errors.time)}
                className={`${fieldClassName} appearance-none pe-10`}
                disabled={
                  availabilityState !== "loaded" || availableTimes.length === 0
                }
                id="booking-time"
                onChange={(event) => setField("time", event.target.value)}
                value={draft.time}
              >
                <option value="">{slotPlaceholder}</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {new Intl.DateTimeFormat(
                      locale === "ur" ? "ur-PK" : "en-PK",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                        timeZone: "Asia/Karachi",
                      },
                    ).format(new Date(`2026-01-01T${time}:00+05:00`))}
                  </option>
                ))}
              </select>
              <SelectArrow />
            </div>
            {availabilityState === "error" ? (
              <p
                className="mt-2 text-sm font-bold text-[var(--danger)]"
                role="alert"
              >
                {translations("availabilityFailed")}
              </p>
            ) : null}
            {availabilityState === "loaded" && availableTimes.length === 0 ? (
              <p className="mt-2 text-sm font-bold text-[var(--muted-text)]">
                {translations("noSlotsDateOnly")}
              </p>
            ) : null}
            <FieldError id="time-error" message={errors.time} />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-extrabold" htmlFor="booking-email">
              {translations("email")}
            </label>
            <input
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={Boolean(errors.email)}
              autoComplete="email"
              className={fieldClassName}
              dir="ltr"
              id="booking-email"
              inputMode="email"
              onChange={(event) => setField("email", event.target.value)}
              placeholder={translations("emailExample")}
              type="email"
              value={draft.email}
            />
            <FieldError id="email-error" message={errors.email} />
          </div>
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--line)] bg-[var(--aqua-soft)] p-4">
          <input
            checked={draft.consent}
            className="mt-0.5 size-5 shrink-0 accent-[var(--teal)]"
            onChange={(event) => setField("consent", event.target.checked)}
            type="checkbox"
          />
          <span className="text-sm leading-6 font-bold">
            {translations("consent")}
          </span>
        </label>
        <FieldError id="consent-error" message={errors.consent} />

        <p className="mt-5 text-sm leading-6 text-[var(--muted-text)]">
          {translations("submissionNotice")}
        </p>
        {submissionError ? (
          <p className="mt-4 font-bold text-[var(--danger)]" role="alert">
            {submissionError}
          </p>
        ) : null}

        <button
          className="mt-6 min-h-13 w-full cursor-pointer rounded-lg bg-[var(--teal-dark)] px-6 py-3.5 text-base font-extrabold text-white shadow-[0_14px_28px_-18px_rgba(4,71,83,0.9)] transition-[background-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-[var(--teal)] hover:text-[var(--primary-ink)] hover:shadow-[0_18px_34px_-16px_rgba(4,71,83,0.75)] disabled:cursor-wait disabled:opacity-65 disabled:hover:translate-y-0"
          disabled={submitting}
          type="submit"
        >
          {submitting ? translations("submitting") : translations("complete")}
        </button>
      </form>
    </section>
  );
}
