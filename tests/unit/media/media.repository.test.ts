// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { createMediaRepository } from "@/modules/media/media.repository";
import type { SaveMediaAssetInput } from "@/modules/media/media.types";

const createdAt = new Date("2026-08-20T08:00:00.000Z");
const updatedAt = new Date("2026-08-20T08:00:01.000Z");

const asset: SaveMediaAssetInput = {
  assetId: "asset-1",
  publicId: "shahbaz/development/generated-id",
  version: 7,
  secureUrl: "https://res.cloudinary.com/demo/image/upload/example.png",
  format: "png",
  width: 1,
  height: 1,
  bytes: 68,
  resourceType: "image",
  purpose: "clinic-logo",
  altText: { en: "Shahbaz Dental Clinic logo" },
  actorUserId: "user-1",
};

describe("media repository", () => {
  it("stores only provider metadata and returns a public record", async () => {
    const connect = vi.fn().mockResolvedValue(undefined);
    const create = vi.fn().mockResolvedValue({
      ...asset,
      createdAt,
      updatedAt,
      originalBytes: Uint8Array.from([1, 2, 3]),
    });
    const repository = createMediaRepository({ connect, model: { create } });

    const result = await repository.saveMediaAsset({
      ...asset,
      originalBytes: Uint8Array.from([1, 2, 3]),
    } as SaveMediaAssetInput);

    expect(connect).toHaveBeenCalledOnce();
    expect(create).toHaveBeenCalledWith(asset);
    expect(result).toEqual({ ...asset, createdAt, updatedAt });
    expect(result).not.toHaveProperty("originalBytes");
  });
});
