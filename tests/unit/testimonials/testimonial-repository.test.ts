import { describe, expect, it } from "vitest";
import { toTestimonialRecord } from "@/modules/testimonials/testimonial.repository";

describe("testimonial repository mapping", () => {
  it("returns a plain serializable record with a stable date key", () => {
    expect(
      toTestimonialRecord({
        id: "review-ayesha",
        name: { en: "Ayesha Khan", ur: "عائشہ خان" },
        treatment: { en: "Dental cleaning", ur: "دانتوں کی صفائی" },
        review: {
          en: "The clinic explained every step clearly and treated me gently.",
          ur: "کلینک نے ہر مرحلہ واضح کیا اور بہت نرمی سے علاج کیا۔",
        },
        reviewDate: new Date("2026-08-18T00:00:00.000Z"),
        image: null,
        isPublished: false,
        sortOrder: 20,
      }),
    ).toEqual({
      id: "review-ayesha",
      name: { en: "Ayesha Khan", ur: "عائشہ خان" },
      treatment: { en: "Dental cleaning", ur: "دانتوں کی صفائی" },
      review: {
        en: "The clinic explained every step clearly and treated me gently.",
        ur: "کلینک نے ہر مرحلہ واضح کیا اور بہت نرمی سے علاج کیا۔",
      },
      dateKey: "2026-08-18",
      image: null,
      isPublished: false,
      sortOrder: 20,
    });
  });
});
