import "server-only";
import mongoose, { model, Schema, type InferSchemaType } from "mongoose";

const dentistScheduleSchema = new Schema(
  {
    dentistId: { type: String, required: true, trim: true },
    dateKey: { type: String, required: true },
    opensAt: { type: String, required: true },
    closesAt: { type: String, required: true },
    slotDurationMinutes: { type: Number, required: true, min: 10, max: 180 },
  },
  { strict: "throw", timestamps: true },
);

dentistScheduleSchema.index({ dentistId: 1, dateKey: 1 }, { unique: true });
dentistScheduleSchema.index({ dateKey: 1 });

export type DentistScheduleDocument = InferSchemaType<
  typeof dentistScheduleSchema
>;
export const DentistScheduleModel =
  mongoose.models.DentistSchedule ??
  model<DentistScheduleDocument>("DentistSchedule", dentistScheduleSchema);
