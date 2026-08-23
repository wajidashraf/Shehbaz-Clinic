import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TestimonialsSection } from "@/components/layout/testimonials-section";

describe("TestimonialsSection", () => {
  it("renders the local review summary and Google review cards", () => {
    render(<TestimonialsSection />);

    expect(
      screen.getByRole("heading", { name: "Patient Reviews" }),
    ).toBeVisible();
    expect(screen.getByText("Rana Ali")).toBeVisible();
    expect(screen.getByText("Masood Ali")).toBeVisible();
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("links to the clinic's complete Google review listing", () => {
    render(<TestimonialsSection />);

    expect(
      screen.getByRole("link", { name: "View All Reviews" }),
    ).toHaveAttribute("target", "_blank");
  });
});
