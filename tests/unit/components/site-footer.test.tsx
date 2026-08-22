import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/layout/site-footer";

const labels = {
  addressLabel: "Address",
  book: "Book",
  daily: "Daily",
  dentists: "Dentists",
  home: "Home",
  hoursLabel: "Hours",
  locality: "Samundri",
  quickLinks: "Quick links",
  rights: "All rights reserved",
  serviceChildren: "Children",
  serviceCleaning: "Cleaning",
  serviceConsultation: "Consultation",
  serviceRootCanal: "Root canal",
  services: "Services",
  summary: "Dental care",
};

describe("SiteFooter", () => {
  it("provides the requested clinic and social links", () => {
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
