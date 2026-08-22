import { describe, expect, it } from "vitest";
import * as demoContent from "@/content/demo-content";

const { demoServices } = demoContent;

type DetailedService = (typeof demoServices)[number] & {
  clinicalNote?: { en: string; ur: string };
  details?: { en: string; ur: string };
  expectations?: readonly { en: string; ur: string }[];
  suitableFor?: readonly { en: string; ur: string }[];
};

describe("service detail content", () => {
  it("provides complete English and Urdu guidance for every service", () => {
    for (const service of demoServices as readonly DetailedService[]) {
      expect(service.details?.en.trim(), `${service.id} English details`).toBeTruthy();
      expect(service.details?.ur.trim(), `${service.id} Urdu details`).toBeTruthy();
      expect(service.suitableFor?.length, `${service.id} suitability`).toBeGreaterThanOrEqual(2);
      expect(service.expectations?.length, `${service.id} expectations`).toBeGreaterThanOrEqual(3);
      expect(service.clinicalNote?.en.trim(), `${service.id} English note`).toBeTruthy();
      expect(service.clinicalNote?.ur.trim(), `${service.id} Urdu note`).toBeTruthy();
    }
  });

  it("selects same-category services first and excludes the active service", () => {
    const getRelatedServices = (
      demoContent as typeof demoContent & {
        getRelatedDemoServices?: (
          serviceId: string,
          limit?: number,
        ) => readonly (typeof demoServices)[number][];
      }
    ).getRelatedDemoServices;

    expect(typeof getRelatedServices).toBe("function");
    if (!getRelatedServices) return;

    const related = getRelatedServices("root-canal", 3);
    expect(related.map((service) => service.id)).toEqual([
      "filling",
      "consultation",
      "check-up",
    ]);
    expect(related).toHaveLength(3);
  });
});
