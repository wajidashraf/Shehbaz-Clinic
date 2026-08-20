import "server-only";
import mongoose, { model, Schema, type InferSchemaType } from "mongoose";

const adminSessionSchema = new Schema(
  {
    tokenDigest: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "AdminUser", required: true },
    expiresAt: { type: Date, required: true },
  },
  { strict: "throw", timestamps: true },
);

adminSessionSchema.index({ tokenDigest: 1 }, { unique: true });
adminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type AdminSessionDocument = InferSchemaType<typeof adminSessionSchema>;
export const AdminSessionModel =
  mongoose.models.AdminSession ??
  model<AdminSessionDocument>("AdminSession", adminSessionSchema);
