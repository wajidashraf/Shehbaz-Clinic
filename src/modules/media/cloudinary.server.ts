import "server-only";

import { v2 as cloudinary } from "cloudinary";
import { getServerEnv, isCloudinaryConfigured } from "@/config/env";
import {
  createCloudinaryMediaStorage,
  type CloudinaryClient,
} from "./cloudinary.adapter";

function configureCloudinaryClient(): CloudinaryClient | null {
  const environment = getServerEnv();
  if (!isCloudinaryConfigured(environment)) return null;

  cloudinary.config({
    cloud_name: environment.CLOUDINARY_CLOUD_NAME,
    api_key: environment.CLOUDINARY_API_KEY,
    api_secret: environment.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return {
    uploader: {
      upload: (source, options) => cloudinary.uploader.upload(source, options),
      destroy: (publicId, options) =>
        cloudinary.uploader.destroy(publicId, options),
    },
  };
}

export function getCloudinaryMediaStorage() {
  const environment = getServerEnv();

  return createCloudinaryMediaStorage({
    client: configureCloudinaryClient(),
    folder: environment.CLOUDINARY_FOLDER,
  });
}
