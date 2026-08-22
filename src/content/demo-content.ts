import type { Locale } from "@/i18n/config";
import type { DoctorRecord } from "@/modules/doctors/doctor.types";

export type LocalizedText = Readonly<Record<Locale, string>>;

export type DemoService = Readonly<{
  id: string;
  name: LocalizedText;
  summary: LocalizedText;
  details: LocalizedText;
  suitableFor: readonly LocalizedText[];
  expectations: readonly LocalizedText[];
  clinicalNote: LocalizedText;
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
    details: {
      en: "A dental consultation gives you time to explain symptoms, ask questions, and understand which examination or treatment may be appropriate. The dentist reviews your concern before discussing practical next steps.",
      ur: "ڈینٹل مشورے میں آپ اپنی علامات بیان کر سکتے ہیں، سوال پوچھ سکتے ہیں اور جان سکتے ہیں کہ کون سا معائنہ یا علاج مناسب ہو سکتا ہے۔ ڈینٹسٹ اگلے عملی مرحلے پر بات کرنے سے پہلے آپ کی ضرورت کا جائزہ لیتا ہے۔",
    },
    suitableFor: [
      { en: "A new dental concern or ongoing discomfort", ur: "دانتوں کی نئی تکلیف یا مسلسل بے آرامی" },
      { en: "Patients who need guidance before choosing treatment", ur: "وہ مریض جنہیں علاج منتخب کرنے سے پہلے رہنمائی درکار ہو" },
    ],
    expectations: [
      { en: "Discuss your symptoms, history, and priorities", ur: "اپنی علامات، سابقہ طبی معلومات اور ترجیحات بتائیں" },
      { en: "Receive a focused oral examination when needed", ur: "ضرورت کے مطابق منہ اور دانتوں کا معائنہ کروائیں" },
      { en: "Review recommended next steps and possible appointments", ur: "تجویز کردہ اگلے مراحل اور ممکنہ اپائنٹمنٹس سمجھیں" },
    ],
    clinicalNote: {
      en: "A consultation does not guarantee that treatment will be completed during the same visit.",
      ur: "مشورے کی اپائنٹمنٹ میں اسی ملاقات کے دوران علاج مکمل ہونے کی ضمانت نہیں ہوتی۔",
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
    details: {
      en: "A general check-up reviews the health of your teeth, gums, bite, and mouth. It can identify concerns early and help you maintain a practical home-care routine.",
      ur: "عمومی معائنے میں دانتوں، مسوڑھوں، کاٹنے کی ترتیب اور منہ کی صحت دیکھی جاتی ہے۔ اس سے مسائل کو ابتدائی مرحلے میں پہچاننے اور روزمرہ نگہداشت بہتر بنانے میں مدد ملتی ہے۔",
    },
    suitableFor: [
      { en: "Routine preventive dental care", ur: "معمول کی احتیاطی ڈینٹل نگہداشت" },
      { en: "Sensitivity, bleeding gums, or changes in oral health", ur: "حساسیت، مسوڑھوں سے خون یا منہ کی صحت میں تبدیلی" },
    ],
    expectations: [
      { en: "Review your dental and health history", ur: "اپنی ڈینٹل اور طبی سابقہ معلومات کا جائزہ" },
      { en: "Examine teeth, gums, and surrounding tissues", ur: "دانتوں، مسوڑھوں اور اردگرد کے ٹشوز کا معائنہ" },
      { en: "Discuss prevention, cleaning, or further assessment", ur: "احتیاط، صفائی یا مزید معائنے پر گفتگو" },
    ],
    clinicalNote: {
      en: "X-rays or another focused assessment may be advised after the clinical examination.",
      ur: "طبی معائنے کے بعد ایکسرے یا مزید مخصوص جانچ کا مشورہ دیا جا سکتا ہے۔",
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
    details: {
      en: "Cleaning and scaling removes plaque, tartar, and surface deposits that regular brushing may not reach. The visit also supports healthier gums and more effective daily cleaning.",
      ur: "کلیننگ اور اسکیلنگ سے پلاک، ٹارٹر اور سطحی میل صاف کی جاتی ہے جو عام برش سے مکمل طور پر نہیں نکلتی۔ یہ ملاقات مسوڑھوں کی صحت اور روزمرہ صفائی کو بھی بہتر بناتی ہے۔",
    },
    suitableFor: [
      { en: "Plaque, tartar, or persistent surface staining", ur: "پلاک، ٹارٹر یا دانتوں پر مسلسل سطحی داغ" },
      { en: "Gum-care support after a dental assessment", ur: "معائنے کے بعد مسوڑھوں کی نگہداشت" },
    ],
    expectations: [
      { en: "Assess your gums and level of deposits", ur: "مسوڑھوں اور جمی ہوئی تہہ کا جائزہ" },
      { en: "Remove deposits with professional instruments", ur: "پیشہ ورانہ آلات سے میل اور تہہ کی صفائی" },
      { en: "Receive practical brushing and gum-care advice", ur: "برش اور مسوڑھوں کی نگہداشت کی عملی ہدایات" },
    ],
    clinicalNote: {
      en: "Temporary sensitivity can occur, especially when deposits are heavy or gums are inflamed.",
      ur: "زیادہ میل یا مسوڑھوں کی سوزش کی صورت میں عارضی حساسیت ہو سکتی ہے۔",
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
    details: {
      en: "A dental filling restores a tooth affected by decay or limited damage. The dentist first checks how much healthy tooth remains and then discusses the most suitable restorative material.",
      ur: "ڈینٹل فلنگ سے کیڑا لگنے یا محدود نقصان سے متاثرہ دانت بحال کیا جاتا ہے۔ ڈینٹسٹ پہلے صحت مند دانت کی باقی مقدار دیکھتا ہے اور پھر مناسب بحالی مواد پر بات کرتا ہے۔",
    },
    suitableFor: [
      { en: "A cavity or small area of tooth decay", ur: "دانت میں کیڑا یا چھوٹا سوراخ" },
      { en: "A chipped or worn area suitable for restoration", ur: "دانت کا ٹوٹا یا گھسا ہوا حصہ جس کی بحالی ممکن ہو" },
    ],
    expectations: [
      { en: "Examine the tooth and confirm restorability", ur: "دانت کا معائنہ اور بحالی کی امکان کی تصدیق" },
      { en: "Remove affected tissue and prepare the area", ur: "متاثرہ حصہ صاف کرکے دانت تیار کرنا" },
      { en: "Place, shape, and check the filling", ur: "فلنگ لگانا، شکل دینا اور کاٹنے کی جانچ" },
    ],
    clinicalNote: {
      en: "Deep decay may require additional treatment instead of, or before, a filling.",
      ur: "گہرا کیڑا ہونے کی صورت میں فلنگ سے پہلے یا اس کے بجائے مزید علاج درکار ہو سکتا ہے۔",
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
    details: {
      en: "A root canal assessment investigates pain, infection, or damage involving the inside of a tooth. The dentist evaluates whether the tooth can be preserved and explains the treatment stages if root canal care is appropriate.",
      ur: "روٹ کینال معائنے میں دانت کے اندر درد، انفیکشن یا نقصان کی جانچ کی جاتی ہے۔ ڈینٹسٹ دیکھتا ہے کہ دانت محفوظ رہ سکتا ہے یا نہیں اور مناسب ہونے پر علاج کے مراحل سمجھاتا ہے۔",
    },
    suitableFor: [
      { en: "Persistent toothache or pain when biting", ur: "مسلسل دانت درد یا چبانے پر تکلیف" },
      { en: "A tooth with suspected infection or deep decay", ur: "ممکنہ انفیکشن یا گہرے کیڑے والا دانت" },
    ],
    expectations: [
      { en: "Discuss symptoms and examine the affected tooth", ur: "علامات پر گفتگو اور متاثرہ دانت کا معائنہ" },
      { en: "Use diagnostic tests or imaging when indicated", ur: "ضرورت کے مطابق تشخیصی ٹیسٹ یا ایکسرے" },
      { en: "Review preservation options, stages, and follow-up", ur: "دانت محفوظ رکھنے کے طریقے، مراحل اور فالو اپ سمجھنا" },
    ],
    clinicalNote: {
      en: "The assessment determines suitability; root canal treatment may require more than one visit and later restoration.",
      ur: "معائنے سے علاج کی مناسبت طے ہوتی ہے؛ روٹ کینال کے لیے ایک سے زیادہ ملاقاتیں اور بعد میں دانت کی بحالی درکار ہو سکتی ہے۔",
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
    details: {
      en: "An extraction assessment reviews whether a tooth should be removed or whether another treatment could preserve it. The dentist considers the tooth, surrounding tissues, health history, and recovery needs.",
      ur: "دانت نکالنے کے معائنے میں دیکھا جاتا ہے کہ دانت نکالنا ضروری ہے یا کسی دوسرے علاج سے اسے محفوظ رکھا جا سکتا ہے۔ ڈینٹسٹ دانت، اردگرد کے ٹشوز، طبی تاریخ اور صحت یابی کی ضروریات دیکھتا ہے۔",
    },
    suitableFor: [
      { en: "A severely damaged, loose, or painful tooth", ur: "شدید خراب، ہلتا ہوا یا دردناک دانت" },
      { en: "A tooth already advised for possible removal", ur: "وہ دانت جسے نکالنے کا پہلے مشورہ دیا گیا ہو" },
    ],
    expectations: [
      { en: "Review symptoms, medicines, and health history", ur: "علامات، ادویات اور طبی تاریخ کا جائزہ" },
      { en: "Examine the tooth and use imaging when needed", ur: "دانت کا معائنہ اور ضرورت پر ایکسرے" },
      { en: "Discuss alternatives, procedure, and aftercare", ur: "متبادل علاج، طریقہ کار اور بعد کی نگہداشت پر گفتگو" },
    ],
    clinicalNote: {
      en: "Removal is recommended only after assessment; complex cases may need referral to an oral surgeon.",
      ur: "دانت نکالنے کی تجویز معائنے کے بعد دی جاتی ہے؛ پیچیدہ صورت میں اورل سرجن سے رجوع کرنا پڑ سکتا ہے۔",
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
    details: {
      en: "A children’s dental visit introduces care gently while checking teeth, gums, growth, and daily habits. The pace and explanation are adapted to the child’s age and comfort.",
      ur: "بچوں کی ڈینٹل ملاقات میں نرمی سے دانتوں، مسوڑھوں، نشوونما اور روزمرہ عادات کا جائزہ لیا جاتا ہے۔ رفتار اور وضاحت بچے کی عمر اور آرام کے مطابق رکھی جاتی ہے۔",
    },
    suitableFor: [
      { en: "A child’s first dental visit or routine check-up", ur: "بچے کی پہلی ڈینٹل ملاقات یا معمول کا معائنہ" },
      { en: "Tooth pain, sensitivity, or changes noticed by a parent", ur: "دانت درد، حساسیت یا والدین کی محسوس کردہ تبدیلی" },
    ],
    expectations: [
      { en: "Help the child become comfortable with the setting", ur: "بچے کو کلینک کے ماحول سے آرام دہ بنانا" },
      { en: "Check teeth, gums, growth, and oral habits", ur: "دانتوں، مسوڑھوں، نشوونما اور منہ کی عادات کی جانچ" },
      { en: "Give age-appropriate home-care guidance", ur: "عمر کے مطابق گھر پر نگہداشت کی رہنمائی" },
    ],
    clinicalNote: {
      en: "Treatment depends on the child’s needs and comfort and may be scheduled for a separate visit.",
      ur: "علاج بچے کی ضرورت اور آرام کے مطابق ہوتا ہے اور الگ ملاقات میں مقرر کیا جا سکتا ہے۔",
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
    details: {
      en: "An orthodontic consultation reviews tooth alignment, bite, jaw growth, and your goals. It helps determine whether braces, aligners, monitoring, or another approach may be suitable.",
      ur: "آرتھوڈانٹک مشورے میں دانتوں کی ترتیب، بائٹ، جبڑے کی نشوونما اور آپ کے مقاصد کا جائزہ لیا جاتا ہے۔ اس سے معلوم ہوتا ہے کہ بریسز، الائنرز، نگرانی یا کوئی دوسرا طریقہ مناسب ہو سکتا ہے۔",
    },
    suitableFor: [
      { en: "Crowded, spaced, or visibly misaligned teeth", ur: "بھیڑ والے، فاصلے والے یا ٹیڑھے دانت" },
      { en: "Concerns about bite or jaw alignment", ur: "بائٹ یا جبڑے کی ترتیب سے متعلق تشویش" },
    ],
    expectations: [
      { en: "Discuss alignment concerns and treatment goals", ur: "دانتوں کی ترتیب اور علاج کے مقاصد پر گفتگو" },
      { en: "Examine teeth, bite, and jaw relationship", ur: "دانتوں، بائٹ اور جبڑے کے تعلق کا معائنہ" },
      { en: "Review records needed and possible treatment paths", ur: "ضروری ریکارڈ اور ممکنہ علاج کے طریقے سمجھنا" },
    ],
    clinicalNote: {
      en: "A complete orthodontic plan may require photographs, scans, impressions, or X-rays after the consultation.",
      ur: "مکمل آرتھوڈانٹک منصوبے کے لیے مشورے کے بعد تصاویر، اسکین، امپریشن یا ایکسرے درکار ہو سکتے ہیں۔",
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

export function getRelatedDemoServices(
  serviceId: string,
  limit = 3,
): readonly DemoService[] {
  const activeService = findDemoService(serviceId);
  if (!activeService || limit <= 0) return [];

  const candidates = demoServices.filter((service) => service.id !== serviceId);
  const sameCategory = candidates.filter(
    (service) => service.category.en === activeService.category.en,
  );
  const otherCategories = candidates.filter(
    (service) => service.category.en !== activeService.category.en,
  );

  return [...sameCategory, ...otherCategories].slice(0, limit);
}

export function findDemoDentist(id: string): DemoDentist | undefined {
  return demoDentists.find((dentist) => dentist.id === id);
}
