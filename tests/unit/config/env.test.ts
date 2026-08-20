import { describe, expect, it } from "vitest";
import { getServerEnv, isCloudinaryConfigured } from "@/config/env";
import {
  parseAdminSeedEnvironment,
  parseMongoEnvironment,
} from "@/config/env-schema";

const baseEnvironment = {
  NODE_ENV: "test",
  APP_URL: "http://localhost:3000",
  MONGODB_URI: "mongodb+srv://synthetic:password@example.mongodb.net/",
  MONGODB_DATABASE: "shahbaz_clinic_test",
  SESSION_SECRET: "a".repeat(64),
};

describe("server environment", () => {
  it("accepts required MongoDB and application values", () => {
    expect(getServerEnv(baseEnvironment).MONGODB_DATABASE).toBe(
      "shahbaz_clinic_test",
    );
  });

  it("rejects a partial Cloudinary credential set", () => {
    expect(() =>
      getServerEnv({
        ...baseEnvironment,
        CLOUDINARY_CLOUD_NAME: "clinic",
      }),
    ).toThrow(/Cloudinary credentials must be provided together/);
  });

  it("reports Cloudinary as configured only with all credentials", () => {
    const environment = getServerEnv({
      ...baseEnvironment,
      CLOUDINARY_CLOUD_NAME: "clinic",
      CLOUDINARY_API_KEY: "123456789",
      CLOUDINARY_API_SECRET: "synthetic-secret",
    });

    expect(isCloudinaryConfigured(environment)).toBe(true);
  });

  it("treats blank optional credentials as absent", () => {
    const environment = getServerEnv({
      ...baseEnvironment,
      CLOUDINARY_CLOUD_NAME: "",
      CLOUDINARY_API_KEY: "",
      CLOUDINARY_API_SECRET: "",
      REDIS_URL: "",
    });

    expect(isCloudinaryConfigured(environment)).toBe(false);
    expect(environment.REDIS_URL).toBeUndefined();
  });

  it("accepts a complete Brevo transactional email configuration", () => {
    const environment = getServerEnv({
      ...baseEnvironment,
      EMAIL_PROVIDER: "brevo",
      BREVO_API_KEY: "xkeysib-synthetic-key",
      EMAIL_FROM_NAME: "Shahbaz Dental Clinic",
      EMAIL_FROM_ADDRESS: "clinic@example.com",
      SMS_PROVIDER: "development",
    });

    expect(environment.EMAIL_PROVIDER).toBe("brevo");
    expect(environment.EMAIL_FROM_ADDRESS).toBe("clinic@example.com");
    expect(environment.SMS_PROVIDER).toBe("development");
  });

  it("allows a prefilled sender name while email remains in development mode", () => {
    expect(
      getServerEnv({
        ...baseEnvironment,
        EMAIL_PROVIDER: "development",
        EMAIL_FROM_NAME: "Shahbaz Dental Clinic",
      }).EMAIL_FROM_NAME,
    ).toBe("Shahbaz Dental Clinic");
  });

  it("rejects Brevo when any required email setting is missing", () => {
    expect(() =>
      getServerEnv({
        ...baseEnvironment,
        EMAIL_PROVIDER: "brevo",
        BREVO_API_KEY: "xkeysib-synthetic-key",
        EMAIL_FROM_NAME: "Shahbaz Dental Clinic",
      }),
    ).toThrow(/Brevo email settings must be provided together/);
  });

  it("accepts only Redis protocol connection strings", () => {
    expect(
      getServerEnv({
        ...baseEnvironment,
        REDIS_URL: "rediss://default:password@example.upstash.io:6379",
      }).REDIS_URL,
    ).toMatch(/^rediss:/);

    expect(() =>
      getServerEnv({ ...baseEnvironment, REDIS_URL: "https://example.com" }),
    ).toThrow();
    expect(() =>
      getServerEnv({
        ...baseEnvironment,
        REDIS_URL: "redis://example.com:6379",
      }),
    ).toThrow();
    expect(() =>
      getServerEnv({ ...baseEnvironment, REDIS_URL: "rediss://" }),
    ).toThrow();
  });

  it("rejects malformed Cloudinary folder paths", () => {
    expect(() =>
      getServerEnv({ ...baseEnvironment, CLOUDINARY_FOLDER: "/" }),
    ).toThrow();
  });

  it("rejects unsafe database names", () => {
    expect(() =>
      getServerEnv({
        ...baseEnvironment,
        MONGODB_DATABASE: "clinic database",
      }),
    ).toThrow();
  });

  it("defaults to development outside the Next.js runtime", () => {
    const withoutNodeEnvironment: Record<string, string> = {
      ...baseEnvironment,
    };
    delete withoutNodeEnvironment.NODE_ENV;

    expect(getServerEnv(withoutNodeEnvironment).NODE_ENV).toBe("development");
  });

  it("validates seed database settings without unrelated secrets", () => {
    expect(
      parseMongoEnvironment({
        MONGODB_URI: baseEnvironment.MONGODB_URI,
        MONGODB_DATABASE: baseEnvironment.MONGODB_DATABASE,
      }),
    ).toEqual({
      MONGODB_URI: baseEnvironment.MONGODB_URI,
      MONGODB_DATABASE: "shahbaz_clinic_test",
    });
  });

  it("requires valid one-time administrator seed credentials", () => {
    expect(
      parseAdminSeedEnvironment({
        ADMIN_EMAIL: "admin@example.com",
        ADMIN_PASSWORD: "secure-password",
      }),
    ).toEqual({
      ADMIN_EMAIL: "admin@example.com",
      ADMIN_PASSWORD: "secure-password",
    });
    expect(() =>
      parseAdminSeedEnvironment({
        ADMIN_EMAIL: "not-an-email",
        ADMIN_PASSWORD: "short",
      }),
    ).toThrow();
  });
});
