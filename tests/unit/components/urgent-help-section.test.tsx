import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UrgentHelpSection } from "@/components/content/urgent-help-section";

describe("UrgentHelpSection", () => {
  it("centers the urgent heading block only on mobile", () => {
    render(
      <UrgentHelpSection
        labels={{
          action: "Call now",
          description: "Seek urgent local care.",
          eyebrow: "Urgent help",
          title: "This website is not an emergency service",
        }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "This website is not an emergency service",
      }).parentElement,
    ).toHaveClass("text-center", "sm:text-start");
  });

  it("shows both clinic numbers while keeping the original call action", () => {
    render(
      <UrgentHelpSection
        labels={{
          action: "Call now",
          description: "Seek urgent local care.",
          eyebrow: "Urgent help",
          title: "This website is not an emergency service",
        }}
      />,
    );

    expect(screen.getByText("+92 344 3420001")).toBeVisible();
    expect(screen.getByText("041-3420001")).toBeVisible();
    expect(screen.getByRole("link", { name: "Call now" })).toHaveAttribute(
      "href",
      "tel:+923443420001",
    );
  });
});
