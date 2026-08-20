import { describe, expect, it } from "vitest";
import {
  demoDentists,
  demoServices,
  findDemoDentist,
  findDemoService,
  getLocalizedText,
} from "@/content/demo-content";

describe("demonstration content", () => {
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

  it("provides explicitly demonstrative dentist records", () => {
    expect(demoDentists).toHaveLength(3);
    expect(demoDentists.every((dentist) => dentist.isDemo)).toBe(true);
    expect(findDemoDentist("demo-sana")?.id).toBe("demo-sana");
    expect(findDemoDentist("unknown")).toBeUndefined();
  });
});
