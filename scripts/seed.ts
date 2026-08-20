import mongoose from "mongoose";
import { loadProjectEnvironment } from "./load-project-environment";
import { parseMongoEnvironment } from "../src/config/env-schema";
import { connectMongoWithOptions } from "../src/infrastructure/database/mongoose-core";
import { BranchModel } from "../src/modules/clinic/branch.model";
import { ClinicModel } from "../src/modules/clinic/clinic.model";
import { createClinicSeeder } from "../src/modules/clinic/clinic.repository";

loadProjectEnvironment(process.cwd());

async function seed() {
  const environment = parseMongoEnvironment(process.env);
  const database = await connectMongoWithOptions({
    uri: environment.MONGODB_URI,
    database: environment.MONGODB_DATABASE,
  });
  const upsertDevelopmentClinic = createClinicSeeder(async () => database);
  await upsertDevelopmentClinic();

  const [clinicCount, activeBranchCount] = await Promise.all([
    ClinicModel.countDocuments(),
    BranchModel.countDocuments({ isActive: true }),
  ]);

  console.info(
    `Synthetic seed complete: ${clinicCount} clinic, ${activeBranchCount} active branch.`,
  );
}

async function main() {
  try {
    await seed();
  } catch {
    console.error(
      "Synthetic seed failed. Check the private MongoDB settings and Atlas network access.",
    );
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();
    } catch {
      console.error("Synthetic seed cleanup failed.");
      process.exitCode = 1;
    }
  }
}

await main();
