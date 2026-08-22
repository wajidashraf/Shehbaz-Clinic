import "server-only";

import { connectMongo } from "@/infrastructure/database/mongoose";
import { TestimonialModel } from "./testimonial.model";
import type {
  NormalizedTestimonialInput,
  TestimonialRecord,
} from "./testimonial.types";

type StoredTestimonial = Omit<NormalizedTestimonialInput, "id"> & {
  id: string;
  image?: string | null;
};

export function toTestimonialRecord(document: unknown): TestimonialRecord {
  const value = document as StoredTestimonial;
  return {
    id: value.id,
    name: { ...value.name },
    treatment: { ...value.treatment },
    review: { ...value.review },
    dateKey: value.reviewDate.toISOString().slice(0, 10),
    image: value.image || null,
    isPublished: value.isPublished,
    sortOrder: value.sortOrder,
  };
}

export async function listPublishedTestimonials(): Promise<
  TestimonialRecord[]
> {
  await connectMongo();
  const testimonials = await TestimonialModel.find({ isPublished: true })
    .sort({ sortOrder: 1, reviewDate: -1, id: 1 })
    .lean();
  return testimonials.map(toTestimonialRecord);
}

export async function listAdminTestimonials(): Promise<TestimonialRecord[]> {
  await connectMongo();
  const testimonials = await TestimonialModel.find()
    .sort({ sortOrder: 1, reviewDate: -1, id: 1 })
    .lean();
  return testimonials.map(toTestimonialRecord);
}

export async function findTestimonial(
  id: string,
): Promise<TestimonialRecord | null> {
  await connectMongo();
  const testimonial = await TestimonialModel.findOne({ id }).lean();
  return testimonial ? toTestimonialRecord(testimonial) : null;
}

export async function saveTestimonial(
  record: StoredTestimonial,
): Promise<TestimonialRecord> {
  await connectMongo();
  const testimonial = await TestimonialModel.findOneAndUpdate(
    { id: record.id },
    { $set: record },
    { returnDocument: "after", runValidators: true, upsert: true },
  ).lean();
  if (!testimonial) throw new Error("Testimonial could not be saved");
  return toTestimonialRecord(testimonial);
}

export async function removeTestimonial(id: string): Promise<void> {
  await connectMongo();
  await TestimonialModel.deleteOne({ id });
}
