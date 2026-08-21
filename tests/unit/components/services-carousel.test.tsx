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
          book: "Book this service",
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
    act(() => vi.advanceTimersByTime(4_000));
    expect(carousel).toHaveAttribute("data-active-service", "1");
    fireEvent.click(screen.getByRole("button", { name: "Previous service" }));
    expect(carousel).toHaveAttribute("data-active-service", "0");
    fireEvent.mouseEnter(screen.getAllByRole("article")[0]!.parentElement!);
    act(() => vi.advanceTimersByTime(8_000));
    expect(carousel).toHaveAttribute("data-active-service", "0");
  });
});
