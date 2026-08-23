import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesCarousel } from "@/components/content/services-carousel";
import { demoServices } from "@/content/demo-content";

describe("ServicesCarousel", () => {
  it("renders the first eight local services in a responsive grid", () => {
    render(<ServicesCarousel locale="en" services={demoServices} />);

    expect(
      screen.getByRole("region", { name: "Dental services" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: /dental consultation/i }),
    ).toBeVisible();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(8);
  });
});
