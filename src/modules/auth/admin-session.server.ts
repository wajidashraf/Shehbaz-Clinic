import "server-only";
import { cookies } from "next/headers";
import { connectMongo } from "@/infrastructure/database/mongoose";
import {
  adminSessionCookieName,
  adminSessionLifetimeMs,
  createSessionToken,
  hashSessionToken,
  verifyAdminPassword,
} from "@/modules/auth/admin-auth";
import { AdminSessionModel } from "@/modules/auth/admin-session.model";
import { AdminUserModel } from "@/modules/auth/admin-user.model";

export async function authenticateAdmin(email: string, password: string) {
  await connectMongo();
  const user = await AdminUserModel.findOne({
    email: email.trim().toLowerCase(),
    isActive: true,
  }).select("+passwordHash");

  if (!user || !(await verifyAdminPassword(user.passwordHash, password))) {
    return null;
  }

  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + adminSessionLifetimeMs);
  await AdminSessionModel.create({
    tokenDigest: hashSessionToken(token),
    userId: user._id,
    expiresAt,
  });

  return { token, expiresAt };
}

export async function getAdminFromToken(token?: string) {
  if (!token) return null;
  await connectMongo();
  const session = await AdminSessionModel.findOne({
    tokenDigest: hashSessionToken(token),
    expiresAt: { $gt: new Date() },
  }).lean();
  if (!session) return null;

  return AdminUserModel.findOne({
    _id: session.userId,
    isActive: true,
    role: "admin",
  }).lean();
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  return getAdminFromToken(cookieStore.get(adminSessionCookieName)?.value);
}

export async function revokeAdminSession(token?: string) {
  if (!token) return;
  await connectMongo();
  await AdminSessionModel.deleteOne({ tokenDigest: hashSessionToken(token) });
}
