// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import {
  createCloudinaryMediaStorage,
  MediaOwnershipError,
  MediaStorageUnavailableError,
  type CloudinaryClient,
} from "@/modules/media/cloudinary.adapter";
import type { UploadPublicImageInput } from "@/modules/media/media.types";

const png = Uint8Array.from(
  Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    "base64",
  ),
);

const input: UploadPublicImageInput = {
  bytes: png,
  declaredMimeType: "image/png",
  purpose: "clinic-logo",
  altText: { en: "Shahbaz Dental Clinic logo" },
  actorUserId: "user-1",
};

function successfulClient() {
  const upload = vi.fn().mockResolvedValue({
    asset_id: "asset-1",
    public_id: "shahbaz/development/generated-id",
    version: 7,
    secure_url: "https://res.cloudinary.com/demo/image/upload/example.png",
    format: "png",
    width: 1,
    height: 1,
    bytes: png.byteLength,
    resource_type: "image",
    ignored_provider_field: "must not escape",
  });
  const destroy = vi.fn().mockResolvedValue({ result: "ok" });

  return {
    client: { uploader: { upload, destroy } } satisfies CloudinaryClient,
    upload,
    destroy,
  };
}

describe("Cloudinary media adapter", () => {
  it("uploads a validated image to the configured folder without overwrite", async () => {
    const { client, upload } = successfulClient();
    const storage = createCloudinaryMediaStorage({
      client,
      folder: "shahbaz/development",
      publicIdFactory: () => "generated-id",
    });

    await storage.uploadPublicImage(input);

    expect(upload).toHaveBeenCalledWith(
      expect.stringMatching(/^data:image\/png;base64,/),
      {
        folder: "shahbaz/development",
        overwrite: false,
        public_id: "generated-id",
        resource_type: "image",
      },
    );
  });

  it("rejects upload when Cloudinary is not configured", async () => {
    const storage = createCloudinaryMediaStorage({
      client: null,
      folder: "shahbaz/development",
    });

    await expect(storage.uploadPublicImage(input)).rejects.toBeInstanceOf(
      MediaStorageUnavailableError,
    );
  });

  it("maps only known provider response fields", async () => {
    const { client } = successfulClient();
    const storage = createCloudinaryMediaStorage({
      client,
      folder: "shahbaz/development",
    });

    await expect(storage.uploadPublicImage(input)).resolves.toEqual({
      assetId: "asset-1",
      publicId: "shahbaz/development/generated-id",
      version: 7,
      secureUrl: "https://res.cloudinary.com/demo/image/upload/example.png",
      format: "png",
      width: 1,
      height: 1,
      bytes: png.byteLength,
      resourceType: "image",
    });
  });

  it("deletes images with cache invalidation", async () => {
    const { client, destroy } = successfulClient();
    const storage = createCloudinaryMediaStorage({
      client,
      folder: "shahbaz/development",
    });

    await storage.deletePublicImage("shahbaz/development/generated-id");

    expect(destroy).toHaveBeenCalledWith("shahbaz/development/generated-id", {
      invalidate: true,
      resource_type: "image",
    });
  });

  it("refuses to delete an asset outside the configured clinic folder", async () => {
    const { client, destroy } = successfulClient();
    const storage = createCloudinaryMediaStorage({
      client,
      folder: "shahbaz/development",
    });

    await expect(
      storage.deletePublicImage("another-clinic/private-asset"),
    ).rejects.toBeInstanceOf(MediaOwnershipError);
    expect(destroy).not.toHaveBeenCalled();
  });

  it("converts provider failures to a sanitized application error", async () => {
    const upload = vi
      .fn()
      .mockRejectedValue(new Error("provider payload with api_secret"));
    const client = {
      uploader: {
        upload,
        destroy: vi.fn(),
      },
    } satisfies CloudinaryClient;
    const storage = createCloudinaryMediaStorage({
      client,
      folder: "shahbaz/development",
    });

    await expect(storage.uploadPublicImage(input)).rejects.toEqual(
      new MediaStorageUnavailableError(),
    );
  });
});
