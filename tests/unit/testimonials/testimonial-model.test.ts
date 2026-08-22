import { describe, expect, it } from "vitest";
import { TestimonialModel } from "@/modules/testimonials/testimonial.model";

describe("TestimonialModel", () => {
  it("accepts a bilingual published testimonial without a patient image", async () => {
    await expect(
      new TestimonialModel({
        id: "review-ayesha",
        name: { en: "Ayesha Khan", ur: "عائشہ خان" },
        treatment: { en: "Dental cleaning", ur: "دانتوں کی صفائی" },
        review: {
          en: "The clinic explained every step clearly and treated me gently.",
          ur: "کلینک نے ہر مرحلہ واضح کیا اور بہت نرمی سے علاج کیا۔",
        },
        reviewDate: new Date("2026-08-18T00:00:00.000Z"),
        image: null,
        isPublished: true,
        sortOrder: 20,
      }).validate(),
    ).resolves.toBeUndefined();
  });
});
