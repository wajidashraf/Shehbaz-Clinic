import { describe, expect, it } from "vitest";
import { getDirection, isLocale } from "@/i18n/config";

describe("locale configuration", () => {
  it("recognizes only the supported languages", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ur")).toBe(true);
    expect(isLocale("pa")).toBe(false);
    expect(isLocale("")).toBe(false);
  });

  it("sets Urdu to RTL without changing English direction", () => {
    expect(getDirection("en")).toBe("ltr");
    expect(getDirection("ur")).toBe("rtl");
  });
});
