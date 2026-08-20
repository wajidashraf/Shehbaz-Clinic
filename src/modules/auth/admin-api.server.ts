import "server-only";
import { adminSessionCookieName } from "@/modules/auth/admin-auth";
import { getAdminFromToken } from "@/modules/auth/admin-session.server";

export function requestHasValidOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  return origin === new URL(request.url).origin;
}

export async function requireAdminRequest(request: Request) {
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${adminSessionCookieName}=`));
  const token = cookie
    ? decodeURIComponent(cookie.slice(adminSessionCookieName.length + 1))
    : undefined;
  return getAdminFromToken(token);
}
