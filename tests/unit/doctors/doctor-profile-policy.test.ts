import { describe, expect, it } from "vitest";
import { canDoctorAcceptAppointments } from "@/modules/doctors/doctor-profile-policy";

describe("doctor profile booking policy", () => {
  it("keeps Dr. Manzoor Shahbaz informational while clinicians remain bookable", () => {
    expect(canDoctorAcceptAppointments("manzoor-shahbaz")).toBe(false);
    expect(canDoctorAcceptAppointments("sobia-zulfiqar")).toBe(true);
  });
});
