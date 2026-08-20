// @vitest-environment node

import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("Mongoose ESM boundary", () => {
  it("loads clinic models through the same ESM runtime used by the seed", () => {
    const result = spawnSync(
      process.execPath,
      [
        "--conditions",
        "react-server",
        "--import",
        "tsx",
        "--eval",
        "await import('./src/modules/clinic/branch.model.ts'); await import('./src/modules/clinic/clinic.model.ts'); await import('./src/modules/auth/admin-user.model.ts'); await import('./src/modules/auth/admin-session.model.ts'); await import('./src/modules/appointments/appointment.model.ts'); await import('./src/modules/scheduling/dentist-schedule.model.ts'); await import('./src/modules/doctors/doctor.model.ts');",
      ],
      { cwd: process.cwd(), encoding: "utf8" },
    );

    expect(result.status, result.stderr).toBe(0);
  }, 15_000);
});
