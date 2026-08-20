import "server-only";
import mongoose, { model, Schema, type InferSchemaType } from "mongoose";

const appointmentSchema = new Schema(
  {
    publicReference: { type: String, required: true },
    dentistId: { type: String, required: true },
    serviceId: { type: String, required: true },
    startAtUtc: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    patientName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, default: null, lowercase: true, trim: true },
    locale: { type: String, enum: ["en", "ur"], required: true },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      required: true,
      default: "confirmed",
    },
    cancellationReason: { type: String, default: null },
    history: {
      type: [
        new Schema(
          {
            from: { type: String, default: null },
            to: { type: String, required: true },
            actor: { type: String, enum: ["guest", "admin"], required: true },
            reason: { type: String, default: null },
            at: { type: Date, required: true },
          },
          { _id: false, strict: "throw" },
        ),
      ],
      default: [],
    },
  },
  { strict: "throw", timestamps: true },
);

appointmentSchema.index({ publicReference: 1 }, { unique: true });
appointmentSchema.index({ startAtUtc: 1, status: 1 });
appointmentSchema.index({ dentistId: 1, startAtUtc: 1, status: 1 });

const slotClaimSchema = new Schema(
  {
    dentistId: { type: String, required: true },
    startAtUtc: { type: Date, required: true },
    appointmentReference: { type: String, required: true },
  },
  { strict: "throw", timestamps: true },
);
slotClaimSchema.index({ dentistId: 1, startAtUtc: 1 }, { unique: true });
slotClaimSchema.index({ appointmentReference: 1 }, { unique: true });

const notificationJobSchema = new Schema(
  {
    appointmentReference: { type: String, required: true },
    channel: { type: String, enum: ["email", "sms"], required: true },
    event: {
      type: String,
      enum: [
        "booking-confirmed",
        "appointment-cancelled",
        "appointment-rescheduled",
      ],
      required: true,
    },
    recipient: { type: String, required: true },
    status: {
      type: String,
      enum: ["queued", "processing", "sent", "failed", "pending-provider"],
      required: true,
    },
    attempts: { type: Number, required: true, default: 0 },
    lastErrorCode: { type: String, default: null },
    sentAt: { type: Date, default: null },
  },
  { strict: "throw", timestamps: true },
);
notificationJobSchema.index({ appointmentReference: 1, createdAt: -1 });
notificationJobSchema.index({ status: 1, channel: 1 });

export type AppointmentDocument = InferSchemaType<typeof appointmentSchema>;
export const AppointmentModel =
  mongoose.models.Appointment ??
  model<AppointmentDocument>("Appointment", appointmentSchema);
export const SlotClaimModel =
  mongoose.models.SlotClaim ?? model("SlotClaim", slotClaimSchema);
export const NotificationJobModel =
  mongoose.models.NotificationJob ??
  model("NotificationJob", notificationJobSchema);
