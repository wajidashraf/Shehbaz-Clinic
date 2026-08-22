import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  requestHasValidOrigin,
  requireAdminRequest,
} from "@/modules/auth/admin-api.server";
import { getCloudinaryMediaStorage } from "@/modules/media/cloudinary.server";
import {
  findMediaAssetBySecureUrl,
  removeMediaAssetRecord,
  saveMediaAsset,
} from "@/modules/media/media.repository";
import type { StoredMedia } from "@/modules/media/media.types";
import { MediaValidationError } from "@/modules/media/media.validation";
import { normalizeTestimonialInput } from "@/modules/testimonials/testimonial.contracts";
import {
  findTestimonial,
  removeTestimonial,
  saveTestimonial,
} from "@/modules/testimonials/testimonial.repository";

function formText(form: FormData, name: string) {
  return String(form.get(name) ?? "");
}

function imageFile(form: FormData) {
  const value = form.get("image");
  return value instanceof File && value.size > 0 ? value : null;
}

async function uploadImage(
  file: File,
  patientName: string,
  actorUserId: string,
) {
  z.number()
    .max(5 * 1024 * 1024)
    .parse(file.size);
  const altText = `Patient testimonial from ${patientName}`;
  const storage = getCloudinaryMediaStorage();
  const stored = await storage.uploadPublicImage({
    bytes: new Uint8Array(await file.arrayBuffer()),
    declaredMimeType: file.type,
    purpose: "testimonial-image",
    altText: { en: altText, ur: altText },
    actorUserId,
  });
  try {
    await saveMediaAsset({
      ...stored,
      purpose: "testimonial-image",
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

async function compensateUpload(upload: StoredMedia | null) {
  if (!upload) return;
  await Promise.allSettled([
    getCloudinaryMediaStorage().deletePublicImage(upload.publicId),
    removeMediaAssetRecord(upload.publicId),
  ]);
}

export async function POST(request: Request) {
  if (!requestHasValidOrigin(request))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const admin = await requireAdminRequest(request);
  if (!admin)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let uploadedImage: StoredMedia | null = null;
  let testimonialSaved = false;
  try {
    const form = await request.formData();
    const testimonialId = formText(form, "testimonialId") || undefined;
    const existing = testimonialId
      ? await findTestimonial(testimonialId)
      : null;
    if (testimonialId && !existing)
      return NextResponse.json({ error: "not-found" }, { status: 404 });

    const testimonial = normalizeTestimonialInput({
      id: testimonialId,
      nameEn: formText(form, "nameEn"),
      nameUr: formText(form, "nameUr"),
      treatmentEn: formText(form, "treatmentEn"),
      treatmentUr: formText(form, "treatmentUr"),
      reviewEn: formText(form, "reviewEn"),
      reviewUr: formText(form, "reviewUr"),
      dateKey: formText(form, "dateKey"),
      isPublished: formText(form, "isPublished") === "true",
      sortOrder: Number(formText(form, "sortOrder")),
    });

    const file = imageFile(form);
    uploadedImage = file
      ? await uploadImage(file, testimonial.name.en, String(admin._id))
      : null;
    const removeImage = formText(form, "removeImage") === "true";
    const image =
      uploadedImage?.secureUrl ??
      (removeImage ? null : (existing?.image ?? null));
    const saved = await saveTestimonial({
      ...testimonial,
      id: testimonial.id ?? `testimonial-${randomUUID()}`,
      image,
    });
    testimonialSaved = true;

    const previousImage = existing?.image;
    const cleanup =
      previousImage && previousImage !== saved.image
        ? await Promise.allSettled([removeStoredImage(previousImage)])
        : [];
    const cleanupPending = cleanup.some(
      (result) => result.status === "rejected",
    );
    return NextResponse.json({ testimonial: saved, cleanupPending });
  } catch (error) {
    if (!testimonialSaved) await compensateUpload(uploadedImage);
    const invalidImage =
      error instanceof MediaValidationError ||
      (error instanceof Error && error.name === "MediaValidationError");
    const invalidRequest =
      error instanceof z.ZodError || invalidImage;
    return NextResponse.json(
      {
        error:
          invalidImage
            ? "invalid-image"
            : error instanceof z.ZodError
              ? "invalid-request"
              : "save-failed",
      },
      { status: invalidRequest ? 400 : 503 },
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
    const testimonial = await findTestimonial(id);
    if (!testimonial)
      return NextResponse.json({ error: "not-found" }, { status: 404 });
    await removeTestimonial(id);
    const cleanup = testimonial.image
      ? await Promise.allSettled([removeStoredImage(testimonial.image)])
      : [];
    const cleanupPending = cleanup.some(
      (result) => result.status === "rejected",
    );
    return NextResponse.json({ ok: true, cleanupPending });
  } catch {
    return NextResponse.json({ error: "delete-failed" }, { status: 503 });
  }
}
