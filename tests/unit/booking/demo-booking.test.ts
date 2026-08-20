import { describe, expect, it } from "vitest";
import {
  createBookingDraft,
  resolveBookingPrefill,
  validateBookingStep,
} from "@/modules/booking/demo-booking";

describe("booking rules", () => {
  it("accepts only allow-listed service and dentist preselection", () => {
    expect(
      resolveBookingPrefill({
        dentist: "sobia-ahmad",
        service: "consultation",
      }),
    ).toEqual({ dentistId: "sobia-ahmad", serviceId: "consultation" });
    expect(
      resolveBookingPrefill({
        dentist: "unknown",
        service: "<script>",
      }),
    ).toEqual({ dentistId: "", serviceId: "" });
    expect(resolveBookingPrefill({ dentist: "no-preference" }).dentistId).toBe(
      "no-preference",
    );
  });

  it("requires a service and a dentist choice", () => {
    const draft = createBookingDraft();

    expect(validateBookingStep("service", draft)).toEqual({
      serviceId: "Choose a service to continue.",
    });
    expect(
      validateBookingStep("dentist", {
        ...draft,
        serviceId: "consultation",
      }),
    ).toEqual({
      dentistId: "Choose a dentist or No preference to continue.",
    });
  });

  it("validates time, minimum contact details, and booking consent", () => {
    const draft = createBookingDraft({
      dentistId: "no-preference",
      serviceId: "consultation",
    });

    expect(validateBookingStep("time", draft)).toEqual({
      date: "Choose an appointment date.",
      time: "Choose an available time.",
    });
    expect(
      validateBookingStep("details", {
        ...draft,
        email: "not-an-email",
        fullName: "A",
        mobile: "123",
      }),
    ).toEqual({
      email: "Enter a valid email address or leave it blank.",
      fullName: "Enter your full name.",
      mobile: "Enter a valid Pakistani mobile number.",
    });
    expect(validateBookingStep("review", draft)).toEqual({
      consent: "Confirm your consent to create this appointment.",
    });
  });
});
