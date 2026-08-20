import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DentistCard } from "@/components/content/dentist-card";
import { ServiceCard } from "@/components/content/service-card";
import { demoDentists, demoServices } from "@/content/demo-content";

describe("public demonstration cards", () => {
  it("links a service directly to an allow-listed booking preselection", () => {
    render(
      <ServiceCard
        labels={{
          book: "Book this service",
          duration: "Illustrative duration",
          minutes: "minutes",
        }}
        locale="en"
        service={demoServices[0]!}
      />,
    );

    expect(screen.getByText("Dental consultation")).toBeVisible();
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === "P" &&
          element.textContent === "Illustrative duration: 30 minutes",
      ),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Book this service" }),
    ).toHaveAttribute("href", "/en/book?service=consultation");
  });

  it("discloses a sample dentist and safely preselects that record", () => {
    render(
      <DentistCard
        dentist={demoDentists[0]!}
        labels={{
          book: "Book with this dentist",
          demoBadge: "Demonstration profile",
          languages: "Sample languages",
          workingDays: "Illustrative availability",
        }}
        locale="en"
      />,
    );

    expect(screen.getByText("Demonstration profile")).toBeVisible();
    expect(screen.getByText("Dr. Sana Ahmed")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Book with this dentist" }),
    ).toHaveAttribute("href", "/en/book?dentist=demo-sana");
  });
});
