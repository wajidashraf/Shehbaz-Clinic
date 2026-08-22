import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DentistCard } from "@/components/content/dentist-card";
import { ServiceCard } from "@/components/content/service-card";
import { demoDentists, demoServices } from "@/content/demo-content";

describe("public clinic cards", () => {
  it("links a service directly to an allow-listed booking preselection", () => {
    render(
      <ServiceCard
        labels={{
          book: "Book this service",
          duration: "Appointment duration",
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
          element?.tagName === "SPAN" &&
          element.textContent === "Appointment duration: 30 minutes",
      ),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Book this service" }),
    ).toHaveAttribute("href", "/en/book?service=consultation");
  });

  it("presents concise dentist information and links to the localized profile", () => {
    render(
      <DentistCard
        dentist={demoDentists[0]!}
        labels={{
          demoBadge: "Clinic dentist",
          viewProfile: "View profile",
        }}
        locale="en"
      />,
    );

    expect(screen.getByText("Clinic dentist")).toBeVisible();
    expect(screen.getByText("Dr. Sobia Zulfiqar")).toBeVisible();
    expect(screen.getByText("BDS, RDS (Punjab), RDS")).toBeVisible();
    expect(screen.getByText("PM&DC — 13365-D")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "View profile" }),
    ).toHaveAttribute("href", "/en/dentists/sobia-zulfiqar");
    expect(
      screen.queryByRole("link", { name: /book/i }),
    ).not.toBeInTheDocument();
  });
});
