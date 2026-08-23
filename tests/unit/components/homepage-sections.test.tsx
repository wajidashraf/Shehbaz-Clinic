import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutSection } from "@/components/ui/about-section";
import { ClinicHighlights } from "@/components/ui/ClinicHighlights";
import { FaqSection } from "@/components/ui/faq-section";
import { PatientTrustSection } from "@/components/ui/patient-trust-section";

describe("localized homepage sections", () => {
  it("renders the Urdu About region with callable contact information and exact-case assets", () => {
    const { container } = render(<AboutSection locale="ur" />);

    const about = screen.getByRole("region", {
      name: "شہباز ڈینٹل کلینک کے بارے میں",
    });
    const phone = screen.getByRole("link", { name: "+92 344 3420001" });

    expect(about).toHaveAttribute("id", "about");
    expect(about).toHaveClass("scroll-mt-28");
    expect(phone).toHaveAttribute("href", "tel:+923443420001");
    expect(phone).toHaveAttribute("dir", "ltr");
    expect(phone.querySelector("bdi")).toHaveTextContent("+92 344 3420001");
    expect(
      screen.getAllByRole("img", {
        name: "شہباز ڈینٹل کلینک کا اندرونی منظر",
      })[0],
    ).toHaveAttribute("src", expect.stringContaining("aboutImage1.avif"));
    expect(
      screen.getAllByRole("img", {
        name: "شہباز ڈینٹل کلینک کا علاج کا کمرہ",
      })[0],
    ).toHaveAttribute("src", expect.stringContaining("aboutImage2.avif"));
    expect(container.textContent).not.toMatch(/[\u00D8\u00D9\u00DB]/);
  });

  it("selects complete Urdu copy for the highlights, trust, and FAQ sections", () => {
    const { container } = render(
      <>
        <ClinicHighlights locale="ur" />
        <PatientTrustSection locale="ur" />
        <FaqSection locale="ur" />
      </>,
    );

    expect(
      screen.getByRole("region", { name: "کلینک کی نمایاں خصوصیات" }),
    ).toBeVisible();
    expect(screen.getByText("گوگل سے تصدیق شدہ")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "مریض ہم پر اعتماد کیوں کرتے ہیں" }),
    ).toBeVisible();
    expect(screen.getByText("روزانہ دستیابی")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "اکثر پوچھے جانے والے سوالات" }),
    ).toBeVisible();
    expect(
      screen.getByText(
        "دانتوں کے معائنے کے لیے مجھے کتنی بار ڈینٹسٹ کے پاس جانا چاہیے؟",
      ),
    ).toBeVisible();
    expect(container.textContent).not.toMatch(/[\u00D8\u00D9\u00DB]/);
  });

  it("preserves the approved English sentences", () => {
    render(
      <>
        <ClinicHighlights locale="en" />
        <AboutSection locale="en" />
        <PatientTrustSection locale="en" />
        <FaqSection locale="en" />
      </>,
    );

    expect(screen.getByText("Google Verified")).toBeVisible();
    expect(
      screen.getByText(
        "Our mission is to help patients understand their oral health needs and receive appropriate treatment while providing dependable care for routine and advanced dental procedures.",
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Easily accessible on Circular Road in the heart of Samundri.",
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Helpful answers to common questions about dental checkups, treatments, and appointments.",
      ),
    ).toBeVisible();
  });
});
