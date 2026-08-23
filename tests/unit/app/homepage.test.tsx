import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async () => (key: string) => key),
  setRequestLocale: vi.fn(),
}));

vi.mock("@/modules/doctors/doctor.repository", () => ({
  listDoctors: vi.fn(() => {
    throw new Error("The doctor repository must not run for the homepage.");
  }),
}));

vi.mock("@/modules/testimonials/testimonial.repository", () => ({
  listPublishedTestimonials: vi.fn(() => {
    throw new Error(
      "The testimonial repository must not run for the homepage.",
    );
  }),
}));

import HomePage from "@/app/[locale]/page";

describe("HomePage", () => {
  it("renders when the doctor and testimonial repositories are unavailable", async () => {
    render(await HomePage({ params: Promise.resolve({ locale: "en" }) }));

    expect(screen.getByTestId("featured-doctor-section")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Book Consultation" }),
    ).toHaveAttribute("href", "/en/book");
  });
});
