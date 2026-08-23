import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ServicesCarousel } from "@/components/content/services-carousel";
import { demoServices } from "@/content/demo-content";

describe("ServicesCarousel", () => {
  it("renders eight English services as informational tiles without detail links", () => {
    render(<ServicesCarousel locale="en" services={demoServices} />);

    expect(
      screen.getByRole("region", { name: "Dental services" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: /dental consultation/i }),
    ).toBeVisible();
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(8);
    expect(
      screen
        .queryAllByRole("link")
        .filter((link) => link.getAttribute("href")?.includes("/services/")),
    ).toHaveLength(0);
  });

  it("keeps localized Urdu service names visible without service navigation", () => {
    render(<ServicesCarousel locale="ur" services={demoServices} />);

    for (const name of [
      "دانتوں کا مشورہ",
      "عمومی دانتوں کا معائنہ",
      "دانتوں کی صفائی",
      "دانت کی فلنگ",
      "روٹ کینال کا معائنہ",
      "دانت نکلوانے کا معائنہ",
      "بچوں کے دانتوں کی ملاقات",
      "دانت سیدھے کرنے کا مشورہ",
    ]) {
      expect(screen.getByRole("heading", { name })).toBeVisible();
    }
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(8);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });
});
