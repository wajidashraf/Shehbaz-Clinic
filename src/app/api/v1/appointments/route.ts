import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  createConfirmedAppointment,
  SlotUnavailableError,
} from "@/modules/appointments/appointment.repository";
import { requestHasValidOrigin } from "@/modules/auth/admin-api.server";

export async function POST(request: Request) {
  if (!requestHasValidOrigin(request))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  try {
    const result = await createConfirmedAppointment(await request.json());
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json({ error: "invalid-request" }, { status: 400 });
    if (error instanceof SlotUnavailableError)
      return NextResponse.json({ error: "slot-unavailable" }, { status: 409 });
    return NextResponse.json({ error: "service-unavailable" }, { status: 503 });
  }
}
