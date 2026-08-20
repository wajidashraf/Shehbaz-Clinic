import { describe, expect, it } from "vitest";
import {
  createSessionToken,
  hashAdminPassword,
  hashSessionToken,
  verifyAdminPassword,
} from "@/modules/auth/admin-auth";

describe("admin authentication primitives", () => {
  it("stores an Argon2id hash rather than the administrator password", async () => {
    const hash = await hashAdminPassword("correct-horse-battery-staple");

    expect(hash).toMatch(/^\$argon2id\$/);
    expect(hash).not.toContain("correct-horse-battery-staple");
    await expect(
      verifyAdminPassword(hash, "correct-horse-battery-staple"),
    ).resolves.toBe(true);
    await expect(verifyAdminPassword(hash, "wrong-password")).resolves.toBe(
      false,
    );
  });

  it("returns a random cookie token whose digest can be stored", () => {
    const first = createSessionToken();
    const second = createSessionToken();

    expect(first).not.toBe(second);
    expect(hashSessionToken(first)).toHaveLength(64);
    expect(hashSessionToken(first)).not.toBe(first);
  });
});
