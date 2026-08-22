import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesDirectory } from "@/components/content/services-directory";
import { demoServices } from "@/content/demo-content";

describe("ServicesDirectory", () => {
  it("filters the shared service records by category", () => {
    render(
      <ServicesDirectory
        labels={{
          all: "All services",
          book: "Book this service",
          duration: "Appointment duration",
          minutes: "minutes",
          viewDetails: "View service details",
        }}
        locale="en"
        services={demoServices}
      />,
    );

    expect(screen.getAllByTestId("service-directory-card")).toHaveLength(8);
    const preventive = screen.getByRole("button", {
      name: "Preventive care",
    });
    fireEvent.click(preventive);
    expect(preventive).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByTestId("service-directory-card")).toHaveLength(2);
    expect(screen.getByText("General dental check-up")).toBeVisible();
    expect(screen.queryByText("Dental filling")).not.toBeInTheDocument();
    expect(
      screen
        .getAllByRole("link", { name: "View service details" })
        .find((link) => link.getAttribute("href") === "/en/services/check-up"),
    ).toBeVisible();
  });
});
