import { NextResponse } from "next/server";
import { z } from "zod";
import {
  deleteSchedule,
  listAdminData,
  upsertSchedule,
} from "@/modules/appointments/appointment.repository";
import {
  requestHasValidOrigin,
  requireAdminRequest,
} from "@/modules/auth/admin-api.server";
import {
  listDoctorNamesIncludingInactive,
  listDoctors,
} from "@/modules/doctors/doctor.repository";
import { listAdminTestimonials } from "@/modules/testimonials/testimonial.repository";

export async function GET(request: Request) {
  if (!(await requireAdminRequest(request)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const [data, doctors, doctorNames, testimonials] = await Promise.all([
      listAdminData(),
      listDoctors(),
      listDoctorNamesIncludingInactive(),
      listAdminTestimonials(),
    ]);
    return NextResponse.json({ ...data, doctors, doctorNames, testimonials });
  } catch {
    return NextResponse.json({ error: "service-unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!requestHasValidOrigin(request))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!(await requireAdminRequest(request)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const schedule = await upsertSchedule(await request.json());
    return NextResponse.json({ schedule });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof z.ZodError ? "invalid-request" : "schedule-conflict",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!requestHasValidOrigin(request))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!(await requireAdminRequest(request)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "invalid-request" }, { status: 400 });
  try {
    await deleteSchedule(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "schedule-conflict" }, { status: 409 });
  }
}
