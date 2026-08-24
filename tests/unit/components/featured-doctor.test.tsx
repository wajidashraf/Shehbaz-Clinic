import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeaturedDoctorSection } from "@/components/content/featured-doctor-section";
import { featuredHomepageDentist } from "@/content/homepage-content";

describe("FeaturedDoctorSection", () => {
  it("centers the dentist heading block only on mobile", () => {
    render(
      <FeaturedDoctorSection doctor={featuredHomepageDentist} locale="en" />,
    );

    expect(
      screen.getByRole("heading", { name: "Dr. Sobia Zulfiqar" })
        .parentElement,
    ).toHaveClass("text-center", "sm:text-left");
  });

  it("renders Dr. Sobia's local AVIF portrait at the dentist anchor", () => {
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
        name: "Portrait of Dr. Sobia Zulfiqar",
      }),
    ).toHaveAttribute("src", expect.stringContaining("featureDoctor.avif"));
    expect(
      screen.getByRole("heading", { name: "Dr. Sobia Zulfiqar" }),
    ).toBeVisible();
  });

  it("uses the Urdu image alt text for Urdu visitors", () => {
    render(
      <FeaturedDoctorSection doctor={featuredHomepageDentist} locale="ur" />,
    );

    expect(
      screen.getByRole("img", {
        name: "ڈاکٹر صوبیہ ذوالفقار کی تصویر",
      }),
    ).toHaveAttribute("src", expect.stringContaining("featureDoctor.avif"));
  });

  it("renders genuine Urdu dentist details without mojibake", () => {
    render(
      <FeaturedDoctorSection doctor={featuredHomepageDentist} locale="ur" />,
    );

    const section = screen.getByTestId("featured-doctor-section");
    expect(
      screen.getByRole("heading", { name: "ڈاکٹر صوبیہ ذوالفقار" }),
    ).toBeVisible();
    expect(screen.getByText("رجسٹریشن")).toBeVisible();
    expect(screen.getByText("تجربہ")).toBeVisible();
    expect(section).toHaveTextContent("سال");
    expect(section).toHaveTextContent("پریکٹس کا آغاز");
    expect(
      screen.getByRole("link", { name: "مشاورت بک کریں" }),
    ).toHaveAttribute("href", "/ur/book");
    expect(section).not.toHaveTextContent(/[ØÙÛ]/);
  });

  it.each([
    ["en", "Book Consultation", "/en/book"],
    ["ur", "مشاورت بک کریں", "/ur/book"],
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
