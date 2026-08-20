import "server-only";

import mongoose, { model, Schema, type InferSchemaType } from "mongoose";

const clinicSchema = new Schema(
  {
    seedKey: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    defaultLocale: { type: String, enum: ["en", "ur"], default: "en" },
    supportedLocales: {
      type: [String],
      enum: ["en", "ur"],
      default: ["en", "ur"],
    },
    timeZone: { type: String, required: true, default: "Asia/Karachi" },
  },
  { strict: "throw", timestamps: true },
);

clinicSchema.index({ seedKey: 1 }, { unique: true });

export type ClinicDocument = InferSchemaType<typeof clinicSchema>;

export const ClinicModel =
  mongoose.models.Clinic ?? model<ClinicDocument>("Clinic", clinicSchema);
