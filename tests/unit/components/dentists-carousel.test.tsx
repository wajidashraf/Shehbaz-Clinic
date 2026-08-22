import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DentistsCarousel } from "@/components/content/dentists-carousel";
import { demoDentists } from "@/content/demo-content";

describe("DentistsCarousel", () => {
  it("mounts every doctor as a draggable carousel slide", () => {
    render(
      <DentistsCarousel
        dentists={demoDentists.slice(0, 3)}
        labels={{
          carousel: "Clinic dentists",
          demoBadge: "Clinic dentist",
          next: "Next dentist",
          previous: "Previous dentist",
          viewProfile: "View profile",
        }}
        locale="en"
      />,
    );

    const carousel = screen.getByRole("region", { name: "Clinic dentists" });
    expect(screen.getByText("Dr. Sobia Zulfiqar")).toBeVisible();
    expect(screen.getByText("Dr. Amna Baig")).toBeInTheDocument();
    expect(screen.getByText("Dr. Ahmed Mobeen")).toBeInTheDocument();
    expect(carousel.querySelectorAll("[data-embla-slide]")).toHaveLength(3);
  });
});
