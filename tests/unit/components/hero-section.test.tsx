import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HeroSection } from "@/components/layout/HeroSection";

const copy: Record<string, string> = {
  book: "Book Appointment",
  demoTitle: "Plan your visit",
  description: "Comfortable care with a clear booking process.",
  explore: "Explore services",
  eyebrow: "Dental care in Samundri",
  imageAlt: "Bright dental treatment room",
  registrationLabel: "PHC registration",
  title: "Your trusted partner in dental health",
};

describe("HeroSection", () => {
  it("keeps one primary heading and scrolls service exploration to the homepage section", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    render(<HeroSection home={(key) => copy[key] ?? key} locale="en" />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(copy.title);
    expect(heading.parentElement).toHaveClass("lg:pe-8");
    const exploreLink = screen.getByRole("link", { name: "Explore services" });
    expect(exploreLink).toHaveAttribute("href", "/en#services");
    expect(
      screen.getByRole("link", { name: "Book Appointment" }).querySelector("svg"),
    ).toHaveClass(
      "hidden",
      "lg:inline-block",
    );
    expect(screen.getByAltText("Bright dental treatment room")).toBeVisible();
    expect(screen.getByText("Dental care in Samundri")).toHaveClass("hidden");
    expect(consoleError.mock.calls.flat().join(" ")).not.toContain(
      "Invalid DOM property",
    );
    consoleError.mockRestore();
  });
});
