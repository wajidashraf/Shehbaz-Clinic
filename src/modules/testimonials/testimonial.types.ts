export type TestimonialLocalizedText = Readonly<{ en: string; ur: string }>;

export type TestimonialRecord = Readonly<{
  id: string;
  name: TestimonialLocalizedText;
  treatment: TestimonialLocalizedText;
  review: TestimonialLocalizedText;
  dateKey: string;
  image: string | null;
  isPublished: boolean;
  sortOrder: number;
}>;

export type TestimonialInput = Readonly<{
  id?: string;
  nameEn: string;
  nameUr: string;
  treatmentEn: string;
  treatmentUr: string;
  reviewEn: string;
  reviewUr: string;
  dateKey: string;
  isPublished: boolean;
  sortOrder: number;
}>;

export type NormalizedTestimonialInput = Readonly<{
  id?: string;
  name: TestimonialLocalizedText;
  treatment: TestimonialLocalizedText;
  review: TestimonialLocalizedText;
  reviewDate: Date;
  isPublished: boolean;
  sortOrder: number;
}>;
