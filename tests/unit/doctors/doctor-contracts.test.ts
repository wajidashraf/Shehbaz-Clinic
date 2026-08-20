import { describe, expect, it } from "vitest";
import {
  eligibleDoctorIds,
  normalizeDoctorInput,
} from "@/modules/doctors/doctor.contracts";

describe("doctor management contracts", () => {
  it("normalizes an English admin record and generates a stable doctor id", () => {
    expect(
      normalizeDoctorInput({
        name: "Dr. Rana Muhammad Adnan",
        title: "Consultant Dental Surgeon",
        qualification: "BDS, MDS",
        education: "King Edward Medical University",
        registration: "PMDC — 10972-D",
        biography: "Consultant oral and maxillofacial surgeon.",
        focusAreas: ["Dental implants", "Jaw fracture treatment"],
        languages: "Urdu, Punjabi, English",
        workingDays: "Monday–Sunday",
        isFeatured: true,
      }),
    ).toEqual({
      id: "rana-muhammad-adnan",
      name: { en: "Dr. Rana Muhammad Adnan", ur: "Dr. Rana Muhammad Adnan" },
      title: {
        en: "Consultant Dental Surgeon",
        ur: "Consultant Dental Surgeon",
      },
      qualification: { en: "BDS, MDS", ur: "BDS, MDS" },
      education: {
        en: "King Edward Medical University",
        ur: "King Edward Medical University",
      },
      registration: { en: "PMDC — 10972-D", ur: "PMDC — 10972-D" },
      biography: {
        en: "Consultant oral and maxillofacial surgeon.",
        ur: "Consultant oral and maxillofacial surgeon.",
      },
      focusAreas: [
        { en: "Dental implants", ur: "Dental implants" },
        { en: "Jaw fracture treatment", ur: "Jaw fracture treatment" },
      ],
      languages: { en: "Urdu, Punjabi, English", ur: "Urdu, Punjabi, English" },
      workingDays: { en: "Monday–Sunday", ur: "Monday–Sunday" },
      isFeatured: true,
    });
  });

  it("rejects more than ten focus areas", () => {
    expect(() =>
      normalizeDoctorInput({
        name: "Dr. Example",
        title: "Dental Surgeon",
        qualification: "BDS",
        education: "College",
        registration: "123-D",
        biography: "Clinical profile",
        focusAreas: Array.from({ length: 11 }, (_, index) => `Focus ${index}`),
        languages: "Urdu",
        workingDays: "Monday",
        isFeatured: false,
      }),
    ).toThrow();
  });

  it("accepts profiles without unconfirmed languages or working days", () => {
    const doctor = normalizeDoctorInput({
      name: "Dr. Manzoor Shahbaz",
      title: "Chief Executive Officer",
      qualification: "",
      education: "",
      registration: "",
      biography:
        "Dr. Manzoor Shahbaz is the Chief Executive Officer of Shahbaz Dental Clinic.",
      focusAreas: [],
      languages: "",
      workingDays: "",
      isFeatured: true,
    });

    expect(doctor.languages).toEqual({ en: "", ur: "" });
    expect(doctor.workingDays).toEqual({ en: "", ur: "" });
  });

  it("excludes removed doctors from direct and no-preference scheduling", () => {
    const currentDoctors = ["sobia-zulfiqar", "amna-baig"];

    expect(eligibleDoctorIds("no-preference", currentDoctors)).toEqual(
      currentDoctors,
    );
    expect(eligibleDoctorIds("sobia-zulfiqar", currentDoctors)).toEqual([
      "sobia-zulfiqar",
    ]);
    expect(eligibleDoctorIds("removed-doctor", currentDoctors)).toEqual([]);
  });
});
