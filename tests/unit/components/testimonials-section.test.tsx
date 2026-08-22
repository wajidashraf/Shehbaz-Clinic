import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TestimonialsSection } from "@/components/layout/testimonials-section";
import type { TestimonialRecord } from "@/modules/testimonials/testimonial.types";

const labels = {
  eyebrow: "Patient stories",
  heading: "Care patients remember",
  description: "Real experiences from our clinic.",
  pointOne: "Clear explanations",
  pointTwo: "Gentle treatment",
  pointThree: "Modern dental care",
  book: "Book appointment",
  previous: "Previous review",
  next: "Next review",
  pause: "Pause reviews",
  resume: "Resume reviews",
};

const testimonial: TestimonialRecord = {
  id: "review-ayesha",
  name: { en: "Ayesha Khan", ur: "عائشہ خان" },
  treatment: { en: "Dental cleaning", ur: "دانتوں کی صفائی" },
  review: {
    en: "The clinic explained every step clearly and treated me gently.",
    ur: "کلینک نے ہر مرحلہ واضح کیا اور بہت نرمی سے علاج کیا۔",
  },
  dateKey: "2026-08-18",
  image: null,
  isPublished: true,
  sortOrder: 20,
};

describe("TestimonialsSection", () => {
  it("renders records supplied by the server and uses a default patient avatar", () => {
    render(
      <TestimonialsSection
        labels={labels}
        locale="en"
        testimonials={[testimonial]}
      />,
    );

    expect(screen.getByText("Ayesha Khan")).toBeVisible();
    expect(screen.getByText("Dental cleaning")).toBeVisible();
    expect(screen.getByText(testimonial.review.en)).toBeVisible();
    expect(screen.getByRole("img", { name: "Ayesha Khan" })).toHaveAttribute(
      "src",
      expect.stringContaining("default-avatar.svg"),
    );
  });

  it("renders the Urdu testimonial fields and localized date", () => {
    render(
      <TestimonialsSection
        labels={labels}
        locale="ur"
        testimonials={[testimonial]}
      />,
    );

    expect(screen.getByText("عائشہ خان")).toBeVisible();
    expect(screen.getByText("دانتوں کی صفائی")).toBeVisible();
    expect(screen.getByText(testimonial.review.ur)).toBeVisible();
    expect(screen.getByText(/2026/)).toBeVisible();
  });

  it("does not render an empty testimonial section", () => {
    const { container } = render(
      <TestimonialsSection labels={labels} locale="en" testimonials={[]} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("mounts every review as a responsive carousel slide", () => {
    const testimonials = [
      testimonial,
      {
        ...testimonial,
        id: "review-usman",
        name: { en: "Usman Ali", ur: "عثمان علی" },
      },
      {
        ...testimonial,
        id: "review-mariam",
        name: { en: "Mariam Noor", ur: "مریم نور" },
      },
    ];
    render(
      <TestimonialsSection
        labels={labels}
        locale="en"
        testimonials={testimonials}
      />,
    );

    const section = screen.getByTestId("testimonials-section");
    expect(section).toHaveClass("bg-[var(--aqua-light)]");
    expect(screen.getByText("Ayesha Khan")).toBeInTheDocument();
    expect(screen.getByText("Usman Ali")).toBeInTheDocument();
    expect(screen.getByText("Mariam Noor")).toBeInTheDocument();
    expect(section.querySelectorAll("[data-embla-slide]")).toHaveLength(3);
  });

  it("keeps an explicit pause selected after hover ends", () => {
    render(
      <TestimonialsSection
        labels={labels}
        locale="en"
        testimonials={[
          testimonial,
          { ...testimonial, id: "review-two", name: { en: "Ali", ur: "علی" } },
        ]}
      />,
    );
    const carousel = screen.getByRole("region", {
      name: "Care patients remember",
    });

    fireEvent.mouseEnter(carousel);
    fireEvent.click(screen.getByRole("button", { name: "Pause reviews" }));
    fireEvent.mouseLeave(carousel);

    expect(
      screen.getByRole("button", { name: "Resume reviews" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("waits three seconds before autoplay advances a review", async () => {
    const timeoutSpy = vi.spyOn(window, "setTimeout");

    try {
      render(
        <TestimonialsSection
          labels={labels}
          locale="en"
          testimonials={[
            testimonial,
            {
              ...testimonial,
              id: "review-two",
              name: { en: "Ali", ur: "Ø¹Ù„ÛŒ" },
            },
          ]}
        />,
      );

      await waitFor(() =>
        expect(timeoutSpy).toHaveBeenCalledWith(expect.any(Function), 3_000),
      );
    } finally {
      timeoutSpy.mockRestore();
    }
  });
});
