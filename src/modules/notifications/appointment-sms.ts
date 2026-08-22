import type { Locale } from "@/i18n/config";

type AppointmentSmsBase = {
  dentistName: string;
  locale: Locale;
  publicReference: string;
  serviceName: string;
};

type AppointmentSmsInput = AppointmentSmsBase &
  (
    | { requestedDateKey?: string; startAtUtc: Date }
    | { requestedDateKey: string; startAtUtc?: undefined }
  );

export function normalizePakistanSmsRecipient(mobile: string): string | null {
  const digits = mobile.replace(/\D/g, "");
  const normalized = digits.startsWith("0092")
    ? digits.slice(2)
    : digits.startsWith("92")
      ? digits
      : digits.startsWith("0")
        ? `92${digits.slice(1)}`
        : `92${digits}`;

  return /^923\d{9}$/.test(normalized) ? normalized : null;
}

export function appointmentSmsText(input: AppointmentSmsInput): string {
  if (!input.startAtUtc) {
    const requestedDate = new Intl.DateTimeFormat(
      input.locale === "ur" ? "ur-PK" : "en-PK",
      {
        day: "numeric",
        month: "short",
        timeZone: "Asia/Karachi",
        year: "numeric",
      },
    ).format(new Date(`${input.requestedDateKey}T00:00:00+05:00`));

    if (input.locale === "ur") {
      return `شہباز ڈینٹل کلینک: اپائنٹمنٹ ${input.publicReference}، ${requestedDate} کے لیے بک ہو گئی ہے۔ وقت سے جلد از جلد واٹس ایپ یا فون کال کے ذریعے آگاہ کیا جائے گا۔ رابطہ: 041-3420001`;
    }

    return `Shahbaz Dental Clinic: Appointment ${input.publicReference} is booked for ${requestedDate}. The time will be informed as soon as possible via WhatsApp or phone call. Call 041-3420001.`;
  }

  const date = new Intl.DateTimeFormat(
    input.locale === "ur" ? "ur-PK" : "en-PK",
    {
      day: "numeric",
      month: "short",
      timeZone: "Asia/Karachi",
      year: "numeric",
    },
  ).format(input.startAtUtc);
  const time = new Intl.DateTimeFormat(
    input.locale === "ur" ? "ur-PK" : "en-PK",
    {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Karachi",
    },
  ).format(input.startAtUtc);

  if (input.locale === "ur") {
    return `شہباز ڈینٹل کلینک: آپ کی اپائنٹمنٹ ${input.publicReference} کی تصدیق ہو گئی ہے۔ ${input.serviceName}، ${input.dentistName} کے ساتھ ${date} کو ${time} بجے۔ رابطہ: 041-3420001`;
  }

  return `Shahbaz Dental Clinic: Appointment ${input.publicReference} is confirmed. ${input.serviceName} with ${input.dentistName} on ${date} at ${time}. Call 041-3420001.`;
}
