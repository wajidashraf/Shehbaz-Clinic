import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FeaturedDoctorSection } from "@/components/content/featured-doctor-section";
import { demoDentists } from "@/content/demo-content";

describe("FeaturedDoctorSection", () => {
  afterEach(() => vi.useRealTimers());

  it("rotates the configured gallery every four seconds", () => {
    vi.useFakeTimers();
    const doctor = {
      ...demoDentists[3]!,
      featuredImages: [
        { url: "/first.webp", altText: { en: "First view", ur: "First view" } },
        {
          url: "/second.webp",
          altText: { en: "Second view", ur: "Second view" },
        },
      ],
    };
    render(
      <FeaturedDoctorSection
        doctor={doctor}
        labels={{
          book: "Book with this doctor",
          eyebrow: "Featured doctor",
          heading: "Experienced care, close to home",
          pause: "Pause gallery",
          resume: "Resume gallery",
          subheading: "Meet the clinic's featured doctor.",
          workingHours: "Working hours",
        }}
        locale="en"
      />,
    );

    expect(screen.getByTestId("featured-doctor-gallery")).toHaveAttribute(
      "data-active-image",
      "0",
    );
    act(() => vi.advanceTimersByTime(4_000));
    expect(screen.getByTestId("featured-doctor-gallery")).toHaveAttribute(
      "data-active-image",
      "1",
    );
    expect(screen.getByAltText("First view")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("keeps a one-image gallery stable", () => {
    vi.useFakeTimers();
    render(
      <FeaturedDoctorSection
        doctor={demoDentists[3]!}
        labels={{
          book: "Book with this doctor",
          eyebrow: "Featured doctor",
          heading: "Experienced care, close to home",
          pause: "Pause gallery",
          resume: "Resume gallery",
          subheading: "Meet the clinic's featured doctor.",
          workingHours: "Working hours",
        }}
        locale="en"
      />,
    );
    act(() => vi.advanceTimersByTime(12_000));
    expect(screen.getByTestId("featured-doctor-gallery")).toHaveAttribute(
      "data-active-image",
      "0",
    );
  });
});
