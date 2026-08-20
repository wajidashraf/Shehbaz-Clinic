import { createHash, randomBytes } from "node:crypto";
import argon2 from "argon2";

export const adminSessionCookieName = "shahbaz_admin_session";
export const adminSessionLifetimeMs = 12 * 60 * 60 * 1000;

export async function hashAdminPassword(password: string) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19_456,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function verifyAdminPassword(hash: string, password: string) {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

export function createSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
