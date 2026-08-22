import mongoose, { model, Schema, type InferSchemaType } from "mongoose";

function localizedTextSchema(maxlength: number) {
  return new Schema(
    {
      en: { type: String, required: true, trim: true, maxlength },
      ur: { type: String, required: true, trim: true, maxlength },
    },
    { _id: false },
  );
}

const testimonialSchema = new Schema(
  {
    id: { type: String, required: true, trim: true },
    name: { type: localizedTextSchema(120), required: true },
    treatment: { type: localizedTextSchema(160), required: true },
    review: { type: localizedTextSchema(2_000), required: true },
    reviewDate: { type: Date, required: true },
    image: { type: String, default: null, trim: true },
    isPublished: { type: Boolean, required: true, default: true },
    sortOrder: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100_000,
      validate: Number.isInteger,
    },
  },
  { strict: "throw", timestamps: true },
);

testimonialSchema.index({ id: 1 }, { unique: true });
testimonialSchema.index({ isPublished: 1, sortOrder: 1, reviewDate: -1 });

export type TestimonialDocument = InferSchemaType<typeof testimonialSchema>;
export const TestimonialModel =
  mongoose.models.Testimonial ??
  model<TestimonialDocument>("Testimonial", testimonialSchema);
