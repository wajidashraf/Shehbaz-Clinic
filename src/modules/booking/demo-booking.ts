import { findDemoDentist, findDemoService } from "@/content/demo-content";

export type BookingStep =
  "service" | "dentist" | "time" | "details" | "review" | "confirmation";

export type BookingDraft = {
  serviceId: string;
  dentistId: string;
  date: string;
  time: string;
  fullName: string;
  mobile: string;
  email: string;
  consent: boolean;
};

export type BookingField = keyof BookingDraft;
export type BookingErrors = Partial<Record<BookingField, string>>;

export type BookingValidationMessages = {
  requiredService: string;
  requiredDentist: string;
  requiredDate: string;
  requiredTime: string;
  requiredName: string;
  requiredMobile: string;
  invalidEmail: string;
  requiredConsent: string;
};

const defaultValidationMessages: BookingValidationMessages = {
  requiredService: "Choose a service to continue.",
  requiredDentist: "Choose a dentist or No preference to continue.",
  requiredDate: "Choose an appointment date.",
  requiredTime: "Choose an available time.",
  requiredName: "Enter your full name.",
  requiredMobile: "Enter a valid Pakistani mobile number.",
  invalidEmail: "Enter a valid email address or leave it blank.",
  requiredConsent: "Confirm your consent to create this appointment.",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pakistanMobilePattern = /^03\d{9}$/;

export function createBookingDraft(
  initial: Partial<BookingDraft> = {},
): BookingDraft {
  return {
    serviceId: "",
    dentistId: "",
    date: "",
    time: "",
    fullName: "",
    mobile: "",
    email: "",
    consent: false,
    ...initial,
  };
}

type SearchParams = Record<string, string | string[] | undefined>;

function scalarParam(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

export function resolveBookingPrefill(searchParams: SearchParams): {
  serviceId: string;
  dentistId: string;
} {
  const requestedService = scalarParam(searchParams.service);
  const requestedDentist = scalarParam(searchParams.dentist);

  return {
    serviceId: findDemoService(requestedService)?.id ?? "",
    dentistId:
      requestedDentist === "no-preference"
        ? "no-preference"
        : (findDemoDentist(requestedDentist)?.id ?? ""),
  };
}

export function validateBookingStep(
  step: BookingStep,
  draft: BookingDraft,
  messages: BookingValidationMessages = defaultValidationMessages,
): BookingErrors {
  if (step === "service") {
    return draft.serviceId ? {} : { serviceId: messages.requiredService };
  }

  if (step === "dentist") {
    return draft.dentistId ? {} : { dentistId: messages.requiredDentist };
  }

  if (step === "time") {
    const errors: BookingErrors = {};
    if (!draft.date) errors.date = messages.requiredDate;
    if (!draft.time) errors.time = messages.requiredTime;
    return errors;
  }

  if (step === "details") {
    const errors: BookingErrors = {};
    if (draft.fullName.trim().length < 2) {
      errors.fullName = messages.requiredName;
    }
    if (!pakistanMobilePattern.test(draft.mobile.replace(/\D/g, ""))) {
      errors.mobile = messages.requiredMobile;
    }
    if (draft.email && !emailPattern.test(draft.email.trim())) {
      errors.email = messages.invalidEmail;
    }
    return errors;
  }

  if (step === "review") {
    return draft.consent ? {} : { consent: messages.requiredConsent };
  }

  return {};
}
