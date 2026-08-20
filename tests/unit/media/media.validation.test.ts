import { describe, expect, it } from "vitest";
import sharp from "sharp";
import { validatePublicImage } from "@/modules/media/media.validation";
import type { UploadPublicImageInput } from "@/modules/media/media.types";

const png = Uint8Array.from(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    "base64",
  ),
);

function validInput(
  overrides: Partial<UploadPublicImageInput> = {},
): UploadPublicImageInput {
  return {
    bytes: png,
    declaredMimeType: "image/png",
    purpose: "clinic-logo",
    altText: { en: "Shahbaz Dental Clinic logo" },
    actorUserId: "user-1",
    ...overrides,
  };
}

describe("validatePublicImage", () => {
  it("accepts a supported image whose signature matches its declaration", async () => {
    const result = await validatePublicImage(validInput());

    expect(result.detectedMimeType).toBe("image/png");
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.altText)).toBe(true);
  });

  it("rejects unsupported declared image types", async () => {
    await expect(
      validatePublicImage(validInput({ declaredMimeType: "image/gif" })),
    ).rejects.toThrow("Unsupported image type");
  });

  it("rejects a mismatch between bytes and the declared MIME type", async () => {
    await expect(
      validatePublicImage(validInput({ declaredMimeType: "image/jpeg" })),
    ).rejects.toThrow("Image content does not match its declared type");
  });

  it("rejects empty image content", async () => {
    await expect(
      validatePublicImage(validInput({ bytes: new Uint8Array() })),
    ).rejects.toThrow("Image content is empty");
  });

  it("rejects images larger than 5 MiB before reading their signature", async () => {
    await expect(
      validatePublicImage(
        validInput({ bytes: new Uint8Array(5 * 1024 * 1024 + 1) }),
      ),
    ).rejects.toThrow("Image exceeds the 5 MiB limit");
  });

  it("requires concise English alt text", async () => {
    await expect(
      validatePublicImage(validInput({ altText: { en: " " } })),
    ).rejects.toThrow("Invalid image metadata");

    await expect(
      validatePublicImage(validInput({ altText: { en: "a".repeat(241) } })),
    ).rejects.toThrow("Invalid image metadata");
  });

  it("rejects an unknown media purpose", async () => {
    await expect(
      validatePublicImage(
        validInput({ purpose: "patient-document" as "clinic-logo" }),
      ),
    ).rejects.toThrow("Invalid image metadata");
  });

  it("rejects dimensions larger than 4096 pixels before provider access", async () => {
    const oversized = await sharp({
      create: {
        width: 4097,
        height: 1,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    await expect(
      validatePublicImage(validInput({ bytes: Uint8Array.from(oversized) })),
    ).rejects.toThrow("Image dimensions exceed 4096 x 4096 pixels");
  });
});
