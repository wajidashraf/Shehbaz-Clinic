import mongoose from "mongoose";
import { loadProjectEnvironment } from "./load-project-environment";
import {
  adminSeedEmails,
  parseAdminSeedEnvironment,
  parseMongoEnvironment,
} from "../src/config/env-schema";
import { connectMongoWithOptions } from "../src/infrastructure/database/mongoose-core";
import { BranchModel } from "../src/modules/clinic/branch.model";
import { ClinicModel } from "../src/modules/clinic/clinic.model";
import { createClinicSeeder } from "../src/modules/clinic/clinic.repository";
import { AdminUserModel } from "../src/modules/auth/admin-user.model";
import { AdminSessionModel } from "../src/modules/auth/admin-session.model";
import { hashAdminPassword } from "../src/modules/auth/admin-auth";
import {
  AppointmentModel,
  NotificationJobModel,
  SlotClaimModel,
} from "../src/modules/appointments/appointment.model";
import { DentistScheduleModel } from "../src/modules/scheduling/dentist-schedule.model";
import { DoctorModel } from "../src/modules/doctors/doctor.model";
import { demoDentists } from "../src/content/demo-content";
import { verifiedLegacyDoctorIdPairs } from "../src/modules/doctors/legacy-doctor-id";
import { demoTestimonials } from "../src/content/demo-testimonials";
import { TestimonialModel } from "../src/modules/testimonials/testimonial.model";

loadProjectEnvironment(process.cwd());
let seedStage = "configuration";

async function seed() {
  const environment = parseMongoEnvironment(process.env);
  const adminEnvironment = parseAdminSeedEnvironment(process.env);
  seedStage = "database connection";
  const database = await connectMongoWithOptions({
    uri: environment.MONGODB_URI,
    database: environment.MONGODB_DATABASE,
  });
  seedStage = "clinic records";
  const upsertDevelopmentClinic = createClinicSeeder(async () => database);
  await upsertDevelopmentClinic();
  seedStage = "administrator password hash";
  const passwordHash = await hashAdminPassword(adminEnvironment.ADMIN_PASSWORD);
  seedStage = "administrator record";
  const administratorEmails = adminSeedEmails(adminEnvironment);
  await Promise.all(
    administratorEmails.map((email) =>
      AdminUserModel.findOneAndUpdate(
        { email },
        {
          $set: {
            email,
            passwordHash,
            role: "admin",
            isActive: true,
          },
        },
        { upsert: true },
      ),
    ),
  );
  seedStage = "doctor records";
  await DoctorModel.updateMany(
    { isFeatured: true },
    { $set: { isFeatured: false } },
  );
  for (const dentist of demoDentists) {
    await DoctorModel.findOneAndUpdate(
      { id: dentist.id },
      { $set: { ...dentist, isActive: true } },
      { upsert: true, runValidators: true },
    );
  }
  seedStage = "legacy doctor references";
  for (const [legacyId, currentId] of verifiedLegacyDoctorIdPairs) {
    await Promise.all([
      DentistScheduleModel.updateMany(
        { dentistId: legacyId },
        { $set: { dentistId: currentId } },
      ),
      AppointmentModel.updateMany(
        { dentistId: legacyId },
        { $set: { dentistId: currentId } },
      ),
      SlotClaimModel.updateMany(
        { dentistId: legacyId },
        { $set: { dentistId: currentId } },
      ),
    ]);
  }
  await DoctorModel.deleteMany({
    id: {
      $in: ["sobia-ahmad", "amna-rauf", "ahmad", "rauf", "shahbaz"],
    },
  });
  seedStage = "testimonial records";
  for (const testimonial of demoTestimonials) {
    await TestimonialModel.findOneAndUpdate(
      { id: testimonial.id },
      { $set: testimonial },
      { upsert: true, runValidators: true },
    );
  }
  seedStage = "database indexes";
  await Promise.all([
    AdminUserModel.syncIndexes(),
    AdminSessionModel.syncIndexes(),
    DentistScheduleModel.syncIndexes(),
    AppointmentModel.syncIndexes(),
    SlotClaimModel.syncIndexes(),
    NotificationJobModel.syncIndexes(),
    DoctorModel.syncIndexes(),
    TestimonialModel.syncIndexes(),
  ]);

  seedStage = "verification counts";
  const [clinicCount, activeBranchCount] = await Promise.all([
    ClinicModel.countDocuments(),
    BranchModel.countDocuments({ isActive: true }),
  ]);

  console.info(
    `Seed complete: ${clinicCount} clinic, ${activeBranchCount} active branch, and ${administratorEmails.length} administrator account(s) configured.`,
  );
}

async function main() {
  try {
    await seed();
  } catch {
    console.error(
      `Seed failed during ${seedStage}. Check MongoDB, Atlas network access, and the private admin seed settings.`,
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
