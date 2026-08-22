export const mediaPurposes = [
  "clinic-logo",
  "clinic-photo",
  "service-image",
  "dentist-portrait",
  "testimonial-image",
] as const;

export type MediaPurpose = (typeof mediaPurposes)[number];

export type UploadPublicImageInput = {
  bytes: Uint8Array;
  declaredMimeType: string;
  purpose: MediaPurpose;
  altText: { en: string; ur?: string };
  actorUserId: string;
};

export type ValidatedPublicImage = Readonly<
  UploadPublicImageInput & {
    detectedMimeType: "image/jpeg" | "image/png" | "image/webp";
    width: number;
    height: number;
  }
>;

export type StoredMedia = {
  assetId: string;
  publicId: string;
  version: number;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resourceType: "image";
};

export interface MediaStorage {
  uploadPublicImage(input: UploadPublicImageInput): Promise<StoredMedia>;
  deletePublicImage(publicId: string): Promise<void>;
}

export type SaveMediaAssetInput = StoredMedia & {
  purpose: MediaPurpose;
  altText: { en: string; ur?: string };
  actorUserId: string;
};

export type MediaAssetRecord = SaveMediaAssetInput & {
  createdAt: Date;
  updatedAt: Date;
};
