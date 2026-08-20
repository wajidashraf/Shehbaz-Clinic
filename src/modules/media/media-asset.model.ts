import "server-only";

import mongoose, { model, Schema, type InferSchemaType } from "mongoose";
import { mediaPurposes } from "./media.types";

const mediaAssetSchema = new Schema(
  {
    assetId: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    version: { type: Number, required: true, min: 0 },
    secureUrl: { type: String, required: true, trim: true },
    format: { type: String, required: true, trim: true },
    width: { type: Number, required: true, min: 1 },
    height: { type: Number, required: true, min: 1 },
    bytes: { type: Number, required: true, min: 0 },
    resourceType: { type: String, enum: ["image"], required: true },
    purpose: { type: String, enum: mediaPurposes, required: true },
    altText: {
      type: new Schema(
        {
          en: { type: String, required: true, trim: true, maxlength: 240 },
          ur: { type: String, trim: true, maxlength: 240 },
        },
        { _id: false },
      ),
      required: true,
    },
    actorUserId: { type: String, required: true, trim: true },
  },
  { strict: "throw", timestamps: true },
);

mediaAssetSchema.index({ assetId: 1 }, { unique: true });
mediaAssetSchema.index({ publicId: 1 }, { unique: true });

export type MediaAssetDocument = InferSchemaType<typeof mediaAssetSchema>;

export const MediaAssetModel =
  mongoose.models.MediaAsset ??
  model<MediaAssetDocument>("MediaAsset", mediaAssetSchema);
