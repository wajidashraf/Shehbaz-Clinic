import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";

const englishLabels = {
  primaryNavigation: "Primary navigation",
  home: "Home",
  services: "Services",
  book: "Book an appointment",
  login: "Patient login",
  switchLanguage: "اردو",
};

const urduLabels = {
  primaryNavigation: "مرکزی نیویگیشن",
  home: "صفحۂ اول",
  services: "خدمات",
  book: "اپائنٹمنٹ بک کریں",
  login: "مریض لاگ اِن",
  switchLanguage: "English",
};

describe("SiteHeader", () => {
  it("offers Urdu from the English navigation", () => {
    render(<SiteHeader labels={englishLabels} locale="en" />);

    expect(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "اردو" })).toHaveAttribute(
      "href",
      "/ur",
    );
    expect(
      screen.getByRole("link", { name: "Book an appointment" }),
    ).toHaveAttribute("href", "/en/book");
  });

  it("offers English from the Urdu navigation", () => {
    render(<SiteHeader labels={urduLabels} locale="ur" />);

    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/en",
    );
    expect(
      screen.getByRole("link", { name: "اپائنٹمنٹ بک کریں" }),
    ).toHaveAttribute("href", "/ur/book");
  });
});
