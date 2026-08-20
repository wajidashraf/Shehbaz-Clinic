import { describe, expect, it } from "vitest";
import { getServerEnv, isCloudinaryConfigured } from "@/config/env";

const baseEnvironment = {
  NODE_ENV: "test",
  APP_URL: "http://localhost:3000",
  MONGODB_URI: "mongodb+srv://synthetic:password@example.mongodb.net/",
  MONGODB_DATABASE: "shehbaz_clinic_test",
  SESSION_SECRET: "a".repeat(64),
};

describe("server environment", () => {
  it("accepts required MongoDB and application values", () => {
    expect(getServerEnv(baseEnvironment).MONGODB_DATABASE).toBe(
      "shehbaz_clinic_test",
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
});
