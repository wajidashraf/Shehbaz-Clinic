import { NextResponse } from "next/server";
import { z } from "zod";
import { getAvailableSlots } from "@/modules/appointments/appointment.repository";
import { dateKeySchema, dentistIds } from "@/modules/scheduling/availability";

const querySchema = z.object({
  dentistId: z
    .string()
    .refine((value) => value === "no-preference" || dentistIds.includes(value)),
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
