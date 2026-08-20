import "server-only";

import { z } from "zod";

const optionalCredential = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const serverEnvironmentSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]),
    APP_URL: z.url(),
    MONGODB_URI: z.string().min(1),
    MONGODB_DATABASE: z.string().regex(/^[a-zA-Z0-9_-]+$/),
    SESSION_SECRET: z.string().min(32),
    CLOUDINARY_CLOUD_NAME: optionalCredential,
    CLOUDINARY_API_KEY: optionalCredential,
    CLOUDINARY_API_SECRET: optionalCredential,
    CLOUDINARY_FOLDER: z
      .string()
      .min(1)
      .default("shehbaz-dental-clinic/development"),
    REDIS_URL: optionalCredential,
    NOTIFICATION_TRANSPORT: z
      .enum(["development", "provider"])
      .default("development"),
  })
  .superRefine((environment, context) => {
    const cloudinaryCredentials = [
      environment.CLOUDINARY_CLOUD_NAME,
      environment.CLOUDINARY_API_KEY,
      environment.CLOUDINARY_API_SECRET,
    ];

    if (
      cloudinaryCredentials.some(Boolean) &&
      !cloudinaryCredentials.every(Boolean)
    ) {
      context.addIssue({
        code: "custom",
        message: "Cloudinary credentials must be provided together",
      });
    }
  });

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

export function getServerEnv(
  source: Record<string, string | undefined> = process.env,
): ServerEnvironment {
  return serverEnvironmentSchema.parse(source);
}

export function isCloudinaryConfigured(
  environment: ServerEnvironment,
): boolean {
  return Boolean(
    environment.CLOUDINARY_CLOUD_NAME &&
      environment.CLOUDINARY_API_KEY &&
      environment.CLOUDINARY_API_SECRET,
  );
}
