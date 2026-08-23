import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ClinicContactSection } from "@/components/content/clinic-contact-section";
import { UrgentHelpSection } from "@/components/content/urgent-help-section";
import { HeroSection } from "@/components/layout/HeroSection";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { WhatsAppChat } from "@/components/layout/whatsapp-chat";
import { AboutSection } from "@/components/ui/about-section";
import { HeaderTopBar } from "@/components/ui/headerTopBar";
import { clinicConfig } from "@/config/public-config";

type MutableContactConfig = {
  landlineHref: string;
  phoneHref: string;
  whatsapp: { href: (message?: string) => string };
};

const contactConfig = clinicConfig as unknown as MutableContactConfig;
const originalPhoneHref = contactConfig.phoneHref;
const originalLandlineHref = contactConfig.landlineHref;
const originalWhatsappHref = contactConfig.whatsapp.href;

const contactLabels = {
  address: "Circular Road",
  addressLabel: "Address",
  book: "Book",
  daily: "Daily",
  description: "Contact the clinic.",
  directions: "Directions",
  eyebrow: "Contact",
  hoursLabel: "Hours",
  mapTitle: "Clinic map",
  phoneLabel: "Phone",
  title: "Contact us",
};

const chatLabels = {
  askTreatment: "Ask about treatment",
  bookAppointment: "Book & ask",
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

afterEach(() => {
  contactConfig.phoneHref = originalPhoneHref;
  contactConfig.landlineHref = originalLandlineHref;
  contactConfig.whatsapp.href = originalWhatsappHref;
  vi.restoreAllMocks();
});

describe("homepage contact actions", () => {
  it("uses the configured mobile href in the Hero call action", () => {
    contactConfig.phoneHref = "tel:+923443420009";

    render(<HeroSection locale="en" />);

    expect(screen.getByRole("link", { name: "Call now" })).toHaveAttribute(
      "href",
      "tel:+923443420009",
    );
  });

  it("uses configured phone hrefs in the top bar, urgent help, contact, and about sections", () => {
    contactConfig.phoneHref = "tel:+923443420009";
    contactConfig.landlineHref = "tel:0413420009";

    const { rerender } = render(
      <HeaderTopBar labels={{ address: "Circular Road", openDaily: "Open" }} />,
    );
    expect(
      screen.getByRole("link", { name: clinicConfig.phone }),
    ).toHaveAttribute("href", "tel:+923443420009");
    expect(
      screen.getByRole("link", { name: clinicConfig.landline }),
    ).toHaveAttribute("href", "tel:0413420009");

    rerender(
      <UrgentHelpSection
        labels={{
          action: "Call now",
          description: "Seek urgent local care.",
          eyebrow: "Urgent help",
          title: "This website is not an emergency service",
        }}
      />,
    );
    expect(screen.getByRole("link", { name: "Call now" })).toHaveAttribute(
      "href",
      "tel:+923443420009",
    );

    rerender(<ClinicContactSection labels={contactLabels} locale="ur" />);
    expect(
      screen.getByRole("link", { name: clinicConfig.phone }),
    ).toHaveAttribute("href", "tel:+923443420009");
    expect(
      screen.getByRole("link", { name: clinicConfig.landline }),
    ).toHaveAttribute("href", "tel:0413420009");

    rerender(<AboutSection locale="ur" />);
    expect(
      screen.getByRole("link", { name: clinicConfig.phone }),
    ).toHaveAttribute("href", "tel:+923443420009");
  });

  it("uses the configured base WhatsApp URL in the bottom actions", () => {
    contactConfig.phoneHref = "tel:+923443420009";
    contactConfig.whatsapp.href = () => "https://wa.me/923443420009";

    render(
      <MobileNavigation
        labels={{
          book: "Book",
          call: "Call",
          directions: "Directions",
          mobileNavigation: "Quick actions",
          whatsapp: "WhatsApp",
        }}
        locale="en"
      />,
    );

    expect(screen.getByRole("link", { name: "Call" })).toHaveAttribute(
      "href",
      "tel:+923443420009",
    );
    const whatsapp = screen.getByRole("link", { name: "WhatsApp" });
    expect(whatsapp).toHaveAttribute("href", "https://wa.me/923443420009");
    expect(whatsapp).toHaveAttribute("target", "_blank");
    expect(whatsapp).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("opens WhatsApp using the configured encoded-message URL", () => {
    contactConfig.whatsapp.href = (message) =>
      `https://wa.me/923443420009?text=${encodeURIComponent(message ?? "")}`;
    const open = vi.spyOn(window, "open").mockImplementation(() => null);

    render(<WhatsAppChat labels={chatLabels} locale="en" />);

    fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
    fireEvent.click(screen.getByRole("button", { name: "Book & ask" }));
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(open).toHaveBeenCalledWith(
      "https://wa.me/923443420009?text=Book%20%26%20ask",
      "_blank",
      "noopener,noreferrer",
    );
  });
});
