import { describe, expect, it } from "vitest";
import {
  createBookingDraft,
  resolveBookingPrefill,
  validateBookingStep,
} from "@/modules/booking/demo-booking";

describe("demonstration booking rules", () => {
  it("accepts only allow-listed service and dentist preselection", () => {
    expect(
      resolveBookingPrefill({
        dentist: "demo-sana",
        service: "consultation",
      }),
    ).toEqual({ dentistId: "demo-sana", serviceId: "consultation" });
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

  it("validates time, minimum contact details, and demonstration consent", () => {
    const draft = createBookingDraft({
      dentistId: "no-preference",
      serviceId: "consultation",
    });

    expect(validateBookingStep("time", draft)).toEqual({
      date: "Choose a demonstration date.",
      time: "Choose a demonstration time.",
    });
    expect(
      validateBookingStep("details", {
        ...draft,
        email: "not-an-email",
        fullName: "A",
        mobile: "123",
      }),
    ).toEqual({
      email: "Enter a valid sample email address or leave it blank.",
      fullName: "Enter a sample full name.",
      mobile: "Enter a sample Pakistani mobile number.",
    });
    expect(validateBookingStep("review", draft)).toEqual({
      consent: "Confirm that you understand this is only a demonstration.",
    });
  });
});
