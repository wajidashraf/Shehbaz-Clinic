import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionHeading } from "@/components/ui/section-heading";

describe("SectionHeading", () => {
  it("centers a start-aligned heading block only on mobile", () => {
    render(
      <SectionHeading
        description="A helpful description"
        eyebrow="Services"
        title="Dental treatments"
      />,
    );

    expect(screen.getByRole("heading").parentElement).toHaveClass(
      "text-center",
      "sm:text-start",
    );
  });
});
