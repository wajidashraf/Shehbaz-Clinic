import type { Locale } from "@/i18n/config";
import type { DoctorRecord } from "@/modules/doctors/doctor.types";

export type LocalizedText = Readonly<Record<Locale, string>>;

export type DemoService = Readonly<{
  id: string;
  name: LocalizedText;
  summary: LocalizedText;
  category: LocalizedText;
  durationMinutes: number;
  featured: boolean;
}>;

export type DemoDentist = DoctorRecord;

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
    id: "sobia-zulfiqar",
    name: { en: "Dr. Sobia Zulfiqar", ur: "ڈاکٹر صوبیہ ذوالفقار" },
    title: {
      en: "Dental Surgeon",
      ur: "ڈینٹل سرجن",
    },
    qualification: {
      en: "BDS, RDS (Punjab), RDS",
      ur: "BDS, RDS (Punjab), RDS",
    },
    education: {
      en: "Akhtar House, Punjab Dental Hospital, Lahore",
      ur: "اختر ہاؤس، پنجاب ڈینٹل ہسپتال، لاہور",
    },
    registration: { en: "PM&DC — 13365-D", ur: "PM&DC — 13365-D" },
    biography: {
      en: "Dr. Sobia Zulfiqar is a dental surgeon specializing in orthodontics and endodontics, offering braces, aligners, and root canal treatment for patients of all ages.",
      ur: "ڈاکٹر صوبیہ ذوالفقار آرتھوڈانٹکس اور اینڈوڈانٹکس میں مہارت رکھنے والی ڈینٹل سرجن ہیں، جو ہر عمر کے مریضوں کے لیے بریسز، الائنرز اور روٹ کینال علاج فراہم کرتی ہیں۔",
    },
    focusAreas: [
      {
        en: "C-Ortho / C-Endo (Braces & Aligners)",
        ur: "C-Ortho / C-Endo (بریسز اور الائنرز)",
      },
      { en: "Root canal treatment", ur: "روٹ کینال علاج" },
    ],
    languages: { en: "", ur: "" },
    workingDays: { en: "", ur: "" },
    image: "/images/dentists/sobia-ahmad.webp",
    imageAlt: {
      en: "Portrait of Dr. Sobia Zulfiqar",
      ur: "ڈاکٹر صوبیہ ذوالفقار کی تصویر",
    },
    featuredImages: [],
    isFeatured: false,
    sortOrder: 10,
  },
  {
    id: "amna-baig",
    name: { en: "Dr. Amna Baig", ur: "ڈاکٹر آمنہ بیگ" },
    title: {
      en: "Dental Surgeon",
      ur: "ڈینٹل سرجن",
    },
    qualification: {
      en: "BDS, RDS (Punjab), RDS",
      ur: "BDS, RDS (Punjab), RDS",
    },
    education: {
      en: "Akhtar House, Sarwar Shaheed Medical & Dental College, Lahore",
      ur: "اختر ہاؤس، سرور شہید میڈیکل اینڈ ڈینٹل کالج، لاہور",
    },
    registration: { en: "PM&DC — 13463-D", ur: "PM&DC — 13463-D" },
    biography: {
      en: "Dr. Amna Baig is a dental surgeon with FCPS(I) certification in orthodontics. She provides general dental care with a focus on orthodontic assessment and treatment planning.",
      ur: "ڈاکٹر آمنہ بیگ آرتھوڈانٹکس میں FCPS(I) سرٹیفیکیشن کے ساتھ ڈینٹل سرجن ہیں۔ وہ آرتھوڈانٹک معائنے اور علاج کی منصوبہ بندی پر توجہ کے ساتھ عمومی دانتوں کی نگہداشت فراہم کرتی ہیں۔",
    },
    focusAreas: [
      {
        en: "FCPS(I) certified in Orthodontics",
        ur: "آرتھوڈانٹکس میں FCPS(I) سرٹیفائیڈ",
      },
      { en: "Orthodontic assessment", ur: "آرتھوڈانٹک معائنہ" },
    ],
    languages: { en: "", ur: "" },
    workingDays: { en: "", ur: "" },
    image: "/images/dentists/amna-baig.webp",
    imageAlt: {
      en: "Portrait of Dr. Amna Baig",
      ur: "ڈاکٹر آمنہ بیگ کی تصویر",
    },
    featuredImages: [],
    isFeatured: false,
    sortOrder: 20,
  },
  {
    id: "ahmed-mobeen",
    name: { en: "Dr. Ahmed Mobeen", ur: "ڈاکٹر احمد مبین" },
    title: {
      en: "Managing Director · Senior Dental Technologist",
      ur: "منیجنگ ڈائریکٹر · سینئر ڈینٹل ٹیکنالوجسٹ",
    },
    qualification: {
      en: "Senior Dental Technologist",
      ur: "سینئر ڈینٹل ٹیکنالوجسٹ",
    },
    education: {
      en: "Punjab Medical Faculty, Lahore",
      ur: "پنجاب میڈیکل فیکلٹی، لاہور",
    },
    registration: { en: "Reg # 19169-DTT", ur: "رجسٹریشن # 19169-DTT" },
    biography: {
      en: "Dr. Ahmed Mobeen is our senior dental technologist, supporting the clinical team with lab work, appliance fabrication, and technical procedures behind every treatment plan.",
      ur: "ڈاکٹر احمد مبین ہمارے سینئر ڈینٹل ٹیکنالوجسٹ ہیں، جو لیب ورک، آلات کی تیاری اور ہر علاج کے منصوبے کے تکنیکی طریقۂ کار میں کلینیکل ٹیم کی معاونت کرتے ہیں۔",
    },
    focusAreas: [
      { en: "Dental laboratory work", ur: "ڈینٹل لیبارٹری ورک" },
      { en: "Appliance fabrication", ur: "آلات کی تیاری" },
    ],
    languages: { en: "", ur: "" },
    workingDays: { en: "", ur: "" },
    image: "/images/dentists/Ahmad.png",
    imageAlt: {
      en: "Portrait of Dr. Ahmed Mobeen",
      ur: "ڈاکٹر احمد مبین کی تصویر",
    },
    featuredImages: [],
    isFeatured: false,
    sortOrder: 30,
  },
  {
    id: "manzoor-shahbaz",
    name: { en: "Dr. Manzoor Shahbaz", ur: "ڈاکٹر منظور شہباز" },
    title: { en: "Chief Executive Officer", ur: "چیف ایگزیکٹو آفیسر" },
    qualification: { en: "", ur: "" },
    education: { en: "", ur: "" },
    registration: { en: "", ur: "" },
    biography: {
      en: "Dr. Manzoor Shahbaz is the Chief Executive Officer of Shahbaz Dental Clinic.",
      ur: "ڈاکٹر منظور شہباز شہباز ڈینٹل کلینک کے چیف ایگزیکٹو آفیسر ہیں۔",
    },
    focusAreas: [],
    languages: { en: "", ur: "" },
    workingDays: { en: "", ur: "" },
    image: "/images/dentists/shahbaz.png",
    imageAlt: {
      en: "Portrait of Dr. Manzoor Shahbaz",
      ur: "ڈاکٹر منظور شہباز کی تصویر",
    },
    featuredImages: [
      {
        url: "/images/dentists/shahbaz.png",
        altText: {
          en: "Dr. Manzoor Shahbaz at Shahbaz Dental Clinic",
          ur: "شہباز ڈینٹل کلینک میں ڈاکٹر منظور شہباز",
        },
      },
    ],
    isFeatured: true,
    sortOrder: 40,
  },
  {
    id: "rana-muhammad-adnan",
    name: { en: "Dr. Rana Muhammad Adnan", ur: "ڈاکٹر رانا محمد عدنان" },
    title: {
      en: "Consultant Dental Surgeon · Oral & Maxillofacial Surgeon",
      ur: "کنسلٹنٹ ڈینٹل سرجن · اورل اینڈ میکسیلوفیشل سرجن",
    },
    qualification: { en: "BDS, MDS", ur: "BDS, MDS" },
    education: {
      en: "King Edward Medical University & Mayo Hospital, Lahore",
      ur: "کنگ ایڈورڈ میڈیکل یونیورسٹی اور میو ہسپتال، لاہور",
    },
    registration: { en: "PMDC — 10972-D", ur: "PMDC — 10972-D" },
    biography: {
      en: "Dr. Adnan is our consultant oral & maxillofacial surgeon, specializing in complex jaw and facial cases — from fracture repair to implant-supported restorations in reconstructed bone. Trained at King Edward Medical University and Mayo Hospital, Lahore.",
      ur: "ڈاکٹر عدنان ہمارے کنسلٹنٹ اورل اینڈ میکسیلوفیشل سرجن ہیں، جو جبڑے اور چہرے کے پیچیدہ کیسز، فریکچر کی مرمت اور تعمیر شدہ ہڈی میں امپلانٹ سپورٹڈ بحالی میں مہارت رکھتے ہیں۔",
    },
    focusAreas: [
      {
        en: "Jaw & facial bone fractures",
        ur: "جبڑے اور چہرے کی ہڈی کے فریکچر",
      },
      { en: "Jaw tumor & cyst removal", ur: "جبڑے کی رسولی اور سسٹ کا خاتمہ" },
      { en: "Dental implants", ur: "ڈینٹل امپلانٹس" },
      {
        en: "Jawbone root canal treatment",
        ur: "جبڑے کی ہڈی سے متعلق روٹ کینال علاج",
      },
      { en: "Pediatric cases", ur: "بچوں کے کیسز" },
    ],
    languages: { en: "", ur: "" },
    workingDays: { en: "", ur: "" },
    image: "/images/demo/dentist-2.webp",
    imageAlt: {
      en: "Portrait of Dr. Rana Muhammad Adnan",
      ur: "ڈاکٹر رانا محمد عدنان کی تصویر",
    },
    featuredImages: [],
    isFeatured: false,
    sortOrder: 50,
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
