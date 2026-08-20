import { z } from "zod";

const optionalCredential = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const optionalEmailAddress = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.email().optional(),
);

const optionalRedisUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z
    .string()
    .refine((value) => {
      try {
        const url = new URL(value);
        return url.protocol === "rediss:" && Boolean(url.hostname);
      } catch {
        return false;
      }
    })
    .optional(),
);

const mongoEnvironmentSchema = z.object({
  MONGODB_URI: z.string().min(1),
  MONGODB_DATABASE: z.string().regex(/^[a-zA-Z0-9_-]+$/),
});

const adminSeedEnvironmentSchema = z.object({
  ADMIN_EMAIL: z.email(),
  ADMIN_PASSWORD: z.string().min(8).max(200),
});

const serverEnvironmentSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    APP_URL: z.url(),
    ...mongoEnvironmentSchema.shape,
    SESSION_SECRET: z.string().min(32),
    CLOUDINARY_CLOUD_NAME: optionalCredential,
    CLOUDINARY_API_KEY: optionalCredential,
    CLOUDINARY_API_SECRET: optionalCredential,
    CLOUDINARY_FOLDER: z
      .string()
      .regex(/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/)
      .default("shahbaz-dental-clinic/development"),
    REDIS_URL: optionalRedisUrl,
    EMAIL_PROVIDER: z.enum(["development", "brevo"]).default("development"),
    BREVO_API_KEY: optionalCredential,
    EMAIL_FROM_NAME: optionalCredential,
    EMAIL_FROM_ADDRESS: optionalEmailAddress,
    SMS_PROVIDER: z.literal("development").default("development"),
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

    const brevoSettings = [
      environment.BREVO_API_KEY,
      environment.EMAIL_FROM_NAME,
      environment.EMAIL_FROM_ADDRESS,
    ];

    if (
      environment.EMAIL_PROVIDER === "brevo" &&
      !brevoSettings.every(Boolean)
    ) {
      context.addIssue({
        code: "custom",
        message: "Brevo email settings must be provided together",
      });
    }
  });

export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;
export type MongoEnvironment = z.infer<typeof mongoEnvironmentSchema>;
export type AdminSeedEnvironment = z.infer<typeof adminSeedEnvironmentSchema>;

export function parseMongoEnvironment(
  source: Record<string, string | undefined>,
): MongoEnvironment {
  return mongoEnvironmentSchema.parse(source);
}

export function parseAdminSeedEnvironment(
  source: Record<string, string | undefined>,
): AdminSeedEnvironment {
  return adminSeedEnvironmentSchema.parse(source);
}

export function parseServerEnvironment(
  source: Record<string, string | undefined>,
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
