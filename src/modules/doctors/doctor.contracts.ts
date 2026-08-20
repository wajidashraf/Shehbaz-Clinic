import { z } from "zod";
import type {
  DoctorLocalizedText,
  DoctorProfileInput,
  NormalizedDoctorProfile,
} from "./doctor.types";

const compactText = z.string().trim().min(1).max(240);
const optionalCompactText = z.string().trim().max(240);

const doctorProfileSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  name: compactText,
  title: compactText,
  qualification: optionalCompactText,
  education: optionalCompactText,
  registration: optionalCompactText,
  biography: z.string().trim().min(10).max(2_000),
  focusAreas: z.array(compactText).max(10),
  languages: optionalCompactText,
  workingDays: optionalCompactText,
  isFeatured: z.boolean(),
});

function localized(value: string): DoctorLocalizedText {
  return { en: value, ur: value };
}

function doctorSlug(name: string) {
  const withoutTitle = name.replace(/^dr\.?\s+/i, "");
  return withoutTitle
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeDoctorInput(
  input: DoctorProfileInput,
): NormalizedDoctorProfile {
  const profile = doctorProfileSchema.parse(input);
  const id = profile.id ?? doctorSlug(profile.name);
  if (!id) throw new z.ZodError([]);

  return {
    id,
    name: localized(profile.name),
    title: localized(profile.title),
    qualification: localized(profile.qualification),
    education: localized(profile.education),
    registration: localized(profile.registration),
    biography: localized(profile.biography),
    focusAreas: profile.focusAreas.map(localized),
    languages: localized(profile.languages),
    workingDays: localized(profile.workingDays),
    isFeatured: profile.isFeatured,
  };
}

export function eligibleDoctorIds(
  requestedDoctorId: string,
  currentDoctorIds: readonly string[],
): string[] {
  if (requestedDoctorId === "no-preference") return [...currentDoctorIds];
  return currentDoctorIds.includes(requestedDoctorId)
    ? [requestedDoctorId]
    : [];
}
