import { NextResponse } from "next/server";
import { z } from "zod";
import {
  requestHasValidOrigin,
  requireAdminRequest,
} from "@/modules/auth/admin-api.server";
import { normalizeDoctorInput } from "@/modules/doctors/doctor.contracts";
import {
  DoctorHasFutureAppointmentsError,
  findDoctor,
  findDoctorIncludingInactive,
  removeDoctor,
  saveDoctor,
} from "@/modules/doctors/doctor.repository";
import type {
  DoctorGalleryImage,
  DoctorRecord,
} from "@/modules/doctors/doctor.types";
import { getCloudinaryMediaStorage } from "@/modules/media/cloudinary.server";
import {
  findMediaAssetBySecureUrl,
  removeMediaAssetRecord,
  saveMediaAsset,
} from "@/modules/media/media.repository";
import type { StoredMedia } from "@/modules/media/media.types";

function preserveTranslation(
  next: { en: string; ur: string },
  current: { en: string; ur: string },
) {
  return { en: next.en, ur: next.en === current.en ? current.ur : next.en };
}

function formText(form: FormData, name: string) {
  return String(form.get(name) ?? "");
}

function imageFiles(form: FormData, name: string) {
  return form
    .getAll(name)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

async function uploadImage(file: File, altText: string, actorUserId: string) {
  z.number()
    .max(5 * 1024 * 1024)
    .parse(file.size);
  const storage = getCloudinaryMediaStorage();
  const stored = await storage.uploadPublicImage({
    bytes: new Uint8Array(await file.arrayBuffer()),
    declaredMimeType: file.type,
    purpose: "dentist-portrait",
    altText: { en: altText, ur: altText },
    actorUserId,
  });
  try {
    await saveMediaAsset({
      ...stored,
      purpose: "dentist-portrait",
      altText: { en: altText, ur: altText },
      actorUserId,
    });
  } catch (error) {
    await storage.deletePublicImage(stored.publicId).catch(() => undefined);
    throw error;
  }
  return stored;
}

async function removeStoredImage(secureUrl: string) {
  const asset = await findMediaAssetBySecureUrl(secureUrl);
  if (!asset) return;
  await getCloudinaryMediaStorage().deletePublicImage(asset.publicId);
  await removeMediaAssetRecord(asset.publicId);
}

async function compensateUploads(uploads: readonly StoredMedia[]) {
  await Promise.allSettled(
    uploads.map(async (upload) => {
      await getCloudinaryMediaStorage().deletePublicImage(upload.publicId);
      await removeMediaAssetRecord(upload.publicId);
    }),
  );
}

export async function POST(request: Request) {
  if (!requestHasValidOrigin(request))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const admin = await requireAdminRequest(request);
  if (!admin)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const createdMedia: StoredMedia[] = [];
  let doctorSaved = false;
  try {
    const form = await request.formData();
    const doctorId = formText(form, "doctorId") || undefined;
    const existing = doctorId ? await findDoctor(doctorId) : null;
    if (doctorId && !existing)
      return NextResponse.json({ error: "not-found" }, { status: 404 });

    const profile = normalizeDoctorInput({
      id: doctorId,
      name: formText(form, "name"),
      title: formText(form, "title"),
      qualification: formText(form, "qualification"),
      education: formText(form, "education"),
      registration: formText(form, "registration"),
      biography: formText(form, "biography"),
      focusAreas: formText(form, "focusAreas")
        .split(/\r?\n/)
        .map((value) => value.trim())
        .filter(Boolean),
      languages: formText(form, "languages"),
      workingDays: formText(form, "workingDays"),
      isFeatured: formText(form, "isFeatured") === "true",
    });

    const localizedProfile = existing
      ? {
          ...profile,
          name: preserveTranslation(profile.name, existing.name),
          title: preserveTranslation(profile.title, existing.title),
          qualification: preserveTranslation(
            profile.qualification,
            existing.qualification,
          ),
          education: preserveTranslation(profile.education, existing.education),
          registration: preserveTranslation(
            profile.registration,
            existing.registration,
          ),
          biography: preserveTranslation(profile.biography, existing.biography),
          focusAreas: profile.focusAreas.map((focus) => ({
            en: focus.en,
            ur:
              existing.focusAreas.find((current) => current.en === focus.en)
                ?.ur ?? focus.en,
          })),
          languages: preserveTranslation(profile.languages, existing.languages),
          workingDays: preserveTranslation(
            profile.workingDays,
            existing.workingDays,
          ),
        }
      : profile;

    if (!doctorId && (await findDoctorIncludingInactive(profile.id)))
      return NextResponse.json({ error: "duplicate-doctor" }, { status: 409 });

    const actorUserId = String(admin._id);
    const retainedUrls = new Set(
      form.getAll("retainedGallery").map((value) => String(value)),
    );
    const gallery: DoctorGalleryImage[] =
      existing?.featuredImages.filter((entry) => retainedUrls.has(entry.url)) ??
      [];
    const newGalleryFiles = imageFiles(form, "galleryImages");
    if (gallery.length + newGalleryFiles.length > 5)
      return NextResponse.json({ error: "gallery-limit" }, { status: 400 });

    const portraitFile = imageFiles(form, "profileImage")[0];
    const portraitUpload = portraitFile
      ? await uploadImage(
          portraitFile,
          `Portrait of ${profile.name.en}`,
          actorUserId,
        )
      : null;
    if (portraitUpload) createdMedia.push(portraitUpload);
    const image = portraitUpload?.secureUrl ?? existing?.image;
    if (!image)
      return NextResponse.json({ error: "image-required" }, { status: 400 });

    const galleryUploads: StoredMedia[] = [];
    for (const file of newGalleryFiles) {
      const upload = await uploadImage(
        file,
        `${profile.name.en} at Shahbaz Dental Clinic`,
        actorUserId,
      );
      galleryUploads.push(upload);
      createdMedia.push(upload);
    }
    const uploadedGallery = galleryUploads.map((upload) => ({
      url: upload.secureUrl,
      altText: {
        en: `${profile.name.en} at Shahbaz Dental Clinic`,
        ur: `${profile.name.en} at Shahbaz Dental Clinic`,
      },
    }));

    const record: DoctorRecord = {
      ...localizedProfile,
      image,
      imageAlt:
        !portraitUpload && existing && profile.name.en === existing.name.en
          ? existing.imageAlt
          : {
              en: `Portrait of ${profile.name.en}`,
              ur: `Portrait of ${profile.name.en}`,
            },
      featuredImages: [...gallery, ...uploadedGallery],
      sortOrder: existing?.sortOrder ?? Date.now(),
    };
    const savedDoctor = await saveDoctor(record);
    doctorSaved = true;

    if (existing) {
      const retained = new Set([
        savedDoctor.image,
        ...savedDoctor.featuredImages.map((entry) => entry.url),
      ]);
      const removed = [
        existing.image,
        ...existing.featuredImages.map((entry) => entry.url),
      ].filter((url) => !retained.has(url));
      const cleanup = await Promise.allSettled(removed.map(removeStoredImage));
      const cleanupPending = cleanup.some(
        (result) => result.status === "rejected",
      );
      return NextResponse.json({ doctor: savedDoctor, cleanupPending });
    }

    return NextResponse.json({ doctor: savedDoctor, cleanupPending: false });
  } catch (error) {
    if (!doctorSaved) await compensateUploads(createdMedia);
    return NextResponse.json(
      {
        error: error instanceof z.ZodError ? "invalid-request" : "save-failed",
      },
      { status: error instanceof z.ZodError ? 400 : 503 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!requestHasValidOrigin(request))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!(await requireAdminRequest(request)))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id)
    return NextResponse.json({ error: "invalid-request" }, { status: 400 });
  try {
    const doctor = await findDoctorIncludingInactive(id);
    await removeDoctor(id);
    const cleanup = doctor
      ? await Promise.allSettled(
          [
            doctor.image,
            ...doctor.featuredImages.map((entry) => entry.url),
          ].map(removeStoredImage),
        )
      : [];
    const cleanupPending = cleanup.some(
      (result) => result.status === "rejected",
    );
    return NextResponse.json(
      { ok: !cleanupPending, cleanupPending },
      { status: cleanupPending ? 503 : 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof DoctorHasFutureAppointmentsError
            ? "doctor-has-appointments"
            : "delete-failed",
      },
      { status: error instanceof DoctorHasFutureAppointmentsError ? 409 : 503 },
    );
  }
}
