import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MobileMenu } from "@/components/layout/mobile-menu";

const englishLabels = {
  about: "About",
  closeMenu: "Close menu",
  contact: "Contact",
  mobileNavigation: "Mobile navigation",
  openMenu: "Open menu",
  portfolio: "Portfolio",
  reviews: "Reviews",
  services: "Services",
  switchLanguage: "اردو",
  theDentist: "The Dentist",
};

const urduLabels = {
  about: "ہمارے بارے میں",
  closeMenu: "مینو بند کریں",
  contact: "رابطہ",
  mobileNavigation: "موبائل نیویگیشن",
  openMenu: "مینو کھولیں",
  portfolio: "پورٹ فولیو",
  reviews: "مریضوں کے تاثرات",
  services: "خدمات",
  switchLanguage: "English",
  theDentist: "ڈینٹسٹ",
};

describe("MobileMenu", () => {
  it("keeps the menu trigger visible until the large breakpoint", () => {
    render(<MobileMenu labels={englishLabels} locale="en" />);

    expect(
      screen.getByRole("button", { name: "Open menu" }).parentElement,
    ).toHaveClass("lg:hidden");
  });

  it("opens a labeled panel containing the Portfolio homepage anchor", () => {
    render(<MobileMenu labels={englishLabels} locale="en" />);

    const menuButton = screen.getByRole("button", { name: "Open menu" });
    expect(menuButton).toHaveAttribute(
      "aria-controls",
      "mobile-navigation-panel",
    );
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" }),
    ).not.toBeInTheDocument();

    fireEvent.click(menuButton);

    const navigation = screen.getByRole("navigation", {
      name: "Mobile navigation",
    });
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(
      within(navigation).getByRole("link", { name: "Portfolio" }),
    ).toHaveAttribute("href", "/en#portfolio");
  });

  it("closes after an anchor is activated or Escape is pressed", () => {
    render(<MobileMenu labels={englishLabels} locale="en" />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(screen.getByRole("link", { name: "About" }));
    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" }),
    ).not.toBeInTheDocument();
  });

  it("renders genuine Arabic-script Urdu labels without mojibake", () => {
    render(<MobileMenu labels={urduLabels} locale="ur" />);

    fireEvent.click(screen.getByRole("button", { name: "مینو کھولیں" }));
    const navigation = screen.getByRole("navigation", {
      name: "موبائل نیویگیشن",
    });

    expect(navigation).toHaveTextContent("ہمارے بارے میں");
    expect(navigation).toHaveTextContent("مریضوں کے تاثرات");
    expect(navigation).not.toHaveTextContent(/Ã˜|Ã™|Ã›/);
  });
});
