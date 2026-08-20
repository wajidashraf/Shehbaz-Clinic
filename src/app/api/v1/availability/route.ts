import { NextResponse } from "next/server";
import { z } from "zod";
import { getAvailableSlots } from "@/modules/appointments/appointment.repository";
import { dateKeySchema } from "@/modules/scheduling/availability";

const querySchema = z.object({
  dentistId: z.union([
    z.literal("no-preference"),
    z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  ]),
  dateKey: dateKeySchema,
});

export async function GET(request: Request) {
  const query = querySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!query.success)
    return NextResponse.json({ error: "invalid-request" }, { status: 400 });

  try {
    const slots = await getAvailableSlots(
      query.data.dentistId,
      query.data.dateKey,
    );
    return NextResponse.json({ slots });
  } catch {
    return NextResponse.json({ error: "service-unavailable" }, { status: 503 });
  }
}
