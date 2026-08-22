import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { demoDentists } from "@/content/demo-content";
import englishMessages from "@/messages/en.json";
import urduMessages from "@/messages/ur.json";

function renderBookingForm(locale: "en" | "ur" = "en") {
  return render(
    <NextIntlClientProvider
      locale={locale}
      messages={locale === "ur" ? urduMessages : englishMessages}
    >
      <BookingWizard
        dentists={demoDentists}
        initialDentistId=""
        initialServiceId=""
        locale={locale}
      />
    </NextIntlClientProvider>,
  );
}

describe("BookingWizard", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("shows every booking field in one form and confirms an appointment", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ slots: [{ time: "10:00" }] }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ publicReference: "SDC-2026-ABC123" }), {
          status: 201,
          headers: { "content-type": "application/json" },
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderBookingForm();

    expect(screen.getByLabelText("Full name")).toBeVisible();
    expect(screen.getByLabelText("Mobile number")).toBeVisible();
    expect(screen.getByLabelText("Service")).toBeVisible();
    expect(screen.getByLabelText("Dentist")).toBeVisible();
    expect(screen.getByLabelText("Appointment date")).toBeVisible();
    expect(screen.getByLabelText("Available time")).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: "Continue" }),
    ).not.toBeInTheDocument();

    await user.type(screen.getByLabelText("Full name"), "Ali Khan");
    await user.type(screen.getByLabelText("Mobile number"), "0300 0000000");
    await user.selectOptions(screen.getByLabelText("Service"), "consultation");
    await user.selectOptions(screen.getByLabelText("Dentist"), "no-preference");
    await user.type(screen.getByLabelText("Appointment date"), "2026-09-01");
    await user.selectOptions(
      await screen.findByLabelText("Available time"),
      "10:00",
    );
    await user.click(
      screen.getByRole("checkbox", {
        name: /I consent to Shahbaz Dental Clinic storing these details/,
      }),
    );
    await user.click(
      screen.getByRole("button", { name: "Confirm appointment" }),
    );

    expect(
      await screen.findByText("Your appointment is confirmed"),
    ).toBeVisible();
    expect(screen.getByText("SDC-2026-ABC123")).toBeVisible();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/v1/appointments",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          serviceId: "consultation",
          dentistId: "no-preference",
          dateKey: "2026-09-01",
          time: "10:00",
          patientName: "Ali Khan",
          mobile: "0300 0000000",
          email: "",
          locale: "en",
          consent: true,
        }),
      }),
    );
  });

  it("renders the single form with Urdu labels", () => {
    renderBookingForm("ur");

    expect(screen.getByLabelText(urduMessages.Booking.fullName)).toBeVisible();
    expect(
      screen.getByLabelText(urduMessages.Booking.selectedService),
    ).toBeVisible();
    expect(
      screen.getByLabelText(urduMessages.Booking.selectedDentist),
    ).toBeVisible();
    expect(screen.getByLabelText(urduMessages.Booking.dateLabel)).toBeVisible();
    expect(screen.getByLabelText(urduMessages.Booking.timeLabel)).toBeVisible();
    expect(
      screen.getByRole("button", { name: urduMessages.Booking.complete }),
    ).toBeVisible();
  });

  it("submits a date-only booking when the server confirms there are no slots", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ slots: [] }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            publicReference: "SDC-2026-DATE01",
            status: "confirmed",
            timePending: true,
          }),
          {
            status: 201,
            headers: { "content-type": "application/json" },
          },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    renderBookingForm();

    await user.type(screen.getByLabelText("Full name"), "Ali Khan");
    await user.type(screen.getByLabelText("Mobile number"), "0300 0000000");
    await user.selectOptions(screen.getByLabelText("Service"), "consultation");
    await user.selectOptions(screen.getByLabelText("Dentist"), "no-preference");
    await user.type(screen.getByLabelText("Appointment date"), "2026-08-31");

    expect(
      await screen.findByText(
        "No time is currently available. You can still book this date, and the clinic will inform you of the time as soon as possible via WhatsApp or phone call.",
      ),
    ).toBeVisible();
    await user.click(
      screen.getByRole("checkbox", {
        name: /I consent to Shahbaz Dental Clinic storing these details/,
      }),
    );
    await user.click(
      screen.getByRole("button", { name: "Confirm appointment" }),
    );

    expect(
      await screen.findByText(
        "Your appointment time will be informed as soon as possible via WhatsApp or phone call.",
      ),
    ).toBeVisible();
    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/v1/appointments",
      expect.objectContaining({
        body: expect.stringContaining('"time":""'),
      }),
    );
  });

  it("stops showing a loading state when availability does not respond", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_input: RequestInfo | URL, options?: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            options?.signal?.addEventListener(
              "abort",
              () => reject(new DOMException("Aborted", "AbortError")),
              { once: true },
            );
          }),
      ),
    );
    renderBookingForm();

    fireEvent.change(screen.getByLabelText("Dentist"), {
      target: { value: "no-preference" },
    });
    vi.useFakeTimers();
    fireEvent.change(screen.getByLabelText("Appointment date"), {
      target: { value: "2026-09-01" },
    });
    expect(
      screen.getByRole("option", {
        name: englishMessages.Booking.loadingSlots,
      }),
    ).toBeInTheDocument();

    await act(async () => vi.advanceTimersByTimeAsync(10_001));

    expect(screen.getByRole("alert")).toHaveTextContent(
      englishMessages.Booking.availabilityFailed,
    );
  });

  it("uses the doctor records supplied by the server", () => {
    render(
      <NextIntlClientProvider locale="en" messages={englishMessages}>
        <BookingWizard
          dentists={[demoDentists[4]!]}
          initialDentistId=""
          initialServiceId=""
          locale="en"
        />
      </NextIntlClientProvider>,
    );

    expect(
      screen.getByRole("option", { name: "Dr. Rana Muhammad Adnan" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("option", { name: "Dr. Sobia Zulfiqar" }),
    ).not.toBeInTheDocument();
  });
});
