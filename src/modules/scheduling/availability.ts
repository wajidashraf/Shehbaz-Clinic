import { z } from "zod";

export const dateKeySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(parsed.valueOf()) &&
      parsed.toISOString().slice(0, 10) === value
    );
  });
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const pakistanDateFormatter = new Intl.DateTimeFormat("en", {
  timeZone: "Asia/Karachi",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function minutesSinceMidnight(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours! * 60 + minutes!;
}

function formatTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export const scheduleInputSchema = z
  .object({
    dentistId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    dateKey: dateKeySchema,
    opensAt: timeSchema,
    closesAt: timeSchema,
    slotDurationMinutes: z.number().int().min(10).max(180),
  })
  .superRefine((value, context) => {
    if (
      minutesSinceMidnight(value.closesAt) <=
      minutesSinceMidnight(value.opensAt)
    ) {
      context.addIssue({
        code: "custom",
        path: ["closesAt"],
        message: "Closing time must be after opening time",
      });
    }
  });

export type ScheduleInput = z.infer<typeof scheduleInputSchema>;

type ScheduleTiming = Pick<
  ScheduleInput,
  "opensAt" | "closesAt" | "slotDurationMinutes"
>;

export function scheduleChangeKeepsBookedSlots(
  existing: ScheduleTiming | null,
  next: ScheduleTiming,
  hasAppointments: boolean,
) {
  if (!hasAppointments) return true;
  return Boolean(
    existing &&
    existing.opensAt === next.opensAt &&
    existing.closesAt === next.closesAt &&
    existing.slotDurationMinutes === next.slotDurationMinutes,
  );
}

export function getPakistanDateKey(date = new Date()) {
  const parts = Object.fromEntries(
    pakistanDateFormatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function createUtcDateForPakistanTime(dateKey: string, time: string) {
  dateKeySchema.parse(dateKey);
  timeSchema.parse(time);
  return new Date(`${dateKey}T${time}:00+05:00`);
}

export function generateScheduleSlots(
  schedule: Pick<
    ScheduleInput,
    "dateKey" | "opensAt" | "closesAt" | "slotDurationMinutes"
  >,
) {
  const start = minutesSinceMidnight(schedule.opensAt);
  const end = minutesSinceMidnight(schedule.closesAt);
  const slots: Array<{ startAtUtc: Date; time: string }> = [];

  for (
    let cursor = start;
    cursor + schedule.slotDurationMinutes <= end;
    cursor += schedule.slotDurationMinutes
  ) {
    const time = formatTime(cursor);
    slots.push({
      time,
      startAtUtc: createUtcDateForPakistanTime(schedule.dateKey, time),
    });
  }

  return slots;
}
