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

  it("provides the five named clinic dentist records", () => {
    expect(demoDentists).toHaveLength(5);
    expect(demoDentists.map((dentist) => dentist.name.en)).toEqual([
      "Dr. Sobia Ahmad",
      "Dr. Amna Rauf",
      "Dr. Ahmad",
      "Dr. Rauf",
      "Dr. Shahbaz",
    ]);
    expect(findDemoDentist("sobia-ahmad")?.id).toBe("sobia-ahmad");
    expect(findDemoDentist("unknown")).toBeUndefined();
  });
});
