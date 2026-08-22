import type { NormalizedTestimonialInput } from "@/modules/testimonials/testimonial.types";

export const demoTestimonials: ReadonlyArray<
  NormalizedTestimonialInput & { id: string; image: null }
> = [
  {
    id: "review-ayesha-khan",
    name: { en: "Ayesha Khan", ur: "عائشہ خان" },
    treatment: { en: "Dental cleaning", ur: "دانتوں کی صفائی" },
    review: {
      en: "The team explained each step clearly and made my visit feel calm and comfortable.",
      ur: "ٹیم نے ہر مرحلہ واضح انداز میں سمجھایا اور میری ملاقات کو پُرسکون اور آرام دہ بنایا۔",
    },
    reviewDate: new Date("2026-08-18T00:00:00.000Z"),
    image: null,
    isPublished: true,
    sortOrder: 10,
  },
  {
    id: "review-hamza-ali",
    name: { en: "Hamza Ali", ur: "حمزہ علی" },
    treatment: { en: "Root canal treatment", ur: "روٹ کینال علاج" },
    review: {
      en: "The procedure was explained before treatment, and the clinic handled the entire visit professionally.",
      ur: "علاج سے پہلے طریقہ کار سمجھایا گیا اور کلینک نے پوری ملاقات پیشہ ورانہ انداز میں مکمل کی۔",
    },
    reviewDate: new Date("2026-08-10T00:00:00.000Z"),
    image: null,
    isPublished: true,
    sortOrder: 20,
  },
  {
    id: "review-sana-ahmed",
    name: { en: "Sana Ahmed", ur: "ثنا احمد" },
    treatment: { en: "Dental consultation", ur: "ڈینٹل مشاورت" },
    review: {
      en: "The staff were welcoming and the dentist took time to answer all of my questions clearly.",
      ur: "عملہ خوش اخلاق تھا اور ڈینٹسٹ نے میرے تمام سوالات کے واضح جواب دینے کے لیے وقت نکالا۔",
    },
    reviewDate: new Date("2026-08-02T00:00:00.000Z"),
    image: null,
    isPublished: true,
    sortOrder: 30,
  },
  {
    id: "review-usman-raza",
    name: { en: "Usman Raza", ur: "عثمان رضا" },
    treatment: { en: "General dentistry", ur: "جنرل ڈینٹسٹری" },
    review: {
      en: "The clinic was organized and comfortable, and my treatment plan was explained in simple language.",
      ur: "کلینک منظم اور آرام دہ تھا اور میرے علاج کا منصوبہ آسان زبان میں سمجھایا گیا۔",
    },
    reviewDate: new Date("2026-07-25T00:00:00.000Z"),
    image: null,
    isPublished: true,
    sortOrder: 40,
  },
];
