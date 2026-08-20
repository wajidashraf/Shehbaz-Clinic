// @vitest-environment node

import { describe, expect, it } from "vitest";
import { BranchModel } from "@/modules/clinic/branch.model";

describe("branch model", () => {
  it("uses a partial unique seed key so future non-seeded branches are allowed", () => {
    const seedIndex = BranchModel.schema
      .indexes()
      .find(([fields]) => fields.seedKey === 1);

    expect(BranchModel.schema.path("seedKey").isRequired).toBeFalsy();
    expect(seedIndex?.[1]).toMatchObject({
      unique: true,
      partialFilterExpression: { seedKey: { $type: "string" } },
    });
  });
});
