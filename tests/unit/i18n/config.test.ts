import { describe, expect, it } from "vitest";
import { getDirection, getDocumentLanguageAttributes, isLocale } from "@/i18n/config";
import urduMessages from "@/messages/ur.json";

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

  it("protects the native Urdu document from automatic browser translation", () => {
    expect(getDocumentLanguageAttributes("ur")).toEqual({
      dir: "rtl",
      lang: "ur",
      translate: "no",
    });
  });

  it("uses the approved Urdu clinic-hours label", () => {
    expect(urduMessages.Navigation.openDaily).toBe("اوقاتِ کار");
  });
});
