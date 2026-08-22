import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ServicesCarousel } from "@/components/content/services-carousel";
import { demoServices } from "@/content/demo-content";

describe("ServicesCarousel", () => {
  afterEach(() => vi.useRealTimers());

  it("advances every four seconds, pauses on hover, and supports navigation", () => {
    vi.useFakeTimers();
    render(
      <ServicesCarousel
        labels={{
          book: "View service details",
          duration: "Appointment duration",
          minutes: "minutes",
          next: "Next service",
          previous: "Previous service",
        }}
        locale="en"
        services={demoServices.slice(0, 3)}
      />,
    );

    const carousel = screen.getByTestId("services-carousel");
    expect(carousel).toHaveAttribute("data-active-service", "0");
    expect(carousel.querySelectorAll("[data-carousel-card]")).toHaveLength(3);
    expect(
      carousel.querySelectorAll("[data-carousel-card] article"),
    ).toHaveLength(3);
    expect(
      carousel.querySelectorAll('[data-position="previous"]'),
    ).toHaveLength(1);
    expect(carousel.querySelectorAll('[data-position="active"]')).toHaveLength(
      1,
    );
    expect(carousel.querySelectorAll('[data-position="next"]')).toHaveLength(1);
    expect(carousel.querySelector('[data-position="active"]')).toHaveClass(
      "lg:w-[34%]",
    );
    expect(
      carousel.querySelector('[data-carousel-card][data-position="previous"]'),
    ).toHaveClass("blur-[1px]");
    expect(
      carousel.querySelector('[data-carousel-card][data-position="active"]'),
    ).toHaveTextContent("Dental consultation");
    const incomingCard = carousel.querySelector('[data-service-id="check-up"]');
    expect(incomingCard).toHaveAttribute("data-position", "next");
    expect(incomingCard).toHaveClass("duration-300");
    expect(incomingCard).toHaveClass(
      "ease-[cubic-bezier(0.65,0,0.35,1)]",
    );
    expect(
      screen.getByRole("link", { name: "View service details" }),
    ).toHaveAttribute("href", "/en/services#consultation");
    act(() => vi.advanceTimersByTime(4_000));
    expect(carousel).toHaveAttribute("data-active-service", "1");
    expect(incomingCard).toHaveAttribute("data-position", "active");
    expect(
      carousel.querySelector('[data-carousel-card][data-position="active"]'),
    ).toHaveTextContent("General dental check-up");
    fireEvent.click(screen.getByRole("button", { name: "Previous service" }));
    expect(carousel).toHaveAttribute("data-active-service", "0");
    fireEvent.mouseEnter(screen.getAllByRole("article")[0]!.parentElement!);
    act(() => vi.advanceTimersByTime(8_000));
    expect(carousel).toHaveAttribute("data-active-service", "0");
  });
});
