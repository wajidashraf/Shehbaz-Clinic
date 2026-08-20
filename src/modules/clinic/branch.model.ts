import "server-only";

import {
  default as mongoose,
  model,
  Schema,
  type InferSchemaType,
  type Types,
} from "mongoose";

const branchSchema = new Schema(
  {
    seedKey: { type: String, trim: true },
    clinicId: {
      type: Schema.Types.ObjectId,
      ref: "Clinic",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    streetAddress: { type: String, default: null },
    city: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    timeZone: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
  },
  { strict: "throw", timestamps: true },
);

branchSchema.index(
  { seedKey: 1 },
  {
    unique: true,
    partialFilterExpression: { seedKey: { $type: "string" } },
  },
);
branchSchema.index({ isActive: 1 });
branchSchema.index({ clinicId: 1, isActive: 1 });

export type BranchDocument = InferSchemaType<typeof branchSchema> & {
  clinicId: Types.ObjectId;
};

export const BranchModel =
  mongoose.models.Branch ?? model<BranchDocument>("Branch", branchSchema);
