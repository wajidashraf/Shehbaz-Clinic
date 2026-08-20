import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BookingWizard } from "@/components/booking/booking-wizard";
import englishMessages from "@/messages/en.json";

describe("BookingWizard", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("loads live availability and confirms a guest appointment", async () => {
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
    render(
      <NextIntlClientProvider locale="en" messages={englishMessages}>
        <BookingWizard initialDentistId="" initialServiceId="" locale="en" />
      </NextIntlClientProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(
      screen.getByText("Choose a service to continue.", { selector: "p" }),
    ).toBeVisible();

    await user.click(screen.getByLabelText("Dental consultation"));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await user.click(screen.getByLabelText("No preference"));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await user.type(screen.getByLabelText("Appointment date"), "2026-09-01");
    await user.click(await screen.findByRole("radio", { name: /10:00/i }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await user.type(screen.getByLabelText("Full name"), "Ali Khan");
    await user.type(screen.getByLabelText("Mobile number"), "0300 0000000");
    await user.click(screen.getByRole("button", { name: "Continue" }));

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
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  });
});
