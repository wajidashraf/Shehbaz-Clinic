import "server-only";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import type {
  MediaStorage,
  StoredMedia,
  UploadPublicImageInput,
} from "./media.types";
import { validatePublicImage } from "./media.validation";

type UploadOptions = {
  folder: string;
  overwrite: false;
  public_id: string;
  resource_type: "image";
};

type DeleteOptions = {
  invalidate: true;
  resource_type: "image";
};

export type CloudinaryClient = {
  uploader: {
    upload(source: string, options: UploadOptions): Promise<unknown>;
    destroy(publicId: string, options: DeleteOptions): Promise<unknown>;
  };
};

type CloudinaryMediaStorageOptions = {
  client: CloudinaryClient | null;
  folder: string;
  publicIdFactory?: () => string;
};

const uploadResponseSchema = z.object({
  asset_id: z.string().min(1),
  public_id: z.string().min(1),
  version: z.number().int().nonnegative(),
  secure_url: z.url(),
  format: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  bytes: z.number().int().nonnegative(),
  resource_type: z.literal("image"),
});

export class MediaStorageUnavailableError extends Error {
  constructor() {
    super("Media storage is unavailable");
    this.name = "MediaStorageUnavailableError";
  }
}

export class MediaOwnershipError extends Error {
  constructor() {
    super("Media asset is outside the configured clinic folder");
    this.name = "MediaOwnershipError";
  }
}

function mapUploadResponse(response: unknown): StoredMedia {
  const parsed = uploadResponseSchema.parse(response);

  return {
    assetId: parsed.asset_id,
    publicId: parsed.public_id,
    version: parsed.version,
    secureUrl: parsed.secure_url,
    format: parsed.format,
    width: parsed.width,
    height: parsed.height,
    bytes: parsed.bytes,
    resourceType: parsed.resource_type,
  };
}

export function createCloudinaryMediaStorage({
  client,
  folder,
  publicIdFactory = randomUUID,
}: CloudinaryMediaStorageOptions): MediaStorage {
  const normalizedFolder = folder.replace(/\/+$/, "");
  const ownedPublicIdPrefix = `${normalizedFolder}/`;

  return {
    async uploadPublicImage(
      input: UploadPublicImageInput,
    ): Promise<StoredMedia> {
      if (!client) throw new MediaStorageUnavailableError();

      const validated = await validatePublicImage(input);
      const source = `data:${validated.detectedMimeType};base64,${Buffer.from(
        validated.bytes,
      ).toString("base64")}`;

      try {
        const response = await client.uploader.upload(source, {
          folder: normalizedFolder,
          overwrite: false,
          public_id: publicIdFactory(),
          resource_type: "image",
        });

        return mapUploadResponse(response);
      } catch {
        throw new MediaStorageUnavailableError();
      }
    },

    async deletePublicImage(publicId: string): Promise<void> {
      const segments = publicId.split("/");
      if (
        !publicId.startsWith(ownedPublicIdPrefix) ||
        publicId.length === ownedPublicIdPrefix.length ||
        segments.some((segment) => segment === "." || segment === "..")
      ) {
        throw new MediaOwnershipError();
      }

      if (!client) throw new MediaStorageUnavailableError();

      try {
        await client.uploader.destroy(publicId, {
          invalidate: true,
          resource_type: "image",
        });
      } catch {
        throw new MediaStorageUnavailableError();
      }
    },
  };
}
