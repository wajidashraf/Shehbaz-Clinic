import { describe, expect, it } from "vitest";
import { normalizeTestimonialInput } from "@/modules/testimonials/testimonial.contracts";

const validInput = {
  id: "review-ayesha",
  nameEn: " Ayesha Khan ",
  nameUr: " عائشہ خان ",
  treatmentEn: " Dental cleaning ",
  treatmentUr: " دانتوں کی صفائی ",
  reviewEn: " The clinic explained every step clearly and treated me gently. ",
  reviewUr: " کلینک نے ہر مرحلہ واضح کیا اور بہت نرمی سے علاج کیا۔ ",
  dateKey: "2026-08-18",
  isPublished: true,
  sortOrder: 20,
};

describe("testimonial contracts", () => {
  it("normalizes bilingual testimonial input and its calendar date", () => {
    expect(normalizeTestimonialInput(validInput)).toEqual({
      id: "review-ayesha",
      name: { en: "Ayesha Khan", ur: "عائشہ خان" },
      treatment: { en: "Dental cleaning", ur: "دانتوں کی صفائی" },
      review: {
        en: "The clinic explained every step clearly and treated me gently.",
        ur: "کلینک نے ہر مرحلہ واضح کیا اور بہت نرمی سے علاج کیا۔",
      },
      reviewDate: new Date("2026-08-18T00:00:00.000Z"),
      isPublished: true,
      sortOrder: 20,
    });
  });

  it("rejects a testimonial when either language is missing", () => {
    expect(() =>
      normalizeTestimonialInput({ ...validInput, reviewUr: "" }),
    ).toThrow();
    expect(() =>
      normalizeTestimonialInput({ ...validInput, nameEn: "" }),
    ).toThrow();
  });

  it("rejects an impossible calendar date", () => {
    expect(() =>
      normalizeTestimonialInput({ ...validInput, dateKey: "2026-02-30" }),
    ).toThrow();
  });
});
