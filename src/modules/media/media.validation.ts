import "server-only";

import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import { z } from "zod";
import {
  mediaPurposes,
  type UploadPublicImageInput,
  type ValidatedPublicImage,
} from "./media.types";

const MAX_PUBLIC_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_PUBLIC_IMAGE_DIMENSION = 4096;
const MAX_PUBLIC_IMAGE_PIXELS =
  MAX_PUBLIC_IMAGE_DIMENSION * MAX_PUBLIC_IMAGE_DIMENSION;
const supportedMimeTypes = ["image/jpeg", "image/png", "image/webp"] as const;

const metadataSchema = z.object({
  purpose: z.enum(mediaPurposes),
  altText: z.object({
    en: z.string().trim().min(1).max(240),
    ur: z.string().trim().min(1).max(240).optional(),
  }),
  actorUserId: z.string().trim().min(1),
});

export class MediaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaValidationError";
  }
}

function isSupportedMimeType(
  value: string,
): value is (typeof supportedMimeTypes)[number] {
  return supportedMimeTypes.some((mimeType) => mimeType === value);
}

export async function validatePublicImage(
  input: UploadPublicImageInput,
): Promise<ValidatedPublicImage> {
  if (!isSupportedMimeType(input.declaredMimeType)) {
    throw new MediaValidationError("Unsupported image type");
  }

  if (input.bytes.byteLength === 0) {
    throw new MediaValidationError("Image content is empty");
  }

  if (input.bytes.byteLength > MAX_PUBLIC_IMAGE_BYTES) {
    throw new MediaValidationError("Image exceeds the 5 MiB limit");
  }

  const metadata = metadataSchema.safeParse(input);
  if (!metadata.success) {
    throw new MediaValidationError("Invalid image metadata");
  }

  const detected = await fileTypeFromBuffer(input.bytes);
  if (detected?.mime !== input.declaredMimeType) {
    throw new MediaValidationError(
      "Image content does not match its declared type",
    );
  }

  let dimensions: { width?: number; height?: number };
  try {
    dimensions = await sharp(Buffer.from(input.bytes), {
      limitInputPixels: MAX_PUBLIC_IMAGE_PIXELS,
      sequentialRead: true,
    }).metadata();
  } catch {
    throw new MediaValidationError("Image dimensions are invalid");
  }

  if (!dimensions.width || !dimensions.height) {
    throw new MediaValidationError("Image dimensions are invalid");
  }

  if (
    dimensions.width > MAX_PUBLIC_IMAGE_DIMENSION ||
    dimensions.height > MAX_PUBLIC_IMAGE_DIMENSION
  ) {
    throw new MediaValidationError(
      "Image dimensions exceed 4096 x 4096 pixels",
    );
  }

  const altText = Object.freeze({ ...metadata.data.altText });

  return Object.freeze({
    bytes: Uint8Array.from(input.bytes),
    declaredMimeType: input.declaredMimeType,
    detectedMimeType: input.declaredMimeType,
    width: dimensions.width,
    height: dimensions.height,
    purpose: metadata.data.purpose,
    altText,
    actorUserId: metadata.data.actorUserId,
  });
}
