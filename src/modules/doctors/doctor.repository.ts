import "server-only";

import { connectMongo } from "@/infrastructure/database/mongoose";
import { DoctorModel } from "./doctor.model";
import { DentistScheduleModel } from "@/modules/scheduling/dentist-schedule.model";
import { AppointmentModel } from "@/modules/appointments/appointment.model";
import { getPakistanDateKey } from "@/modules/scheduling/availability";
import type { DoctorRecord } from "./doctor.types";

export class DoctorHasFutureAppointmentsError extends Error {
  constructor() {
    super("Cancel or reschedule this doctor's future appointments first");
    this.name = "DoctorHasFutureAppointmentsError";
  }
}

function toDoctorRecord(document: unknown): DoctorRecord {
  const value = document as DoctorRecord;
  return {
    id: value.id,
    name: { ...value.name },
    title: { ...value.title },
    qualification: { ...value.qualification },
    education: { ...value.education },
    registration: { ...value.registration },
    biography: { ...value.biography },
    focusAreas: value.focusAreas.map((focus) => ({ ...focus })),
    languages: { ...value.languages },
    workingDays: { ...value.workingDays },
    image: value.image,
    imageAlt: { ...value.imageAlt },
    featuredImages: value.featuredImages.map((image) => ({
      url: image.url,
      altText: { ...image.altText },
    })),
    isFeatured: value.isFeatured,
    sortOrder: value.sortOrder,
  };
}

export async function listDoctors(): Promise<DoctorRecord[]> {
  await connectMongo();
  const doctors = await DoctorModel.find({ isActive: { $ne: false } })
    .sort({ sortOrder: 1, "name.en": 1 })
    .lean();
  return doctors.map(toDoctorRecord);
}

export async function findDoctor(id: string): Promise<DoctorRecord | null> {
  await connectMongo();
  const doctor = await DoctorModel.findOne({
    id,
    isActive: { $ne: false },
  }).lean();
  return doctor ? toDoctorRecord(doctor) : null;
}

export async function findDoctorIncludingInactive(
  id: string,
): Promise<DoctorRecord | null> {
  await connectMongo();
  const doctor = await DoctorModel.findOne({ id }).lean();
  return doctor ? toDoctorRecord(doctor) : null;
}

export async function listDoctorNamesIncludingInactive() {
  await connectMongo();
  const doctors = await DoctorModel.find().select("id name.en").lean();
  return Object.fromEntries(
    doctors.map((doctor) => [doctor.id, doctor.name.en]),
  ) as Record<string, string>;
}

export async function doctorExists(id: string): Promise<boolean> {
  await connectMongo();
  return Boolean(await DoctorModel.exists({ id, isActive: { $ne: false } }));
}

export async function saveDoctor(record: DoctorRecord): Promise<DoctorRecord> {
  const database = await connectMongo();
  await database.connection.transaction(async (session) => {
    if (record.isFeatured) {
      await DoctorModel.updateMany(
        { id: { $ne: record.id }, isFeatured: true },
        { $set: { isFeatured: false } },
        { session },
      );
    }
    await DoctorModel.findOneAndUpdate(
      { id: record.id },
      { $set: { ...record, isActive: true } },
      { returnDocument: "after", runValidators: true, session, upsert: true },
    );
  });
  const saved = await DoctorModel.findOne({ id: record.id }).lean();
  if (!saved) throw new Error("Doctor could not be saved");
  return toDoctorRecord(saved);
}

export async function removeDoctor(id: string): Promise<void> {
  const database = await connectMongo();
  await database.connection.transaction(async (session) => {
    if (
      await AppointmentModel.exists({
        dentistId: id,
        status: "confirmed",
        startAtUtc: { $gte: new Date() },
      }).session(session)
    ) {
      throw new DoctorHasFutureAppointmentsError();
    }
    await DoctorModel.updateOne(
      { id, isActive: { $ne: false } },
      { $set: { isActive: false, isFeatured: false } },
      { session },
    );
    await DentistScheduleModel.deleteMany(
      { dentistId: id, dateKey: { $gte: getPakistanDateKey() } },
      { session },
    );
  });
}
