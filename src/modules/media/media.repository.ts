import "server-only";

import { connectMongo } from "@/infrastructure/database/mongoose";
import { MediaAssetModel } from "./media-asset.model";
import type { MediaAssetRecord, SaveMediaAssetInput } from "./media.types";

type StoredDocument = SaveMediaAssetInput & {
  createdAt: Date;
  updatedAt: Date;
};

type MediaAssetModelLike = {
  create(input: SaveMediaAssetInput): Promise<StoredDocument>;
};

type MediaRepositoryDependencies = {
  connect: () => Promise<unknown>;
  model: MediaAssetModelLike;
};

function persistenceFields(asset: SaveMediaAssetInput): SaveMediaAssetInput {
  return {
    assetId: asset.assetId,
    publicId: asset.publicId,
    version: asset.version,
    secureUrl: asset.secureUrl,
    format: asset.format,
    width: asset.width,
    height: asset.height,
    bytes: asset.bytes,
    resourceType: asset.resourceType,
    purpose: asset.purpose,
    altText: { ...asset.altText },
    actorUserId: asset.actorUserId,
  };
}

function toRecord(document: StoredDocument): MediaAssetRecord {
  return {
    ...persistenceFields(document),
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

export function createMediaRepository({
  connect,
  model,
}: MediaRepositoryDependencies) {
  return {
    async saveMediaAsset(
      asset: SaveMediaAssetInput,
    ): Promise<MediaAssetRecord> {
      await connect();
      const document = await model.create(persistenceFields(asset));
      return toRecord(document);
    },
  };
}

const repository = createMediaRepository({
  connect: connectMongo,
  model: {
    create: async (input) => {
      const document = await MediaAssetModel.create(input);
      return document.toObject() as StoredDocument;
    },
  },
});

export const saveMediaAsset = repository.saveMediaAsset;
