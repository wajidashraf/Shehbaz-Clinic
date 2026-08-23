import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { demoDentists } from "@/content/demo-content";
import { resolveBookingPrefill } from "@/modules/booking/demo-booking";

vi.mock("@/modules/doctors/doctor.repository", () => ({
  listDoctors: vi.fn(),
}));

import { listBookingDoctors } from "@/modules/booking/booking-doctors.server";
import { listDoctors } from "@/modules/doctors/doctor.repository";

describe("booking doctor source", () => {
  let originalPlaywrightTest: string | undefined;

  beforeEach(() => {
    originalPlaywrightTest = process.env.PLAYWRIGHT_TEST;
    delete process.env.PLAYWRIGHT_TEST;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    if (originalPlaywrightTest === undefined) {
      delete process.env.PLAYWRIGHT_TEST;
    } else {
      process.env.PLAYWRIGHT_TEST = originalPlaywrightTest;
    }
  });

  it("uses the doctor repository when the Playwright flag is absent", async () => {
    const repositoryDoctors = [demoDentists[0]!];
    vi.mocked(listDoctors).mockResolvedValue(repositoryDoctors);

    await expect(listBookingDoctors()).resolves.toEqual(repositoryDoctors);
    expect(listDoctors).toHaveBeenCalledOnce();
  });

  it("uses local demo dentists only for the explicit Playwright process", async () => {
    vi.stubEnv("PLAYWRIGHT_TEST", "1");
    vi.mocked(listDoctors).mockRejectedValue(new Error("database unavailable"));

    const dentists = await listBookingDoctors();

    expect(dentists).toBe(demoDentists);
    expect(listDoctors).not.toHaveBeenCalled();
    expect(
      resolveBookingPrefill(
        { dentist: "no-preference", service: "consultation" },
        dentists.map((dentist) => dentist.id),
      ),
    ).toEqual({ dentistId: "no-preference", serviceId: "consultation" });
  });
});
