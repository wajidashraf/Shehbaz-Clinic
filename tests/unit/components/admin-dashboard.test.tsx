import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

const { router } = vi.hoisted(() => ({
  router: { replace: vi.fn(), refresh: vi.fn() },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

const emptyAdminData = {
  doctors: [],
  doctorNames: {},
  schedules: [],
  appointments: [],
  notifications: [],
  testimonials: [],
};

describe("AdminDashboard", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("includes testimonial management in the administration dashboard", () => {
    render(<AdminDashboard initialData={emptyAdminData} />);

    expect(screen.getByRole("heading", { name: "Testimonials" })).toBeVisible();
    expect(screen.getByText("No testimonials added yet.")).toBeVisible();
  });

  it("offers a retry control for failed email delivery", async () => {
    const failedEmail = {
      _id: "507f1f77bcf86cd799439011",
      appointmentReference: "SDC-2026-ABC123",
      channel: "email" as const,
      event: "booking-confirmed",
      status: "failed",
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            ...emptyAdminData,
            notifications: [{ ...failedEmail, status: "sent" }],
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(
      <AdminDashboard
        initialData={{ ...emptyAdminData, notifications: [failedEmail] }}
      />,
    );
    await user.click(
      await screen.findByRole("button", { name: "Retry email" }),
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Notification sent.",
    );
    expect(screen.queryByRole("button", { name: "Retry email" })).toBeNull();
  });

  it("shows the requested date when an appointment time is pending", () => {
    render(
      <AdminDashboard
        initialData={{
          ...emptyAdminData,
          appointments: [
            {
              publicReference: "SDC-2026-DATE01",
              dentistId: "sobia-zulfiqar",
              serviceId: "dental-checkup",
              requestedDateKey: "2026-08-31",
              startAtUtc: null,
              durationMinutes: null,
              patientName: "Ahmad Ali",
              mobile: "03001234567",
              email: null,
              status: "confirmed" as const,
            },
          ],
        }}
      />,
    );

    expect(screen.getByText(/31-Aug-2026/)).toBeInTheDocument();
    expect(screen.getByText(/Time to be informed/)).toBeInTheDocument();
  });
});
