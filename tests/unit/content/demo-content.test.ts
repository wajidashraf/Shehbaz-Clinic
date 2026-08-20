import { describe, expect, it } from "vitest";
import {
  demoDentists,
  demoServices,
  findDemoDentist,
  findDemoService,
  getLocalizedText,
} from "@/content/demo-content";

describe("public clinic content", () => {
  it("provides stable bilingual service records for booking links", () => {
    expect(demoServices).toHaveLength(8);
    expect(demoServices[0]?.id).toBe("consultation");
    expect(getLocalizedText(demoServices[0]!.name, "en")).toBe(
      "Dental consultation",
    );
    expect(getLocalizedText(demoServices[0]!.name, "ur")).toBe(
      "دانتوں کا مشورہ",
    );
    expect(findDemoService("consultation")?.id).toBe("consultation");
    expect(findDemoService("unknown")).toBeUndefined();
  });

  it("provides the corrected five-person clinic roster without Dr. Rauf", () => {
    expect(demoDentists).toHaveLength(5);
    expect(demoDentists.map((dentist) => dentist.name.en)).toEqual([
      "Dr. Sobia Zulfiqar",
      "Dr. Amna Baig",
      "Dr. Ahmed Mobeen",
      "Dr. Manzoor Shahbaz",
      "Dr. Rana Muhammad Adnan",
    ]);
    expect(findDemoDentist("sobia-zulfiqar")?.id).toBe("sobia-zulfiqar");
    expect(findDemoDentist("rauf")).toBeUndefined();
    expect(findDemoDentist("unknown")).toBeUndefined();
  });

  it("assigns every dentist a distinct local portrait", () => {
    const portraits = demoDentists.map((dentist) => dentist.image);

    expect(portraits).toEqual([
      "/images/dentists/sobia-ahmad.webp",
      "/images/dentists/amna-baig.webp",
      "/images/dentists/Ahmad.png",
      "/images/dentists/shahbaz.png",
      "/images/demo/dentist-2.webp",
    ]);
    expect(new Set(portraits)).toHaveLength(5);
  });
});
