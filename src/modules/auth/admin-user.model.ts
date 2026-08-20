import "server-only";
import mongoose, { model, Schema, type InferSchemaType } from "mongoose";

const adminUserSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin"], required: true, default: "admin" },
    isActive: { type: Boolean, required: true, default: true },
  },
  { strict: "throw", timestamps: true },
);

adminUserSchema.index({ email: 1 }, { unique: true });

export type AdminUserDocument = InferSchemaType<typeof adminUserSchema>;
export const AdminUserModel =
  mongoose.models.AdminUser ??
  model<AdminUserDocument>("AdminUser", adminUserSchema);
