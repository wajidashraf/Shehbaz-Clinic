import { describe, expect, it } from "vitest";
import {
  appointmentSmsText,
  normalizePakistanSmsRecipient,
} from "@/modules/notifications/appointment-sms";

describe("appointment SMS", () => {
  it("normalizes supported Pakistani mobile formats for Brevo", () => {
    expect(normalizePakistanSmsRecipient("0300 1234567")).toBe("923001234567");
    expect(normalizePakistanSmsRecipient("+92 300 1234567")).toBe(
      "923001234567",
    );
    expect(normalizePakistanSmsRecipient("3001234567")).toBe("923001234567");
    expect(normalizePakistanSmsRecipient("041-3420001")).toBeNull();
  });

  it("includes the confirmed appointment details in English", () => {
    expect(
      appointmentSmsText({
        dentistName: "Dr. Sobia Zulfiqar",
        locale: "en",
        publicReference: "SDC-2026-ABC123",
        serviceName: "Dental consultation",
        startAtUtc: new Date("2026-09-01T05:00:00.000Z"),
      }),
    ).toBe(
      "Shahbaz Dental Clinic: Appointment SDC-2026-ABC123 is confirmed. Dental consultation with Dr. Sobia Zulfiqar on 1 Sept 2026 at 10:00 am. Call 041-3420001.",
    );
  });

  it("includes the confirmed appointment details in Urdu", () => {
    const message = appointmentSmsText({
      dentistName: "ڈاکٹر ثوبیہ ذوالفقار",
      locale: "ur",
      publicReference: "SDC-2026-ABC123",
      serviceName: "دانتوں کا مشورہ",
      startAtUtc: new Date("2026-09-01T05:00:00.000Z"),
    });

    expect(message).toContain(
      "آپ کی اپائنٹمنٹ SDC-2026-ABC123 کی تصدیق ہو گئی ہے",
    );
    expect(message).toContain("ڈاکٹر ثوبیہ ذوالفقار");
    expect(message).toContain("041-3420001");
  });

  it("uses the requested date and follow-up note when no time is assigned", () => {
    expect(
      appointmentSmsText({
        dentistName: "Dr. Sobia Zulfiqar",
        locale: "en",
        publicReference: "SDC-2026-DATE01",
        requestedDateKey: "2026-08-31",
        serviceName: "Dental consultation",
      }),
    ).toBe(
      "Shahbaz Dental Clinic: Appointment SDC-2026-DATE01 is booked for 31 Aug 2026. The time will be informed as soon as possible via WhatsApp or phone call. Call 041-3420001.",
    );
  });

  it("uses the Urdu follow-up note for a date-only booking", () => {
    const message = appointmentSmsText({
      dentistName: "ڈاکٹر ثوبیہ ذوالفقار",
      locale: "ur",
      publicReference: "SDC-2026-DATE02",
      requestedDateKey: "2026-08-31",
      serviceName: "دانتوں کا مشورہ",
    });

    expect(message).toContain("SDC-2026-DATE02");
    expect(message).toContain("واٹس ایپ یا فون کال");
    expect(message).toContain("041-3420001");
  });
});
