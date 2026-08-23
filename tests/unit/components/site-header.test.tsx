import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/layout/site-header";

const englishLabels = {
  about: "About",
  book: "Book appointment",
  bookShort: "Book",
  call: "Call",
  clinicName: "Shahbaz Dental Clinic",
  closeMenu: "Close menu",
  contact: "Contact",
  directions: "Directions",
  home: "Home",
  mobileNavigation: "Mobile navigation",
  openMenu: "Open menu",
  primaryNavigation: "Primary navigation",
  quickActions: "Quick actions",
  reviews: "Reviews",
  services: "Services",
  switchLanguage: "اردو",
  theDentist: "The Dentist",
  whatsapp: "WhatsApp",
};

describe("SiteHeader", () => {
  it("renders the exact ordered desktop anchors and booking destination", () => {
    render(<SiteHeader labels={englishLabels} locale="en" />);

    const navigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });
    const links = within(navigation).getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual([
      "About",
      "Services",
      "The Dentist",
      "Reviews",
      "Contact",
      "اردو",
      "Book appointment",
    ]);
    expect(links.slice(0, 5).map((link) => link.getAttribute("href"))).toEqual([
      "/en#about",
      "/en#services",
      "/en#dentist",
      "/en#reviews",
      "/en#contact",
    ]);
    expect(
      within(navigation).queryByRole("link", { name: "Home" }),
    ).not.toBeInTheDocument();
    expect(
      within(navigation).queryByRole("link", { name: "Dentists" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Shahbaz Dental Clinic — Home" }),
    ).toHaveAttribute("href", "/en");
    expect(
      within(navigation).getByRole("link", { name: "Book appointment" }),
    ).toHaveAttribute("href", "/en/book");
  });

  it("renders localized quick actions with their expected destinations", () => {
    render(<SiteHeader labels={englishLabels} locale="en" />);

    const quickActions = screen.getByRole("navigation", {
      name: "Quick actions",
    });

    expect(
      within(quickActions).getByRole("link", { name: "Call" }),
    ).toHaveAttribute("href", "tel:+923443420001");
    expect(
      within(quickActions).getByRole("link", { name: "WhatsApp" }),
    ).toHaveAttribute("href", "https://wa.me/923443420001");
    expect(
      within(quickActions).getByRole("link", { name: "WhatsApp" }),
    ).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      within(quickActions).getByRole("link", { name: "Book" }),
    ).toHaveAttribute("href", "/en/book");
    expect(
      within(quickActions).getByRole("link", { name: "Directions" }),
    ).toHaveAttribute("href", "https://maps.app.goo.gl/L3pRisdzNg4QYJ8e9");
    expect(
      within(quickActions).getByRole("link", { name: "Directions" }),
    ).toHaveAttribute("target", "_blank");
    expect(
      within(quickActions).getByRole("link", { name: "Directions" }),
    ).toHaveAttribute("rel", "noopener noreferrer");
  });
});
