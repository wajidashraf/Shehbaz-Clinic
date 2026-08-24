import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroSection } from "@/components/layout/HeroSection";

describe("HeroSection", () => {
  it("hides the eyebrow and centers the title and description only on mobile", () => {
    render(<HeroSection locale="en" />);

    expect(
      screen.getByText("Thoughtful dental care in Samundri"),
    ).toHaveClass("hidden", "sm:inline-flex");
    expect(screen.getByRole("heading", { level: 1 })).toHaveClass(
      "text-center",
      "sm:text-left",
    );
    expect(
      screen.getByText(/We deliver personalized dental treatments/),
    ).toHaveClass("text-center", "sm:text-left");
  });

  it("renders complete local English hero copy with booking, call, and image actions", () => {
    render(<HeroSection locale="en" />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Healthy Teeth. Confident Smiles.",
    );
    expect(
      screen.getByRole("link", { name: "Book Appointment" }),
    ).toHaveAttribute("href", "/en/book");
    expect(screen.getByRole("link", { name: "Call now" })).toHaveAttribute(
      "href",
      "tel:+923443420001",
    );
    expect(
      screen.getByAltText("A bright, modern dental treatment room"),
    ).toHaveAttribute("src", expect.stringContaining("dentalRoom.avif"));
  });

  it("renders a natural local Urdu hero title", () => {
    const { container } = render(<HeroSection locale="ur" />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "صحت مند دانت۔ پُراعتماد مسکراہٹیں۔",
    );
    expect(
      screen.getByRole("link", { name: "اپائنٹمنٹ بک کریں" }),
    ).toHaveAttribute("href", "/ur/book");
    expect(screen.getByRole("link", { name: "ابھی کال کریں" })).toHaveAttribute(
      "href",
      "tel:+923443420001",
    );
    expect(
      screen.getByAltText("روشن اور جدید ڈینٹل ٹریٹمنٹ روم"),
    ).toHaveAttribute("src", expect.stringContaining("dentalRoom.avif"));
    expect(container.textContent).not.toMatch(/[\u00D8\u00D9\u00DB]/);
  });
});
