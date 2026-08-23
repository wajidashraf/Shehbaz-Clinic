import type { DoctorRecord } from "@/modules/doctors/doctor.types";

export const featuredHomepageDentist: DoctorRecord = {
  id: "manzoor-shahbaz",
  name: { en: "Dr. Manzoor Shahbaz", ur: "ÚˆØ§Ú©Ù¹Ø± Ù…Ù†Ø¸ÙˆØ± Ø´ÛØ¨Ø§Ø²" },
  title: { en: "Dental Surgeon", ur: "ÚˆÛŒÙ†Ù¹Ù„ Ø³Ø±Ø¬Ù†" },
  qualification: { en: "BDS", ur: "Ø¨ÛŒ ÚˆÛŒ Ø§ÛŒØ³" },
  registration: { en: "PMDC 24988", ur: "Ù¾ÛŒ Ø§ÛŒÙ… ÚˆÛŒ Ø³ÛŒ 24988" },
  education: {
    en: "Professional dental education and clinical training in comprehensive patient care.",
    ur: "Ø¬Ø§Ù…Ø¹ Ù…Ø±ÛŒØ¶ÙˆÚº Ú©ÛŒ Ù†Ú¯ÛØ¯Ø§Ø´Øª Ú©Û’ Ù„ÛŒÛ’ Ù¾ÛŒØ´Û ÙˆØ±Ø§Ù†Û ÚˆÛŒÙ†Ù¹Ù„ ØªØ¹Ù„ÛŒÙ… Ø§ÙˆØ± Ø·Ø¨ÛŒ ØªØ±Ø¨ÛŒØªÛ”",
  },
  biography: {
    en: "Providing careful, clearly explained dental treatment for patients in Samundri.",
    ur: "Ø³Ù…Ù†Ø¯Ø±ÛŒ Ù…ÛŒÚº Ù…Ø±ÛŒØ¶ÙˆÚº Ú©Ùˆ Ø§Ø­ØªÛŒØ§Ø· Ø§ÙˆØ± ÙˆØ§Ø¶Ø­ Ø±ÛÙ†Ù…Ø§Ø¦ÛŒ Ú©Û’ Ø³Ø§ØªÚ¾ Ø¯Ø§Ù†ØªÙˆÚº Ú©Ø§ Ø¹Ù„Ø§Ø¬ ÙØ±Ø§ÛÙ… Ú©Ø±ØªÛ’ ÛÛŒÚºÛ”",
  },
  focusAreas: [
    { en: "General dentistry", ur: "Ø¹Ù…ÙˆÙ…ÛŒ Ø¯Ù†Ø¯Ø§Ù† Ø³Ø§Ø²ÛŒ" },
    {
      en: "Restorative treatment",
      ur: "Ø¯Ø§Ù†ØªÙˆÚº Ú©ÛŒ Ø¨Ø­Ø§Ù„ÛŒ Ú©Ø§ Ø¹Ù„Ø§Ø¬",
    },
  ],
  languages: {
    en: "English, Urdu, Punjabi",
    ur: "Ø§Ù†Ú¯Ø±ÛŒØ²ÛŒØŒ Ø§Ø±Ø¯ÙˆØŒ Ù¾Ù†Ø¬Ø§Ø¨ÛŒ",
  },
  workingDays: { en: "Daily", ur: "Ø±ÙˆØ²Ø§Ù†Û" },
  image: "/images/demo/featureDoctor.avif",
  imageAlt: {
    en: "Featured dentist at Shahbaz Dental Clinic",
    ur: "Ø´ÛØ¨Ø§Ø² ÚˆÛŒÙ†Ù¹Ù„ Ú©Ù„ÛŒÙ†Ú© Ú©Û’ Ù†Ù…Ø§ÛŒØ§Úº ÚˆÛŒÙ†Ù¹Ø³Ù¹",
  },
  featuredImages: [],
  isFeatured: true,
  sortOrder: 10,
};
