import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";

const englishLabels = {
  primaryNavigation: "Primary navigation",
  home: "Home",
  services: "Services",
  dentists: "Dentists",
  book: "Book appointment",
  switchLanguage: "اردو",
  openMenu: "Open menu",
  closeMenu: "Close menu",
};

const urduLabels = {
  primaryNavigation: "مرکزی نیویگیشن",
  home: "صفحہ اول",
  services: "خدمات",
  dentists: "ڈینٹسٹس",
  book: "اپائنٹمنٹ بک کریں",
  switchLanguage: "English",
  openMenu: "مینو کھولیں",
  closeMenu: "مینو بند کریں",
};

describe("SiteHeader", () => {
  it("contains only the approved English destinations", () => {
    render(<SiteHeader labels={englishLabels} locale="en" />);

    expect(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dentists" })).toHaveAttribute(
      "href",
      "/en/dentists",
    );
    expect(screen.getByRole("link", { name: "اردو" })).toHaveAttribute(
      "href",
      "/ur",
    );
    expect(
      screen.getByRole("link", { name: "Book appointment" }),
    ).toHaveAttribute("href", "/en/book");
    expect(
      screen.queryByRole("link", { name: /login|about|contact/i }),
    ).not.toBeInTheDocument();
  });

  it("opens and closes the accessible mobile menu", async () => {
    const user = userEvent.setup();
    render(<SiteHeader labels={englishLabels} locale="en" />);

    const openButton = screen.getByRole("button", { name: "Open menu" });
    expect(openButton).toHaveAttribute("aria-expanded", "false");

    await user.click(openButton);

    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByTestId("mobile-navigation")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.queryByTestId("mobile-navigation")).not.toBeInTheDocument();
  });

  it("preserves Urdu destinations", () => {
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
