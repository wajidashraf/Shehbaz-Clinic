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
      biography: {
        en: "A complete biography that must remain readable below the registration number on wide screens, including every important detail about the doctor's experience and patient care approach.",
        ur: "A complete biography that must remain readable below the registration number on wide screens, including every important detail about the doctor's experience and patient care approach.",
      },
      workingDays: { en: "Monday to Sunday", ur: "Monday to Sunday" },
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
          eyebrow: "Featured doctor",
          heading: "Experienced care, close to home",
          pause: "Pause gallery",
          resume: "Resume gallery",
          focus: "Professional focus",
          specialty: "Specialty",
          subheading: "Meet the clinic's featured doctor.",
          viewProfile: "View profile",
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
    expect(
      screen.queryByText("Executive leadership at Shahbaz Dental Clinic"),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Professional focus")).toBeVisible();
    expect(screen.getByTestId("featured-doctor-badge")).toHaveTextContent(
      doctor.title.en,
    );
    const biography = screen.getByText(doctor.biography.en);
    expect(biography).not.toHaveClass("lg:line-clamp-3");
    expect(biography.parentElement).not.toHaveClass("lg:overflow-hidden");
    expect(screen.queryByText("Working hours")).not.toBeInTheDocument();
    expect(screen.queryByText("Monday to Sunday")).not.toBeInTheDocument();
    expect(screen.getByTestId("featured-doctor-section")).toHaveClass(
      "bg-[var(--mineral)]",
      "border-y",
      "shadow-[inset_0_1px_0_var(--line),inset_0_-1px_0_var(--line),0_18px_50px_-38px_var(--teal-dark)]",
    );
    expect(screen.getByTestId("featured-doctor-section")).not.toHaveClass(
      "lg:h-[100svh]",
    );
    expect(screen.getByRole("article")).toHaveClass("rounded-lg");
    expect(screen.getByRole("article")).not.toHaveClass("lg:h-[64svh]");
    expect(screen.getByTestId("featured-doctor-gallery")).toHaveClass(
      "rounded-lg",
      "border",
      "shadow-[0_18px_45px_-24px_var(--teal-dark)]",
    );
    expect(screen.getByRole("link", { name: "View profile" })).toHaveClass(
      "absolute",
      "right-6",
      "top-6",
    );
    expect(screen.getByTestId("featured-doctor-content")).toContainElement(
      screen.getByRole("link", { name: "View profile" }),
    );
    expect(screen.getByTestId("featured-doctor-gallery")).toContainElement(
      screen.getByRole("button", { name: "Pause gallery" }),
    );
  });

  it("keeps a one-image gallery stable", () => {
    vi.useFakeTimers();
    render(
      <FeaturedDoctorSection
        doctor={demoDentists[3]!}
        labels={{
          eyebrow: "Featured doctor",
          heading: "Experienced care, close to home",
          pause: "Pause gallery",
          resume: "Resume gallery",
          focus: "Professional focus",
          specialty: "Specialty",
          subheading: "Meet the clinic's featured doctor.",
          viewProfile: "View profile",
        }}
        locale="en"
      />,
    );
    act(() => vi.advanceTimersByTime(12_000));
    expect(screen.getByTestId("featured-doctor-gallery")).toHaveAttribute(
      "data-active-image",
      "0",
    );
    expect(screen.getByRole("link", { name: "View profile" })).toHaveAttribute(
      "href",
      "/en/dentists/manzoor-shahbaz",
    );
    expect(
      screen.queryByRole("link", { name: /book/i }),
    ).not.toBeInTheDocument();
  });
});
