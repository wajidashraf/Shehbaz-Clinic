import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeaturedDoctorSection } from "@/components/content/featured-doctor-section";
import { featuredHomepageDentist } from "@/content/homepage-content";

describe("FeaturedDoctorSection", () => {
  it("renders the local AVIF portrait at the dentist anchor", () => {
    render(
      <FeaturedDoctorSection doctor={featuredHomepageDentist} locale="en" />,
    );

    expect(screen.getByTestId("featured-doctor-section")).toHaveAttribute(
      "id",
      "dentist",
    );
    expect(screen.getByTestId("featured-doctor-section")).toHaveClass(
      "scroll-mt-28",
    );
    expect(
      screen.getByRole("img", {
        name: "Featured dentist at Shahbaz Dental Clinic",
      }),
    ).toHaveAttribute("src", expect.stringContaining("featureDoctor.avif"));
  });

  it("uses the Urdu image alt text for Urdu visitors", () => {
    render(
      <FeaturedDoctorSection doctor={featuredHomepageDentist} locale="ur" />,
    );

    expect(
      screen.getByRole("img", {
        name: "Ø´ÛØ¨Ø§Ø² ÚˆÛŒÙ†Ù¹Ù„ Ú©Ù„ÛŒÙ†Ú© Ú©Û’ Ù†Ù…Ø§ÛŒØ§Úº ÚˆÛŒÙ†Ù¹Ø³Ù¹",
      }),
    ).toHaveAttribute("src", expect.stringContaining("featureDoctor.avif"));
  });

  it.each([
    ["en", "Book Consultation", "/en/book"],
    ["ur", "Ù…Ø´Ø§ÙˆØ±Øª Ø¨Ú© Ú©Ø±ÛŒÚº", "/ur/book"],
  ] as const)(
    "links %s visitors to booking without a profile link",
    (locale, label, href) => {
      render(
        <FeaturedDoctorSection
          doctor={featuredHomepageDentist}
          locale={locale}
        />,
      );

      expect(screen.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        href,
      );
      expect(screen.queryAllByRole("link")).toHaveLength(1);
    },
  );
});
