"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import {
  demoDentists,
  demoServices,
  findDemoDentist,
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

type BookingWizardProps = {
  initialDentistId: string;
  initialServiceId: string;
  locale: Locale;
};

const steps: readonly BookingStep[] = [
  "service",
  "dentist",
  "time",
  "details",
  "review",
  "confirmation",
];

type ChoiceProps = {
  checked: boolean;
  description?: string;
  label: string;
  name: string;
  onChange: () => void;
  value: string;
};

function Choice({
  checked,
  description,
  label,
  name,
  onChange,
  value,
}: ChoiceProps) {
  return (
    <label
      className={`relative flex min-h-20 cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-[border-color,background-color,box-shadow] ${
        checked
          ? "border-[var(--teal)] bg-[var(--aqua-soft)] shadow-[0_0_0_1px_var(--teal)]"
          : "border-[var(--line)] bg-white hover:border-[var(--line-strong)]"
      }`}
    >
      <input
        aria-label={label}
        checked={checked}
        className="mt-1 size-5 shrink-0 accent-[var(--teal)]"
        name={name}
        onChange={onChange}
        type="radio"
        value={value}
      />
      <span>
        <span className="block font-extrabold">{label}</span>
        {description ? (
          <span className="mt-1 block text-sm leading-6 text-[var(--muted-text)]">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p className="mt-2 text-sm font-bold text-[var(--danger)]" id={id}>
      {message}
    </p>
  ) : null;
}

export function BookingWizard({
  initialDentistId,
  initialServiceId,
  locale,
}: BookingWizardProps) {
  const translations = useTranslations("Booking");
  const [stepIndex, setStepIndex] = useState(0);
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
  const [submissionError, setSubmissionError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const availabilityRequest = useRef<AbortController | null>(null);
  const currentStep = steps[stepIndex]!;

  useEffect(() => {
    return () => availabilityRequest.current?.abort();
  }, []);

  async function loadAvailability(dentistId: string, date: string) {
    availabilityRequest.current?.abort();
    const controller = new AbortController();
    availabilityRequest.current = controller;
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
      if (controller.signal.aborted) return;
      setAvailabilityState("error");
    }
  }

  function handleDentistChange(dentistId: string) {
    availabilityRequest.current?.abort();
    setField("dentistId", dentistId);
    setField("date", "");
    setField("time", "");
    setAvailableTimes([]);
    setAvailabilityState("idle");
  }

  function handleDateChange(date: string) {
    setField("date", date);
    setField("time", "");
    setAvailableTimes([]);
    if (!date || !draft.dentistId) {
      availabilityRequest.current?.abort();
      setAvailabilityState("idle");
      return;
    }
    void loadAvailability(draft.dentistId, date);
  }
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

  async function handleNext() {
    const nextErrors = validateBookingStep(
      currentStep,
      draft,
      validationMessages,
    );
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (currentStep === "review") {
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
      const result = (await response.json()) as { publicReference: string };
      setBookingReference(result.publicReference);
    }

    setErrors({});
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function handleBack() {
    setErrors({});
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function handleRestart() {
    setDraft(createBookingDraft());
    setBookingReference("");
    setSubmissionError("");
    setErrors({});
    setStepIndex(0);
  }

  const selectedService = findDemoService(draft.serviceId);
  const selectedDentist = findDemoDentist(draft.dentistId);
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
  const stepTitle = translations(`${currentStep}Step`);
  const firstError = Object.values(errors)[0];

  if (currentStep === "confirmation") {
    return (
      <section
        aria-labelledby="booking-confirmation-title"
        className="rounded-[2rem] border border-[var(--line)] bg-white p-6 shadow-[0_24px_70px_-44px_rgba(18,48,53,0.55)] sm:p-9"
      >
        <div className="mx-auto max-w-2xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--aqua)] text-2xl font-extrabold text-[var(--teal-dark)]"
          >
            ✓
          </span>
          <p className="mt-6 text-sm font-extrabold text-[var(--teal-dark)]">
            {translations("stepLabel", { current: 6, total: 6 })}
          </p>
          <h2
            className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl"
            id="booking-confirmation-title"
          >
            {translations("confirmationTitle")}
          </h2>
          <p className="mt-4 leading-7 text-[var(--muted-text)]">
            {translations("confirmationDescription")}
          </p>
          <div className="mx-auto mt-7 max-w-sm rounded-2xl bg-[var(--aqua-soft)] p-5">
            <p className="text-xs font-extrabold tracking-[0.12em] text-[var(--teal-dark)] uppercase">
              {translations("appointmentReference")}
            </p>
            <p className="mt-2 text-xl font-extrabold">
              <bdi>{bookingReference}</bdi>
            </p>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              className="min-h-11 cursor-pointer rounded-full bg-[var(--teal)] px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[var(--teal-dark)]"
              onClick={handleRestart}
              type="button"
            >
              {translations("startAgain")}
            </button>
            <Link
              className="inline-flex min-h-11 items-center rounded-full border border-[var(--line-strong)] bg-white px-5 py-3 text-sm font-extrabold transition-colors hover:bg-[var(--aqua-soft)]"
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
      aria-labelledby="booking-step-title"
      className="rounded-[2rem] border border-[var(--line)] bg-white p-5 shadow-[0_24px_70px_-44px_rgba(18,48,53,0.55)] sm:p-8 lg:p-10"
    >
      <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-extrabold text-[var(--teal-dark)]">
            {translations("stepLabel", {
              current: stepIndex + 1,
              total: steps.length,
            })}
          </p>
          <h2
            className="mt-2 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl"
            id="booking-step-title"
          >
            {stepTitle}
          </h2>
        </div>
        <div aria-hidden="true" className="grid grid-cols-6 gap-1.5 sm:w-56">
          {steps.map((step, index) => (
            <span
              className={`h-2 rounded-full ${index <= stepIndex ? "bg-[var(--teal)]" : "bg-[var(--line)]"}`}
              key={step}
            />
          ))}
        </div>
      </div>

      <form
        className="mt-7"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          handleNext();
        }}
      >
        <div aria-live="polite" className="sr-only">
          {firstError ?? ""}
        </div>

        {currentStep === "service" ? (
          <fieldset>
            <legend className="text-sm leading-6 text-[var(--muted-text)]">
              {translations("serviceHelp")}
            </legend>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {demoServices.map((service) => (
                <Choice
                  checked={draft.serviceId === service.id}
                  description={getLocalizedText(service.summary, locale)}
                  key={service.id}
                  label={getLocalizedText(service.name, locale)}
                  name="service"
                  onChange={() => setField("serviceId", service.id)}
                  value={service.id}
                />
              ))}
            </div>
            <FieldError id="service-error" message={errors.serviceId} />
          </fieldset>
        ) : null}

        {currentStep === "dentist" ? (
          <fieldset>
            <legend className="text-sm leading-6 text-[var(--muted-text)]">
              {translations("dentistHelp")}
            </legend>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Choice
                checked={draft.dentistId === "no-preference"}
                description={translations("noPreferenceDescription")}
                label={translations("noPreference")}
                name="dentist"
                onChange={() => handleDentistChange("no-preference")}
                value="no-preference"
              />
              {demoDentists.map((dentist) => (
                <Choice
                  checked={draft.dentistId === dentist.id}
                  description={getLocalizedText(dentist.area, locale)}
                  key={dentist.id}
                  label={getLocalizedText(dentist.name, locale)}
                  name="dentist"
                  onChange={() => handleDentistChange(dentist.id)}
                  value={dentist.id}
                />
              ))}
            </div>
            <FieldError id="dentist-error" message={errors.dentistId} />
          </fieldset>
        ) : null}

        {currentStep === "time" ? (
          <div>
            <p className="text-sm leading-6 text-[var(--muted-text)]">
              {translations("timeHelp")}
            </p>
            <div className="mt-6">
              <label className="font-extrabold" htmlFor="booking-date">
                {translations("dateLabel")}
              </label>
              <input
                className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--line-strong)] bg-white px-4 sm:max-w-sm"
                id="booking-date"
                min={new Date().toISOString().slice(0, 10)}
                onChange={(event) => handleDateChange(event.target.value)}
                type="date"
                value={draft.date}
              />
              <FieldError id="date-error" message={errors.date} />
            </div>
            <fieldset className="mt-7">
              <legend className="font-extrabold">
                {translations("timeLabel")}
              </legend>
              {availabilityState === "loading" ? (
                <p className="mt-3 text-[var(--muted-text)]" role="status">
                  {translations("loadingSlots")}
                </p>
              ) : null}
              {availabilityState === "loaded" && availableTimes.length === 0 ? (
                <p className="mt-3 rounded-2xl bg-[var(--aqua-soft)] p-4 font-bold">
                  {translations("noSlots")}
                </p>
              ) : null}
              {availabilityState === "error" ? (
                <p className="mt-3 text-[var(--danger)]" role="alert">
                  {translations("availabilityFailed")}
                </p>
              ) : null}
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {availableTimes.map((time) => (
                  <Choice
                    checked={draft.time === time}
                    key={time}
                    label={new Intl.DateTimeFormat(
                      locale === "ur" ? "ur-PK" : "en-PK",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                        timeZone: "Asia/Karachi",
                      },
                    ).format(new Date(`2026-01-01T${time}:00+05:00`))}
                    name="time"
                    onChange={() => setField("time", time)}
                    value={time}
                  />
                ))}
              </div>
              <FieldError id="time-error" message={errors.time} />
            </fieldset>
          </div>
        ) : null}

        {currentStep === "details" ? (
          <div>
            <p className="text-sm leading-6 text-[var(--muted-text)]">
              {translations("detailsHelp")}
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="font-extrabold" htmlFor="booking-name">
                  {translations("fullName")}
                </label>
                <input
                  aria-describedby={errors.fullName ? "name-error" : undefined}
                  aria-invalid={Boolean(errors.fullName)}
                  autoComplete="name"
                  className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--line-strong)] bg-white px-4 outline-none transition-shadow focus:border-[var(--teal)] focus:ring-3 focus:ring-[var(--aqua)]"
                  id="booking-name"
                  onChange={(event) => setField("fullName", event.target.value)}
                  placeholder={translations("fullNameExample")}
                  value={draft.fullName}
                />
                <FieldError id="name-error" message={errors.fullName} />
              </div>
              <div>
                <label className="font-extrabold" htmlFor="booking-mobile">
                  {translations("mobile")}
                </label>
                <input
                  aria-describedby={errors.mobile ? "mobile-error" : undefined}
                  aria-invalid={Boolean(errors.mobile)}
                  autoComplete="tel"
                  className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--line-strong)] bg-white px-4 text-start outline-none transition-shadow focus:border-[var(--teal)] focus:ring-3 focus:ring-[var(--aqua)]"
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
                <label className="font-extrabold" htmlFor="booking-email">
                  {translations("email")}
                </label>
                <input
                  aria-describedby={errors.email ? "email-error" : undefined}
                  aria-invalid={Boolean(errors.email)}
                  autoComplete="email"
                  className="mt-2 min-h-12 w-full rounded-2xl border border-[var(--line-strong)] bg-white px-4 text-start outline-none transition-shadow focus:border-[var(--teal)] focus:ring-3 focus:ring-[var(--aqua)]"
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
          </div>
        ) : null}

        {currentStep === "review" ? (
          <div>
            <p className="text-sm leading-6 text-[var(--muted-text)]">
              {translations("reviewHelp")}
            </p>
            <dl className="mt-6 grid gap-4 rounded-3xl bg-[var(--aqua-soft)] p-5 sm:grid-cols-2 sm:p-6">
              {[
                [translations("branch"), translations("branchValue")],
                [
                  translations("selectedService"),
                  selectedService
                    ? getLocalizedText(selectedService.name, locale)
                    : "—",
                ],
                [
                  translations("selectedDentist"),
                  draft.dentistId === "no-preference"
                    ? translations("noPreference")
                    : selectedDentist
                      ? getLocalizedText(selectedDentist.name, locale)
                      : "—",
                ],
                [
                  translations("selectedTime"),
                  `${selectedDate || "—"} · ${selectedTime || "—"}`,
                ],
                [translations("selectedPatient"), draft.fullName],
              ].map(([term, description]) => (
                <div key={term}>
                  <dt className="text-xs font-extrabold tracking-[0.1em] text-[var(--teal-dark)] uppercase">
                    {term}
                  </dt>
                  <dd className="mt-1 font-bold">
                    <bdi>{description}</bdi>
                  </dd>
                </div>
              ))}
            </dl>
            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--line-strong)] bg-white p-4">
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
            {submissionError ? (
              <p className="mt-4 font-bold text-[var(--danger)]" role="alert">
                {submissionError}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-6">
          {stepIndex > 0 ? (
            <button
              className="min-h-11 cursor-pointer rounded-full border border-[var(--line-strong)] bg-white px-5 py-3 text-sm font-extrabold transition-colors hover:bg-[var(--aqua-soft)]"
              onClick={handleBack}
              type="button"
            >
              {translations("back")}
            </button>
          ) : (
            <span />
          )}
          <button
            className="min-h-11 cursor-pointer rounded-full bg-[var(--teal)] px-6 py-3 text-sm font-extrabold text-white transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[var(--teal-dark)]"
            disabled={submitting}
            type="submit"
          >
            {submitting
              ? translations("submitting")
              : currentStep === "review"
                ? translations("complete")
                : translations("continue")}
          </button>
        </div>
      </form>
    </section>
  );
}
