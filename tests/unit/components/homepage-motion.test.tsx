import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LocaleSwitch } from "@/components/layout/locale-switch";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppChat } from "@/components/layout/whatsapp-chat";
import { AboutSection } from "@/components/ui/about-section";

const headerLabels = {
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
  switchLanguage: "Urdu",
  theDentist: "The Dentist",
  whatsapp: "WhatsApp",
};

const footerLabels = {
  about: "About",
  addressLabel: "Address",
  book: "Book",
  contact: "Contact",
  daily: "Daily",
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

const chatLabels = {
  askTreatment: "Ask about treatment",
  bookAppointment: "Book an appointment",
  clinicTimings: "Clinic timings",
  close: "Close chat",
  emptyMessage: "Write a message first",
  messageLabel: "Message",
  messagePlaceholder: "Type your message",
  online: "Online",
  open: "Open chat",
  quickQuestions: "Quick questions",
  send: "Send",
  talkToTeam: "Talk to the team",
  welcome: "Welcome",
};

function expectNoPositionalInteraction(element: Element) {
  expect(element.className).not.toMatch(
    /(?:hover|group-hover|active):.*(?:translate|scale)/,
  );
  expect(element.className).not.toMatch(/transition-\[[^\]]*transform[^\]]*\]/);
}

describe("homepage motion contracts", () => {
  it("keeps the locale switch and header brand stable while preserving feedback and narrow-width containment", () => {
    const { rerender } = render(<LocaleSwitch label="Urdu" locale="en" />);

    const localeSwitch = screen.getByRole("link", { name: "Urdu" });
    expectNoPositionalInteraction(localeSwitch);
    expect(localeSwitch).toHaveClass(
      "hover:bg-[var(--aqua-soft)]",
      "hover:shadow-md",
      "focus-visible:ring-2",
    );

    rerender(<SiteHeader labels={headerLabels} locale="en" />);

    const brand = screen.getByRole("link", {
      name: /Shahbaz Dental Clinic.*Home/,
    });
    const brandMark = brand.firstElementChild;

    expect(brand).toHaveClass("min-w-0");
    expect(brandMark).not.toBeNull();
    expectNoPositionalInteraction(brandMark!);
    expect(brandMark).toHaveClass("group-hover:shadow-md");
  });

  it("keeps footer quick links, booking, and social actions fixed on hover", () => {
    render(<SiteFooter labels={footerLabels} locale="en" />);

    const quickLinks = screen.getByRole("navigation", { name: "Quick links" });
    const aboutLink = within(quickLinks).getByRole("link", { name: "About" });
    const bookingLink = screen.getByRole("link", { name: "Book" });
    const socialLink = screen.getByRole("link", { name: "Facebook" });

    for (const control of [aboutLink, bookingLink, socialLink]) {
      expectNoPositionalInteraction(control);
    }
    expect(aboutLink).toHaveClass("hover:text-white");
    expect(bookingLink).toHaveClass(
      "hover:shadow-[0_16px_32px_-18px_rgba(255,255,255,0.55)]",
    );
    expect(socialLink).toHaveClass("hover:bg-white/[0.14]");
  });

  it("keeps the desktop about image cards stable while retaining their shadow feedback", () => {
    render(<AboutSection locale="en" />);

    const imageCards = screen
      .getAllByRole("img", { name: "Shahbaz Dental Clinic interior" })
      .map((image) => image.parentElement);

    for (const card of imageCards) {
      expect(card).not.toBeNull();
      expectNoPositionalInteraction(card!);
    }
    expect(imageCards[1]).toHaveClass(
      "hover:shadow-[0_38px_75px_-28px_rgba(7,48,71,0.58)]",
    );
  });

  it("keeps chat actions fixed while the mobile launcher remains above quick actions", () => {
    render(<WhatsAppChat labels={chatLabels} locale="en" />);

    const launcher = screen.getByRole("button", { name: "Open chat" });
    const launcherRegion = launcher.parentElement;

    expectNoPositionalInteraction(launcher);
    expect(launcher).toHaveClass(
      "hover:bg-[#1fbe5b]",
      "hover:shadow-[0_20px_42px_-16px_rgba(18,86,55,0.8)]",
    );
    expect(launcherRegion).toHaveClass(
      "fixed",
      "bottom-[calc(5.75rem+env(safe-area-inset-bottom))]",
      "md:bottom-6",
    );

    fireEvent.click(launcher);

    const dialog = screen.getByRole("dialog");

    const quickQuestion = within(dialog).getByRole("button", {
      name: "Book an appointment",
    });
    const sendButton = within(dialog).getByRole("button", { name: "Send" });

    expectNoPositionalInteraction(quickQuestion);
    expectNoPositionalInteraction(sendButton);
    expect(quickQuestion).toHaveClass("hover:bg-[var(--aqua-soft)]");
    expect(sendButton).toHaveClass("hover:bg-[#1fbe5b]");
  });
});
