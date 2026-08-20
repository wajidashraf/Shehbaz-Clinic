import { describe, expect, it } from "vitest";
import { demoDentists } from "@/content/demo-content";
import { DoctorModel } from "@/modules/doctors/doctor.model";

describe("DoctorModel", () => {
  it("accepts an accurate profile when optional details are not supplied", async () => {
    await expect(
      new DoctorModel(demoDentists[3]).validate(),
    ).resolves.toBeUndefined();
  });
});
