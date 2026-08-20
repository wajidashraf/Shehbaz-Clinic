import type { Locale } from "@/i18n/config";

export type LocalizedText = Readonly<Record<Locale, string>>;

export type DemoService = Readonly<{
  id: string;
  name: LocalizedText;
  summary: LocalizedText;
  category: LocalizedText;
  durationMinutes: number;
  featured: boolean;
}>;

export type DemoDentist = Readonly<{
  id: string;
  name: LocalizedText;
  area: LocalizedText;
  biography: LocalizedText;
  languages: LocalizedText;
  workingDays: LocalizedText;
  image: string;
  imageAlt: LocalizedText;
  isDemo: true;
}>;

export const demoServices: readonly DemoService[] = [
  {
    id: "consultation",
    name: { en: "Dental consultation", ur: "دانتوں کا مشورہ" },
    summary: {
      en: "A calm conversation about your concern and the next appropriate step.",
      ur: "اپنی تکلیف اور اگلے مناسب مرحلے کے بارے میں پُرسکون گفتگو۔",
    },
    category: { en: "Consultation", ur: "مشورہ" },
    durationMinutes: 30,
    featured: true,
  },
  {
    id: "check-up",
    name: { en: "General dental check-up", ur: "عمومی دانتوں کا معائنہ" },
    summary: {
      en: "A routine review of teeth, gums, and everyday oral-care needs.",
      ur: "دانتوں، مسوڑھوں اور روزمرہ منہ کی نگہداشت کا معمول کا جائزہ۔",
    },
    category: { en: "Preventive care", ur: "احتیاطی نگہداشت" },
    durationMinutes: 30,
    featured: true,
  },
  {
    id: "cleaning",
    name: { en: "Cleaning and scaling", ur: "دانتوں کی صفائی" },
    summary: {
      en: "Professional removal of plaque and deposits after an assessment.",
      ur: "معائنے کے بعد دانتوں پر جمی تہہ اور میل کی پیشہ ورانہ صفائی۔",
    },
    category: { en: "Preventive care", ur: "احتیاطی نگہداشت" },
    durationMinutes: 45,
    featured: true,
  },
  {
    id: "filling",
    name: { en: "Dental filling", ur: "دانت کی فلنگ" },
    summary: {
      en: "An assessment and restorative-care visit for a damaged tooth.",
      ur: "متاثرہ دانت کے معائنے اور بحالی کی نگہداشت کے لیے ملاقات۔",
    },
    category: { en: "Restorative care", ur: "بحالی کی نگہداشت" },
    durationMinutes: 45,
    featured: true,
  },
  {
    id: "root-canal",
    name: { en: "Root canal assessment", ur: "روٹ کینال کا معائنہ" },
    summary: {
      en: "A focused assessment to discuss whether root canal care may be suitable.",
      ur: "یہ جاننے کے لیے تفصیلی معائنہ کہ روٹ کینال کا علاج مناسب ہو سکتا ہے یا نہیں۔",
    },
    category: { en: "Restorative care", ur: "بحالی کی نگہداشت" },
    durationMinutes: 60,
    featured: false,
  },
  {
    id: "extraction",
    name: { en: "Tooth extraction assessment", ur: "دانت نکلوانے کا معائنہ" },
    summary: {
      en: "A clinical review before any decision about removing a tooth.",
      ur: "دانت نکالنے کے کسی بھی فیصلے سے پہلے طبی معائنہ۔",
    },
    category: { en: "General care", ur: "عمومی نگہداشت" },
    durationMinutes: 45,
    featured: false,
  },
  {
    id: "children",
    name: { en: "Children’s dental visit", ur: "بچوں کے دانتوں کی ملاقات" },
    summary: {
      en: "A friendly, age-appropriate check-up for a child’s teeth and gums.",
      ur: "بچوں کے دانتوں اور مسوڑھوں کا دوستانہ اور عمر کے مطابق معائنہ۔",
    },
    category: { en: "Family care", ur: "خاندانی نگہداشت" },
    durationMinutes: 30,
    featured: false,
  },
  {
    id: "orthodontic",
    name: {
      en: "Orthodontic consultation",
      ur: "دانت سیدھے کرنے کا مشورہ",
    },
    summary: {
      en: "An introductory discussion about tooth alignment and possible next steps.",
      ur: "دانتوں کی ترتیب اور ممکنہ اگلے مراحل کے بارے میں ابتدائی گفتگو۔",
    },
    category: { en: "Smile care", ur: "مسکراہٹ کی نگہداشت" },
    durationMinutes: 30,
    featured: false,
  },
] as const;

export const demoDentists: readonly DemoDentist[] = [
  {
    id: "demo-sana",
    name: { en: "Dr. Sana Ahmed", ur: "ڈاکٹر ثنا احمد" },
    area: { en: "General and preventive care", ur: "عمومی اور احتیاطی نگہداشت" },
    biography: {
      en: "A sample profile illustrating a calm, prevention-first approach for adults and families.",
      ur: "یہ ایک نمونہ پروفائل ہے جو بڑوں اور خاندانوں کے لیے پُرسکون، احتیاطی نگہداشت کو ظاہر کرتا ہے۔",
    },
    languages: { en: "Urdu, Punjabi, English", ur: "اردو، پنجابی، انگریزی" },
    workingDays: { en: "Sample: Monday–Thursday", ur: "نمونہ: پیر تا جمعرات" },
    image: "/images/demo/dentist-1.webp",
    imageAlt: { en: "Synthetic portrait for a sample dentist profile", ur: "نمونہ ڈینٹسٹ پروفائل کے لیے مصنوعی تصویر" },
    isDemo: true,
  },
  {
    id: "demo-hamza",
    name: { en: "Dr. Hamza Ali", ur: "ڈاکٹر حمزہ علی" },
    area: { en: "Restorative dental care", ur: "دانتوں کی بحالی کی نگہداشت" },
    biography: {
      en: "A sample profile showing how restorative-care interests may appear after clinic verification.",
      ur: "یہ نمونہ دکھاتا ہے کہ کلینک کی تصدیق کے بعد بحالی کی نگہداشت کی دلچسپیاں کیسے نظر آ سکتی ہیں۔",
    },
    languages: { en: "Urdu, Punjabi, English", ur: "اردو، پنجابی، انگریزی" },
    workingDays: { en: "Sample: Tuesday–Saturday", ur: "نمونہ: منگل تا ہفتہ" },
    image: "/images/demo/dentist-2.webp",
    imageAlt: { en: "Synthetic portrait for a sample dentist profile", ur: "نمونہ ڈینٹسٹ پروفائل کے لیے مصنوعی تصویر" },
    isDemo: true,
  },
  {
    id: "demo-mahnoor",
    name: { en: "Dr. Mahnoor Iqbal", ur: "ڈاکٹر ماہ نور اقبال" },
    area: { en: "Family and children’s care", ur: "خاندانی اور بچوں کی نگہداشت" },
    biography: {
      en: "A sample profile demonstrating a welcoming family-care presentation for the future directory.",
      ur: "یہ نمونہ مستقبل کی فہرست کے لیے دوستانہ خاندانی نگہداشت کی پیشکش دکھاتا ہے۔",
    },
    languages: { en: "Urdu, Punjabi, English", ur: "اردو، پنجابی، انگریزی" },
    workingDays: { en: "Sample: Wednesday–Sunday", ur: "نمونہ: بدھ تا اتوار" },
    image: "/images/demo/dentist-3.webp",
    imageAlt: { en: "Synthetic portrait for a sample dentist profile", ur: "نمونہ ڈینٹسٹ پروفائل کے لیے مصنوعی تصویر" },
    isDemo: true,
  },
] as const;

export function getLocalizedText(text: LocalizedText, locale: Locale): string {
  return text[locale];
}

export function findDemoService(id: string): DemoService | undefined {
  return demoServices.find((service) => service.id === id);
}

export function findDemoDentist(id: string): DemoDentist | undefined {
  return demoDentists.find((dentist) => dentist.id === id);
}
