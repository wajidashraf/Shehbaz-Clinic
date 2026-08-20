import { describe, expect, it } from "vitest";
import { getAlternateLocalePath } from "@/components/layout/locale-switch";

describe("getAlternateLocalePath", () => {
  it("keeps the visitor on the equivalent nested route", () => {
    expect(getAlternateLocalePath("/en/services", "en")).toBe("/ur/services");
    expect(getAlternateLocalePath("/ur/dentists", "ur")).toBe("/en/dentists");
  });

  it("falls back to the alternate home page for an unexpected path", () => {
    expect(getAlternateLocalePath("/", "en")).toBe("/ur");
    expect(getAlternateLocalePath(null, "ur")).toBe("/en");
  });
});
