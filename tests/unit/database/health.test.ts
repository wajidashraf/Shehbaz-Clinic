import { describe, expect, it } from "vitest";
import { createMongoHealthCheck } from "@/infrastructure/database/health";

describe("MongoDB health check", () => {
  it("reports up after a successful connection", async () => {
    const checkHealth = createMongoHealthCheck(async () => undefined);

    await expect(checkHealth()).resolves.toEqual({ status: "up" });
  });

  it("reports down without returning connection errors", async () => {
    const checkHealth = createMongoHealthCheck(async () => {
      throw new Error(
        "mongodb+srv://private-user:private-password@private.mongodb.net",
      );
    });

    const result = await checkHealth();

    expect(result).toEqual({ status: "down" });
    expect(JSON.stringify(result)).not.toContain("private-password");
    expect(JSON.stringify(result)).not.toContain("mongodb+srv");
  });
});
