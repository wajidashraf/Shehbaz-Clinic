import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PortfolioSection } from "@/components/ui/PortfolioSection";

const imageOrder = [1, 4, 6, 10, 11, 2, 3, 5, 7, 8, 9, 12, 13, 14, 15, 16];

describe("PortfolioSection", () => {
  it("shows clinic photos in the requested order without stock photos", () => {
    render(<PortfolioSection locale="en" />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(16);
    expect(
      images.map((image) => {
        const source = decodeURIComponent(image.getAttribute("src") ?? "");
        const match = source.match(/locationImage \((\d+)\)\.(?:jpeg|png)/);
        return match ? Number(match[1]) : null;
      }),
    ).toEqual(imageOrder);
    expect(images.every((image) => image.getAttribute("alt"))).toBe(true);
  });

  it("uses Urdu image descriptions for the Urdu gallery", () => {
    render(<PortfolioSection locale="ur" />);

    expect(
      screen.getByRole("region", { name: "ہماری ڈینٹل کیئر کی ایک جھلک" }),
    ).toHaveAttribute("dir", "rtl");
    expect(screen.getAllByRole("img")[0]).toHaveAttribute(
      "alt",
      "شہباز ڈینٹل کلینک کا بیرونی منظر",
    );
  });
});
