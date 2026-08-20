import { describe, expect, it } from "vitest";
import {
  bookingRequestSchema,
  createNotificationDrafts,
  isNotificationRetryEligible,
} from "@/modules/appointments/contracts";

describe("appointment contracts", () => {
  const validBooking = {
    serviceId: "consultation",
    dentistId: "sobia-ahmad",
    dateKey: "2026-09-01",
    time: "09:30",
    patientName: "Ali Khan",
    mobile: "+923001234567",
    email: "ali@example.com",
    locale: "en",
    consent: true,
  };

  it("accepts the minimum guest booking information", () => {
    expect(bookingRequestSchema.parse(validBooking)).toEqual(validBooking);
  });

  it("rejects unknown dentists and missing consent", () => {
    expect(
      bookingRequestSchema.safeParse({
        ...validBooking,
        dentistId: "unknown",
        consent: false,
      }).success,
    ).toBe(false);
  });

  it("rejects a booking date that does not exist", () => {
    expect(
      bookingRequestSchema.safeParse({
        ...validBooking,
        dateKey: "2026-02-31",
      }).success,
    ).toBe(false);
  });

  it("creates real email work and pending-provider SMS work", () => {
    expect(
      createNotificationDrafts({
        appointmentReference: "SDC-2026-ABC123",
        email: "ali@example.com",
        mobile: "+923001234567",
        event: "booking-confirmed",
      }),
    ).toEqual([
      {
        appointmentReference: "SDC-2026-ABC123",
        channel: "email",
        event: "booking-confirmed",
        recipient: "ali@example.com",
        status: "queued",
      },
      {
        appointmentReference: "SDC-2026-ABC123",
        channel: "sms",
        event: "booking-confirmed",
        recipient: "+923001234567",
        status: "pending-provider",
      },
    ]);
  });

  it("allows retry only for failed email delivery", () => {
    expect(
      isNotificationRetryEligible({ channel: "email", status: "failed" }),
    ).toBe(true);
    expect(
      isNotificationRetryEligible({ channel: "email", status: "queued" }),
    ).toBe(true);
    expect(
      isNotificationRetryEligible({ channel: "email", status: "sent" }),
    ).toBe(false);
    expect(
      isNotificationRetryEligible({ channel: "sms", status: "failed" }),
    ).toBe(false);
    expect(
      isNotificationRetryEligible({
        channel: "sms",
        status: "pending-provider",
      }),
    ).toBe(false);
  });
});
