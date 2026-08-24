import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BookingRequestModal } from "@/components/booking/booking-request-modal";

function activateBookingLink(href = "/en/book") {
  const link = document.createElement("a");
  link.dataset.testBookingLink = "true";
  link.href = href;
  link.textContent = "Book Appointment";
  document.body.append(link);
  fireEvent.click(link);
}

describe("BookingRequestModal", () => {
  afterEach(() => {
    cleanup();
    document.querySelectorAll('[data-test-booking-link="true"]').forEach((link) => link.remove());
    window.history.replaceState({}, "", "/");
    vi.restoreAllMocks();
  });

  it("opens from booking links with only the simplified request fields", () => {
    render(<BookingRequestModal locale="en" />);

    activateBookingLink("/en/book?service=cleaning");

    expect(
      screen.getByRole("dialog", { name: "Book Appointment" }),
    ).toBeVisible();
    expect(screen.getByLabelText("Full name")).toBeVisible();
    expect(screen.getByLabelText("Mobile number")).toBeVisible();
    expect(screen.getByLabelText("Mobile number")).toHaveAttribute(
      "placeholder",
      "03xx xxxxxxx",
    );
    expect(screen.getByLabelText("Mobile number")).toHaveAttribute(
      "dir",
      "ltr",
    );
    expect(screen.getByLabelText("Select service")).toHaveValue("cleaning");
    expect(screen.getByLabelText("Preferred date")).toBeVisible();
    expect(screen.getByLabelText("Email (optional)")).toBeVisible();
    expect(
      screen.getByRole("textbox", { name: "Additional details (optional)" }),
    ).toBeVisible();
    expect(screen.getByText("0 / 100 words")).toBeVisible();
    expect(screen.queryByText(/choose a dentist/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/available time/i)).not.toBeInTheDocument();
  });

  it("validates locally and opens WhatsApp with the entered request", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<BookingRequestModal locale="en" />);
    activateBookingLink();

    fireEvent.click(
      screen.getByRole("button", { name: "Send Appointment Request" }),
    );
    expect(screen.getByText("Enter your full name.")).toBeVisible();

    fireEvent.change(screen.getByRole("textbox", { name: /Full name/ }), {
      target: { value: "Ahmad Ali" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /Mobile number/ }), {
      target: { value: "0344 3420001" },
    });
    fireEvent.change(screen.getByLabelText("Select service"), {
      target: { value: "check-up" },
    });
    fireEvent.change(screen.getByLabelText(/Preferred date/), {
      target: { value: "2030-01-15" },
    });
    fireEvent.change(screen.getByLabelText("Email (optional)"), {
      target: { value: "ahmad@example.com" },
    });
    fireEvent.change(
      screen.getByRole("textbox", { name: "Additional details (optional)" }),
      { target: { value: "Pain in the upper-left tooth for two days." } },
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Send Appointment Request" }),
    );

    expect(openSpy).toHaveBeenCalledOnce();
    const whatsappUrl = new URL(String(openSpy.mock.calls[0]?.[0]));
    expect(whatsappUrl.origin).toBe("https://wa.me");
    expect(whatsappUrl.pathname).toBe("/923443420001");
    expect(whatsappUrl.searchParams.get("text")).toContain("Ahmad Ali");
    expect(whatsappUrl.searchParams.get("text")).toContain("+923443420001");
    expect(whatsappUrl.searchParams.get("text")).toContain(
      "General dental check-up",
    );
    expect(whatsappUrl.searchParams.get("text")).toContain("2030-01-15");
    expect(whatsappUrl.searchParams.get("text")).toContain(
      "ahmad@example.com",
    );
    expect(whatsappUrl.searchParams.get("text")).toContain(
      "Pain in the upper-left tooth for two days.",
    );
  });

  it("blocks appointment details longer than 100 words", () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<BookingRequestModal locale="en" />);
    activateBookingLink();

    fireEvent.change(screen.getByRole("textbox", { name: "Full name" }), {
      target: { value: "Ahmad Ali" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Mobile number" }), {
      target: { value: "0344 3420001" },
    });
    fireEvent.change(screen.getByLabelText("Preferred date"), {
      target: { value: "2030-01-15" },
    });
    fireEvent.change(
      screen.getByRole("textbox", { name: "Additional details (optional)" }),
      { target: { value: Array.from({ length: 101 }, () => "pain").join(" ") } },
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Send Appointment Request" }),
    );

    expect(screen.getByText("Please limit details to 100 words.")).toBeVisible();
    expect(screen.getByText("101 / 100 words")).toBeVisible();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it("renders Urdu copy and closes with Escape", () => {
    render(<BookingRequestModal locale="ur" />);
    activateBookingLink("/ur/book");

    expect(
      screen.getByRole("dialog", { name: "اپائنٹمنٹ کی درخواست" }),
    ).toHaveAttribute("dir", "rtl");
    expect(screen.getByLabelText("مریض کا نام")).toBeVisible();
    const dialog = screen.getByRole("dialog");
    expect(dialog.querySelector('input[autocomplete="name"]')).toHaveAttribute(
      "placeholder",
      "مریض کا نام",
    );
    expect(dialog.querySelector('input[autocomplete="tel"]')).toHaveAttribute(
      "placeholder",
      "03xx xxxxxxx",
    );
    expect(dialog.querySelector('input[autocomplete="tel"]')).toHaveAttribute(
      "dir",
      "ltr",
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
