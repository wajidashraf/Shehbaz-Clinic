import { describe, expect, it } from "vitest";
import {
  createBookingDraft,
  resolveBookingPrefill,
  validateBookingStep,
} from "@/modules/booking/demo-booking";

describe("booking rules", () => {
  it("accepts only allow-listed service and dentist preselection", () => {
    expect(
      resolveBookingPrefill(
        { dentist: "sobia-ahmad", service: "consultation" },
        ["sobia-ahmad"],
      ),
    ).toEqual({ dentistId: "sobia-ahmad", serviceId: "consultation" });
    expect(
      resolveBookingPrefill({ dentist: "unknown", service: "<script>" }, [
        "sobia-ahmad",
      ]),
    ).toEqual({ dentistId: "", serviceId: "" });
    expect(
      resolveBookingPrefill({ dentist: "no-preference" }, ["sobia-ahmad"])
        .dentistId,
    ).toBe("no-preference");
    expect(
      resolveBookingPrefill({ dentist: "admin-created-doctor" }, [
        "admin-created-doctor",
      ]).dentistId,
    ).toBe("admin-created-doctor");
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

  it("accepts local and +92 Pakistani mobile formats", () => {
    const details = createBookingDraft({
      fullName: "Wajid Ashraf",
      email: "wajid@example.com",
    });

    expect(
      validateBookingStep("details", {
        ...details,
        mobile: "03068010673",
      }),
    ).toEqual({});
    expect(
      validateBookingStep("details", {
        ...details,
        mobile: "+923068010673",
      }),
    ).toEqual({});
  });
});
