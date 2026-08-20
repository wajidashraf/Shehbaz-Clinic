import "server-only";

import { connectMongo } from "@/infrastructure/database/mongoose";
import { BranchModel } from "@/modules/clinic/branch.model";
import { ClinicModel } from "@/modules/clinic/clinic.model";
import { z } from "zod";

const branchRecordSchema = z.object({
  id: z.string().min(1),
  clinicId: z.string().min(1),
  name: z.string().min(1),
  city: z.literal("Samundri"),
  district: z.literal("Faisalabad"),
  province: z.literal("Punjab"),
  postalCode: z.literal("37300"),
  country: z.literal("Pakistan"),
  timeZone: z.literal("Asia/Karachi"),
});

export type BranchRecord = z.infer<typeof branchRecordSchema>;

type ClinicRepositoryDependencies = {
  findActiveBranches: () => Promise<BranchRecord[]>;
};

export class ActiveBranchNotConfiguredError extends Error {
  constructor() {
    super("An active clinic branch is not configured");
    this.name = "ActiveBranchNotConfiguredError";
  }
}

export class SingleBranchInvariantError extends Error {
  constructor() {
    super("The single-branch milestone requires exactly one active branch");
    this.name = "SingleBranchInvariantError";
  }
}

export function parseBranchRecord(input: unknown): BranchRecord {
  const result = branchRecordSchema.safeParse(input);
  if (!result.success) throw new SingleBranchInvariantError();
  return result.data;
}

export function createClinicRepository({
  findActiveBranches,
}: ClinicRepositoryDependencies) {
  return {
    async getActiveBranch(): Promise<BranchRecord> {
      const branches = await findActiveBranches();
      if (branches.length === 0) throw new ActiveBranchNotConfiguredError();
      if (branches.length !== 1) throw new SingleBranchInvariantError();
      return branches[0];
    },
  };
}

const repository = createClinicRepository({
  async findActiveBranches() {
    await connectMongo();
    const branches = await BranchModel.find({ isActive: true })
      .limit(2)
      .lean()
      .exec();

    return branches.map((branch) =>
      parseBranchRecord({
        id: branch._id.toString(),
        clinicId: branch.clinicId.toString(),
        name: branch.name,
        city: branch.city,
        district: branch.district,
        province: branch.province,
        postalCode: branch.postalCode,
        country: branch.country,
        timeZone: branch.timeZone,
      }),
    );
  },
});

export const getActiveBranch = repository.getActiveBranch;

export function createClinicSeeder(connect: typeof connectMongo) {
  return async function upsertDevelopmentClinic(): Promise<void> {
    const database = await connect();

    await database.connection.transaction(async (session) => {
      const clinic = await ClinicModel.findOneAndUpdate(
        { seedKey: "shahbaz-dental-clinic" },
        {
          $set: {
            name: "Shahbaz Dental Clinic",
            defaultLocale: "en",
            supportedLocales: ["en", "ur"],
            timeZone: "Asia/Karachi",
          },
          $setOnInsert: { seedKey: "shahbaz-dental-clinic" },
        },
        { new: true, session, upsert: true },
      ).exec();

      await BranchModel.findOneAndUpdate(
        { seedKey: "samundri-primary" },
        {
          $set: {
            clinicId: clinic._id,
            name: "Shahbaz Dental Clinic",
            streetAddress: null,
            city: "Samundri",
            district: "Faisalabad",
            province: "Punjab",
            postalCode: "37300",
            country: "Pakistan",
            timeZone: "Asia/Karachi",
            isActive: true,
          },
          $setOnInsert: { seedKey: "samundri-primary" },
        },
        { new: true, session, upsert: true },
      ).exec();
    });

    await Promise.all([ClinicModel.syncIndexes(), BranchModel.syncIndexes()]);
  };
}

export const upsertDevelopmentClinic = createClinicSeeder(connectMongo);
