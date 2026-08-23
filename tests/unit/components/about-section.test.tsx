import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutSection } from "@/components/ui/about-section";

describe("AboutSection", () => {
  it("uses the committed local clinic images", () => {
    render(<AboutSection locale="en" />);

    expect(
      screen.getAllByRole("img", { name: "Shahbaz Dental Clinic interior" })[0],
    ).toHaveAttribute("src", expect.stringContaining("aboutImage1.avif"));
    expect(
      screen.getAllByRole("img", {
        name: "Dental treatment area at Shahbaz Dental Clinic",
      })[0],
    ).toHaveAttribute("src", expect.stringContaining("aboutImage2.avif"));
  });
});
