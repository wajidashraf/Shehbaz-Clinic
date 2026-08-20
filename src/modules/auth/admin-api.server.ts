import "server-only";
import { adminSessionCookieName } from "@/modules/auth/admin-auth";
import { getAdminFromToken } from "@/modules/auth/admin-session.server";

export function requestHasValidOrigin(request: Request) {
  const originHeader = request.headers.get("origin");
  if (!originHeader) return process.env.NODE_ENV !== "production";

  let browserOrigin: string;
  try {
    browserOrigin = new URL(originHeader).origin;
  } catch {
    return false;
  }

  const allowedOrigins = new Set([new URL(request.url).origin]);
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  if (
    forwardedHost &&
    (forwardedProtocol === "https" || forwardedProtocol === "http")
  ) {
    try {
      allowedOrigins.add(
        new URL(`${forwardedProtocol}://${forwardedHost}`).origin,
      );
    } catch {
      return false;
    }
  }

  return allowedOrigins.has(browserOrigin);
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
