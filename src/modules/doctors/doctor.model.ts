import mongoose, { model, Schema, type InferSchemaType } from "mongoose";

const localizedTextSchema = new Schema(
  {
    en: { type: String, required: true, trim: true, maxlength: 2_000 },
    ur: { type: String, required: true, trim: true, maxlength: 2_000 },
  },
  { _id: false },
);

const optionalLocalizedTextSchema = new Schema(
  {
    en: { type: String, trim: true, maxlength: 2_000, default: "" },
    ur: { type: String, trim: true, maxlength: 2_000, default: "" },
  },
  { _id: false },
);

const galleryImageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    altText: { type: localizedTextSchema, required: true },
  },
  { _id: false },
);

const doctorSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    name: { type: localizedTextSchema, required: true },
    title: { type: localizedTextSchema, required: true },
    qualification: { type: optionalLocalizedTextSchema, required: true },
    education: { type: optionalLocalizedTextSchema, required: true },
    registration: { type: optionalLocalizedTextSchema, required: true },
    biography: { type: localizedTextSchema, required: true },
    focusAreas: { type: [localizedTextSchema], default: [] },
    languages: { type: optionalLocalizedTextSchema, required: true },
    workingDays: { type: optionalLocalizedTextSchema, required: true },
    image: { type: String, required: true, trim: true },
    imageAlt: { type: localizedTextSchema, required: true },
    featuredImages: {
      type: [galleryImageSchema],
      default: [],
      validate: {
        validator: (images: unknown[]) => images.length <= 5,
        message: "A featured doctor can have at most five gallery images",
      },
    },
    isFeatured: { type: Boolean, required: true, default: false },
    isActive: { type: Boolean, required: true, default: true },
    sortOrder: { type: Number, required: true, default: 0 },
  },
  { strict: "throw", timestamps: true },
);

doctorSchema.index({ id: 1 }, { unique: true });
doctorSchema.index({ sortOrder: 1, "name.en": 1 });
doctorSchema.index(
  { isFeatured: 1, isActive: 1 },
  {
    unique: true,
    partialFilterExpression: { isFeatured: true, isActive: true },
  },
);

export type DoctorDocument = InferSchemaType<typeof doctorSchema>;
export const DoctorModel =
  mongoose.models.Doctor ?? model<DoctorDocument>("Doctor", doctorSchema);
