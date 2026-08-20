import { NextResponse } from "next/server";
import {
  NotificationRetryError,
  retryNotificationEmail,
} from "@/modules/appointments/appointment.repository";
import {
  requestHasValidOrigin,
  requireAdminRequest,
} from "@/modules/auth/admin-api.server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!requestHasValidOrigin(request))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!(await requireAdminRequest(request)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    await retryNotificationEmail((await params).id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof NotificationRetryError
            ? "notification-not-retryable"
            : "service-unavailable",
      },
      { status: error instanceof NotificationRetryError ? 409 : 503 },
    );
  }
}
