import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/layout/site-footer";

const labels = {
  about: "About",
  addressLabel: "Address",
  book: "Book",
  contact: "Contact",
  daily: "Daily",
  dentists: "Dentists",
  home: "Home",
  hoursLabel: "Hours",
  locality: "Samundri",
  quickLinks: "Quick links",
  reviews: "Reviews",
  rights: "All rights reserved",
  serviceChildren: "Children",
  serviceCleaning: "Cleaning",
  serviceConsultation: "Consultation",
  serviceRootCanal: "Root canal",
  services: "Services",
  summary: "Dental care",
  theDentist: "The Dentist",
};

const approvedQuickLinks = [
  ["About", "/en#about"],
  ["Services", "/en#services"],
  ["The Dentist", "/en#dentist"],
  ["Reviews", "/en#reviews"],
  ["Contact", "/en#contact"],
] as const;

describe("SiteFooter", () => {
  it("uses exactly the approved homepage anchors for quick links", () => {
    render(<SiteFooter labels={labels} locale="en" />);

    const quickLinks = screen.getByRole("navigation", { name: "Quick links" });
    const links = within(quickLinks).getAllByRole("link");

    expect(links).toHaveLength(5);
    expect(
      links.map((link) => [link.textContent, link.getAttribute("href")]),
    ).toEqual(approvedQuickLinks);
    expect(within(quickLinks).queryByRole("link", { name: "Home" })).toBeNull();
    expect(
      within(quickLinks).queryByRole("link", { name: "Dentists" }),
    ).toBeNull();
    expect(screen.getByRole("link", { name: "Book" })).toHaveAttribute(
      "href",
      "/en/book",
    );
  });

  it("preserves the requested external social links", () => {
    render(<SiteFooter labels={labels} locale="en" />);

    for (const name of [
      "Facebook",
      "LinkedIn",
      "Marham",
      "Oladoc",
      "Instagram",
      "X",
      "TikTok",
    ]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link.querySelector("svg, img")).toBeInTheDocument();
    }
    expect(screen.getByLabelText("Social links")).toHaveClass("lg:justify-end");
  });
});
