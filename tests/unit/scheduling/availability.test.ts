import { describe, expect, it } from "vitest";
import {
  createUtcDateForPakistanTime,
  generateScheduleSlots,
  getPakistanDateKey,
  scheduleChangeKeepsBookedSlots,
  scheduleInputSchema,
} from "@/modules/scheduling/availability";

describe("appointment availability", () => {
  it("generates every complete slot inside a dentist's opening window", () => {
    expect(
      generateScheduleSlots({
        dateKey: "2026-09-01",
        opensAt: "09:00",
        closesAt: "10:30",
        slotDurationMinutes: 30,
      }).map((slot) => slot.time),
    ).toEqual(["09:00", "09:30", "10:00"]);
  });

  it("stores Pakistan wall-clock selections as UTC instants", () => {
    expect(
      createUtcDateForPakistanTime("2026-09-01", "09:30").toISOString(),
    ).toBe("2026-09-01T04:30:00.000Z");
  });

  it("rejects a closing time that is not after opening", () => {
    expect(
      scheduleInputSchema.safeParse({
        dentistId: "sobia-ahmad",
        dateKey: "2026-09-01",
        opensAt: "10:00",
        closesAt: "10:00",
        slotDurationMinutes: 30,
      }).success,
    ).toBe(false);
  });

  it("calculates the clinic date in Pakistan rather than UTC", () => {
    expect(getPakistanDateKey(new Date("2026-08-20T20:00:00.000Z"))).toBe(
      "2026-08-21",
    );
  });

  it("rejects a date that does not exist on the calendar", () => {
    expect(
      scheduleInputSchema.safeParse({
        dentistId: "sobia-ahmad",
        dateKey: "2026-02-31",
        opensAt: "09:00",
        closesAt: "17:00",
        slotDurationMinutes: 30,
      }).success,
    ).toBe(false);
  });

  it("locks opening hours and duration once a schedule has appointments", () => {
    const existing = {
      opensAt: "09:00",
      closesAt: "17:00",
      slotDurationMinutes: 30,
    };

    expect(scheduleChangeKeepsBookedSlots(existing, existing, true)).toBe(true);
    expect(
      scheduleChangeKeepsBookedSlots(
        existing,
        { ...existing, slotDurationMinutes: 15 },
        true,
      ),
    ).toBe(false);
    expect(
      scheduleChangeKeepsBookedSlots(
        existing,
        { ...existing, opensAt: "10:00" },
        true,
      ),
    ).toBe(false);
    expect(
      scheduleChangeKeepsBookedSlots(
        existing,
        { ...existing, slotDurationMinutes: 15 },
        false,
      ),
    ).toBe(true);
  });
});
