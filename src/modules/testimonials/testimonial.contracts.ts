import { z } from "zod";
import type {
  NormalizedTestimonialInput,
  TestimonialInput,
} from "./testimonial.types";

const idSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const nameSchema = z.string().trim().min(1).max(120);
const treatmentSchema = z.string().trim().min(1).max(160);
const reviewSchema = z.string().trim().min(10).max(2_000);
const dateKeySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
    );
  });

const testimonialInputSchema = z.object({
  id: idSchema.optional(),
  nameEn: nameSchema,
  nameUr: nameSchema,
  treatmentEn: treatmentSchema,
  treatmentUr: treatmentSchema,
  reviewEn: reviewSchema,
  reviewUr: reviewSchema,
  dateKey: dateKeySchema,
  isPublished: z.boolean(),
  sortOrder: z.number().int().min(0).max(100_000),
});

export function normalizeTestimonialInput(
  input: TestimonialInput,
): NormalizedTestimonialInput {
  const value = testimonialInputSchema.parse(input);
  return {
    id: value.id,
    name: { en: value.nameEn, ur: value.nameUr },
    treatment: { en: value.treatmentEn, ur: value.treatmentUr },
    review: { en: value.reviewEn, ur: value.reviewUr },
    reviewDate: new Date(`${value.dateKey}T00:00:00.000Z`),
    isPublished: value.isPublished,
    sortOrder: value.sortOrder,
  };
}
