import { NextResponse } from "next/server";
import { z } from "zod";
import {
  cancelAppointment,
  rescheduleAppointment,
  SlotUnavailableError,
} from "@/modules/appointments/appointment.repository";
import {
  requestHasValidOrigin,
  requireAdminRequest,
} from "@/modules/auth/admin-api.server";
import { dateKeySchema } from "@/modules/scheduling/availability";

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("cancel"), reason: z.string().trim().min(3) }),
  z.object({
    action: z.literal("reschedule"),
    dateKey: dateKeySchema,
    time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  }),
]);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  if (!requestHasValidOrigin(request))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!(await requireAdminRequest(request)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const input = actionSchema.safeParse(await request.json().catch(() => null));
  if (!input.success)
    return NextResponse.json({ error: "invalid-request" }, { status: 400 });
  const { reference } = await params;
  try {
    if (input.data.action === "cancel")
      await cancelAppointment(reference, input.data.reason);
    else
      await rescheduleAppointment(reference, {
        dateKey: input.data.dateKey,
        time: input.data.time,
      });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof SlotUnavailableError
            ? "slot-unavailable"
            : "operation-failed",
      },
      { status: error instanceof SlotUnavailableError ? 409 : 400 },
    );
  }
}
