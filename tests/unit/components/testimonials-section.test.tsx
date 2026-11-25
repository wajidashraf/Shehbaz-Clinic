import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TestimonialsSection } from "@/components/layout/testimonials-section";
import { clinicConfig } from "@/config/public-config";

describe("TestimonialsSection", () => {
  it("centers its summary heading block only on mobile", () => {
    render(<TestimonialsSection locale="en" />);

    expect(
      screen.getByRole("heading", { name: "Patient Reviews" }).parentElement,
    ).toHaveClass("text-center", "sm:text-start");
  });

  it("renders English reviews at the approved homepage anchor", () => {
    render(<TestimonialsSection locale="en" />);

    const section = screen.getByTestId("testimonials-section");

    expect(section).toHaveAttribute("id", "reviews");
    expect(section).toHaveClass("scroll-mt-28");
    expect(section).toHaveAttribute("aria-labelledby", "reviews-heading");

    expect(
      screen.getByRole("heading", { name: "Patient Reviews" }),
    ).toBeVisible();
    expect(screen.getByText("larainb Bushra")).toBeVisible();
    expect(screen.getByText("Mian Usman")).toBeVisible();
    expect(
      screen.getByText(
        /I am extremely satisfied with my overall experience\. The clinic is very hygienic, well-maintained, and provides a comfortable environment for patients\./,
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        /the doctor was professional and gentle though the procedure\. The was clean and hygienic and disposable kit and instrument made me feel safe and comfortable/,
      ),
    ).toBeVisible();
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(2);
    for (const card of cards) {
      expect(within(card).getByText("Google Review")).toBeVisible();
      expect(within(card).getByLabelText("5 out of 5 stars")).toBeVisible();
    }
  });

  it("renders natural Urdu review content without mojibake", () => {
    const { container } = render(<TestimonialsSection locale="ur" />);

    expect(
      screen.getByRole("heading", { name: "مریضوں کے تاثرات" }),
    ).toBeVisible();
    expect(screen.getByText("لرینب بشریٰ")).toBeVisible();
    expect(screen.getByText("میاں عثمان")).toBeVisible();
    expect(
      screen.getByText("گوگل میپس پر 150 جائزوں کی بنیاد پر۔"),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "گوگل پر تمام جائزے دیکھیں" }),
    ).toBeVisible();
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(2);
    for (const card of cards) {
      expect(within(card).getByLabelText("۵ میں سے ۵ ستارے")).toBeVisible();
      expect(within(card).getByText("گوگل جائزہ")).toBeVisible();
    }

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
