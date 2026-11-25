import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TestimonialsSection } from "@/components/layout/testimonials-section";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function visibleNames() {
  return screen
    .getAllByRole("article")
    .map((card) => card.querySelector("p.truncate")?.textContent);
}

describe("review rotation", () => {
  it("advances one card every four seconds and loops through all seven reviews", () => {
    vi.useFakeTimers();
    const { container } = render(<TestimonialsSection locale="en" />);
    const track = container.querySelector(".review-carousel-track")!;
    expect(visibleNames()).toEqual(["larainb Bushra", "Mian Usman"]);
    expect(screen.getByLabelText("4.7 out of 5 stars")).toBeVisible();
    expect(
      screen.getByText("Based on 150 reviews on Google Maps."),
    ).toBeVisible();
    const pairs = [
      ["Mian Usman", "Mrs Rana"],
      ["Mrs Rana", "Rana Mudassar"],
      ["Rana Mudassar", "Ayyan Kamboh"],
      ["Ayyan Kamboh", "Sairah Sairah"],
      ["Sairah Sairah", "Malik Shahid"],
      ["Malik Shahid", "larainb Bushra"],
      ["larainb Bushra", "Mian Usman"],
    ];
    for (const pair of pairs) {
      act(() => vi.advanceTimersByTime(3_999));
      expect(track).not.toHaveClass("review-carousel-moving");
      act(() => vi.advanceTimersByTime(1));
      expect(track).toHaveClass("review-carousel-moving");
      fireEvent.transitionEnd(track, { propertyName: "transform" });
      expect(visibleNames()).toEqual(pair);
    }
  });

  it("pauses while focused and resumes after focus leaves", () => {
    vi.useFakeTimers();
    const { container } = render(<TestimonialsSection locale="en" />);
    const carousel = container.querySelector(".review-carousel")!;
    const track = container.querySelector(".review-carousel-track")!;
    fireEvent.focus(carousel);
    act(() => vi.advanceTimersByTime(8_000));
    expect(track).not.toHaveClass("review-carousel-moving");
    fireEvent.blur(carousel);
    act(() => vi.advanceTimersByTime(4_000));
    expect(track).toHaveClass("review-carousel-moving");
  });

  it("keeps the initial pair still when reduced motion is requested", () => {
    vi.useFakeTimers();
    const original = window.matchMedia;
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      ...original(query),
      matches: true,
    }));
    const { container } = render(<TestimonialsSection locale="ur" />);
    act(() => vi.advanceTimersByTime(12_000));
    expect(container.querySelector(".review-carousel-track")).not.toHaveClass(
      "review-carousel-moving",
    );
    expect(visibleNames()).toEqual(["لرینب بشریٰ", "میاں عثمان"]);
  });
});
