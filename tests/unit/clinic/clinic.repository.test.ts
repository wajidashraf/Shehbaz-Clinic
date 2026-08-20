import { describe, expect, it } from "vitest";
import {
  ActiveBranchNotConfiguredError,
  createClinicRepository,
  parseBranchRecord,
  SingleBranchInvariantError,
  type BranchRecord,
} from "@/modules/clinic/clinic.repository";

const samundriBranch: BranchRecord = {
  id: "507f1f77bcf86cd799439011",
  clinicId: "507f191e810c19729de860ea",
  name: "Shahbaz Dental Clinic",
  city: "Samundri",
  district: "Faisalabad",
  province: "Punjab",
  postalCode: "37300",
  country: "Pakistan",
  timeZone: "Asia/Karachi",
};

describe("clinic repository", () => {
  it("returns the single active Samundri branch", async () => {
    const repository = createClinicRepository({
      findActiveBranches: async () => [samundriBranch],
    });

    await expect(repository.getActiveBranch()).resolves.toEqual(samundriBranch);
  });

  it("rejects an environment without an active branch", async () => {
    const repository = createClinicRepository({
      findActiveBranches: async () => [],
    });

    await expect(repository.getActiveBranch()).rejects.toBeInstanceOf(
      ActiveBranchNotConfiguredError,
    );
  });

  it("rejects multiple active branches during the single-branch milestone", async () => {
    const repository = createClinicRepository({
      findActiveBranches: async () => [samundriBranch, samundriBranch],
    });

    await expect(repository.getActiveBranch()).rejects.toBeInstanceOf(
      SingleBranchInvariantError,
    );
  });

  it("rejects active branch data outside the confirmed Samundri locality", () => {
    expect(() =>
      parseBranchRecord({ ...samundriBranch, city: "Lahore" }),
    ).toThrow(SingleBranchInvariantError);
  });
});
