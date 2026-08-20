export type DoctorLocalizedText = Readonly<{ en: string; ur: string }>;

export type DoctorGalleryImage = Readonly<{
  url: string;
  altText: DoctorLocalizedText;
}>;

export type DoctorRecord = Readonly<{
  id: string;
  name: DoctorLocalizedText;
  title: DoctorLocalizedText;
  qualification: DoctorLocalizedText;
  education: DoctorLocalizedText;
  registration: DoctorLocalizedText;
  biography: DoctorLocalizedText;
  focusAreas: readonly DoctorLocalizedText[];
  languages: DoctorLocalizedText;
  workingDays: DoctorLocalizedText;
  image: string;
  imageAlt: DoctorLocalizedText;
  featuredImages: readonly DoctorGalleryImage[];
  isFeatured: boolean;
  sortOrder: number;
}>;

export type DoctorProfileInput = Readonly<{
  id?: string;
  name: string;
  title: string;
  qualification: string;
  education: string;
  registration: string;
  biography: string;
  focusAreas: readonly string[];
  languages: string;
  workingDays: string;
  isFeatured: boolean;
}>;

export type NormalizedDoctorProfile = Omit<
  DoctorRecord,
  "image" | "imageAlt" | "featuredImages" | "sortOrder"
>;
