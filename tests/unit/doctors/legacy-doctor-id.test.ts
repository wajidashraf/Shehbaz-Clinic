import { describe, expect, it } from "vitest";
import { canonicalDoctorId } from "@/modules/doctors/legacy-doctor-id";

describe("legacy doctor IDs", () => {
  it("maps renamed doctor records to their current IDs", () => {
    expect(canonicalDoctorId("sobia-ahmad")).toBe("sobia-zulfiqar");
    expect(canonicalDoctorId("amna-rauf")).toBe("amna-baig");
    expect(canonicalDoctorId("ahmad")).toBe("ahmed-mobeen");
    expect(canonicalDoctorId("shahbaz")).toBe("manzoor-shahbaz");
  });

  it("does not guess when a legacy doctor has no verified replacement", () => {
    expect(canonicalDoctorId("rauf")).toBe("rauf");
    expect(canonicalDoctorId("rana-muhammad-adnan")).toBe(
      "rana-muhammad-adnan",
    );
  });
});
