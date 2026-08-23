import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TestimonialsSection } from "@/components/layout/testimonials-section";
import { clinicConfig } from "@/config/public-config";

describe("TestimonialsSection", () => {
  it("renders English reviews at the approved homepage anchor", () => {
    render(<TestimonialsSection locale="en" />);

    const section = screen.getByTestId("testimonials-section");

    expect(section).toHaveAttribute("id", "reviews");
    expect(section).toHaveClass("scroll-mt-28");
    expect(section).toHaveAttribute("aria-labelledby", "reviews-heading");

    expect(
      screen.getByRole("heading", { name: "Patient Reviews" }),
    ).toBeVisible();
    expect(screen.getByText("Rana Ali")).toBeVisible();
    expect(screen.getByText("Masood Ali")).toBeVisible();
    expect(
      screen.getByText(
        /Doctor are very nice and well experienced in their field\. Clinic is very neat and clean\. Staff behaviour very satisfied\./,
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        /I live in New York City, but I am coming to Shahbaz Dental Clinic Samundri\./,
      ),
    ).toBeVisible();
    expect(screen.getAllByText("Google Review")).toHaveLength(2);
    expect(screen.getByLabelText("4 out of 5 stars")).toBeVisible();
    expect(screen.getByLabelText("5 out of 5 stars")).toBeVisible();
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("renders natural Urdu review content without mojibake", () => {
    const { container } = render(<TestimonialsSection locale="ur" />);

    expect(
      screen.getByRole("heading", { name: "مریضوں کے تاثرات" }),
    ).toBeVisible();
    expect(screen.getByText("رانا علی")).toBeVisible();
    expect(screen.getByText("مسعود علی")).toBeVisible();
    expect(
      screen.getByText("گوگل میپس پر تقریباً 44 جائزوں کی بنیاد پر۔"),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "گوگل پر تمام جائزے دیکھیں" }),
    ).toBeVisible();
    expect(screen.getByLabelText("۵ میں سے ۴ ستارے")).toBeVisible();
    expect(screen.getAllByText("گوگل جائزہ")).toHaveLength(2);

    for (const marker of ["Ã˜", "Ã™", "Ã›"]) {
      expect(container.textContent).not.toContain(marker);
    }
  });

  it("links securely to the clinic's complete Google review listing", () => {
    render(<TestimonialsSection locale="en" />);

    const reviewsLink = screen.getByRole("link", {
      name: "View All Reviews",
    });

    expect(reviewsLink).toHaveAttribute("href", clinicConfig.mapsUrl);
    expect(reviewsLink).toHaveAttribute("target", "_blank");
    expect(reviewsLink).toHaveAttribute("rel", "noopener noreferrer");
  });
});
