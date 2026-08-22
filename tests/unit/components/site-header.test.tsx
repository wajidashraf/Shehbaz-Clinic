import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";

const englishLabels = {
  clinicName: "Shahbaz Dental Clinic",
  primaryNavigation: "Primary navigation",
  home: "Home",
  services: "Services",
  dentists: "Dentists",
  contact: "Contact",
  book: "Book appointment",
  mobileNavigation: "Mobile navigation",
  switchLanguage: "اردو",
  openMenu: "Open menu",
  closeMenu: "Close menu",
};

const urduLabels = {
  clinicName: "شہباز ڈینٹل کلینک",
  primaryNavigation: "مرکزی نیویگیشن",
  home: "صفحہ اول",
  services: "خدمات",
  dentists: "ڈینٹسٹس",
  contact: "رابطہ",
  book: "اپائنٹمنٹ بک کریں",
  mobileNavigation: "موبائل نیویگیشن",
  switchLanguage: "English",
  openMenu: "مینو کھولیں",
  closeMenu: "مینو بند کریں",
};

describe("SiteHeader", () => {
  afterEach(() => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  });

  it("contains only the approved English destinations", () => {
    render(<SiteHeader labels={englishLabels} locale="en" />);

    const clinicName = screen.getByText("Shahbaz Dental Clinic");
    expect(clinicName.parentElement).not.toHaveClass("hidden");
    expect(clinicName).toHaveClass("text-[var(--teal-dark)]");
    expect(clinicName).not.toHaveClass("truncate");
    expect(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeInTheDocument();
    expect(screen.getByText("PHC REG # 24988")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "+92 344 3420001" }),
    ).toHaveAttribute("href", "tel:+923443420001");
    expect(screen.getByRole("link", { name: "041-3420001" })).toHaveAttribute(
      "href",
      "tel:0413420001",
    );
    const navigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });
    expect(
      within(navigation).getByRole("link", { name: "Dentists" }),
    ).toHaveAttribute("href", "/en#dentists");
    expect(
      within(navigation).getByRole("link", { name: "Services" }),
    ).toHaveAttribute("href", "/en#services");
    expect(screen.getByRole("link", { name: "اردو" })).toHaveAttribute(
      "href",
      "/ur",
    );
    expect(
      screen.getByRole("link", { name: "Book appointment" }),
    ).toHaveAttribute("href", "/en/book");
    expect(
      screen.queryByRole("link", { name: /login|about/i }),
    ).not.toBeInTheDocument();
  });

  it("provides five touch-friendly mobile destinations without a dropdown menu", () => {
    render(<SiteHeader labels={englishLabels} locale="en" />);

    const navigation = screen.getByRole("navigation", {
      name: "Mobile navigation",
    });
    expect(navigation.getElementsByTagName("a")).toHaveLength(5);
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/en#contact",
    );
    expect(
      screen.queryByRole("button", { name: "Open menu" }),
    ).not.toBeInTheDocument();
  });

  it("preserves Urdu destinations", () => {
    render(<SiteHeader labels={urduLabels} locale="ur" />);

    expect(screen.getByText("شہباز ڈینٹل کلینک")).toBeVisible();
    expect(screen.queryByText("Shahbaz Dental Clinic")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute(
      "href",
      "/en",
    );
    expect(
      screen.getByRole("link", { name: "اپائنٹمنٹ بک کریں" }),
    ).toHaveAttribute("href", "/ur/book");
  });

  it("keeps the top bar height stable when crossing the scroll threshold", () => {
    render(<SiteHeader labels={urduLabels} locale="ur" />);
    const topBar =
      screen.getByText(/Open daily/i).parentElement?.parentElement
        ?.parentElement;

    expect(topBar).toBeTruthy();
    Object.defineProperty(window, "scrollY", { configurable: true, value: 61 });
    fireEvent.scroll(window);

    expect(topBar).not.toHaveClass("max-h-0");
  });
});
