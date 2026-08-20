import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { BookingWizard } from "@/components/booking/booking-wizard";
import englishMessages from "@/messages/en.json";

describe("BookingWizard", () => {
  it("completes six demonstration steps without claiming a real booking", async () => {
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

    await user.click(screen.getByLabelText("Tuesday · Demo date"));
    await user.click(screen.getByLabelText("10:00 AM"));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await user.type(screen.getByLabelText("Full name"), "Ali Khan");
    await user.type(screen.getByLabelText("Mobile number"), "0300 0000000");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await user.click(
      screen.getByRole("checkbox", {
        name: /I understand this is a demonstration/,
      }),
    );
    await user.click(
      screen.getByRole("button", { name: "Complete demo booking" }),
    );

    expect(screen.getByText("The demonstration is complete")).toBeVisible();
    expect(
      screen.getByText(
        "No appointment was created, no time was reserved, and no message was sent. The final booking system will show a real reference here after verification.",
      ),
    ).toBeVisible();
    expect(screen.getByText("DEMO-SDC-001")).toBeVisible();
  });
});
