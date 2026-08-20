// @vitest-environment node

import { describe, expect, it } from "vitest";
import { createHealthHandler } from "@/app/api/v1/health/route";

describe("GET /api/v1/health", () => {
  it("returns only sanitized readiness information", async () => {
    const GET = createHealthHandler({
      checkMongoHealth: async () => ({ status: "up" }),
      cloudinaryConfigured: () => true,
    });

    const response = await GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({
      status: "ok",
      services: {
        mongodb: "up",
        cloudinary: "configured",
      },
    });
  });

  it("returns 503 without leaking a database failure", async () => {
    const privateFailure =
      "mongodb+srv://private-user:private-password@private.mongodb.net api_secret";
    const GET = createHealthHandler({
      checkMongoHealth: async () => {
        void privateFailure;
        return { status: "down" };
      },
      cloudinaryConfigured: () => false,
    });

    const response = await GET();
    const serialized = JSON.stringify(await response.json());

    expect(response.status).toBe(503);
    expect(serialized).toBe(
      JSON.stringify({
        status: "degraded",
        services: {
          mongodb: "down",
          cloudinary: "not-configured",
        },
      }),
    );
    expect(serialized).not.toContain("mongodb+srv");
    expect(serialized).not.toContain("private-password");
    expect(serialized).not.toContain("api_secret");
    expect(serialized).not.toContain("private.mongodb.net");
  });

  it("treats invalid provider configuration as not configured", async () => {
    const GET = createHealthHandler({
      checkMongoHealth: async () => ({ status: "up" }),
      cloudinaryConfigured: () => {
        throw new Error("CLOUDINARY_API_SECRET=private-provider-secret");
      },
    });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.services.cloudinary).toBe("not-configured");
    expect(JSON.stringify(body)).not.toContain("private-provider-secret");
  });
});
