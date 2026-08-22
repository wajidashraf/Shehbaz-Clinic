import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DoctorProfile } from "@/components/content/doctor-profile";
import { demoDentists } from "@/content/demo-content";

const labels = {
  about: "About this dentist",
  book: "Book Appointment",
  bookingDescription: "Continue with this dentist selected.",
  bookingTitle: "Plan an appointment",
  education: "Education and training",
  focusAreas: "Areas of focus",
  profile: "Doctor profile",
  registration: "Registration",
  workingDays: "Working days",
};

describe("DoctorProfile", () => {
  it("offers booking on a clinician's full profile", () => {
    render(<DoctorProfile doctor={demoDentists[0]!} labels={labels} locale="en" />);

    expect(screen.getByRole("heading", { level: 1, name: "Dr. Sobia Zulfiqar" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "About this dentist" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Education and training" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Areas of focus" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Plan an appointment" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Book Appointment" })).toHaveAttribute(
      "href",
      "/en/book?dentist=sobia-zulfiqar",
    );
  });

  it("never offers booking on Dr. Manzoor Shahbaz's informational profile", () => {
    render(<DoctorProfile doctor={demoDentists[3]!} labels={labels} locale="en" />);

    expect(screen.getByRole("heading", { level: 1, name: "Dr. Manzoor Shahbaz" })).toBeVisible();
    expect(screen.queryByRole("link", { name: "Book Appointment" })).not.toBeInTheDocument();
  });
});
