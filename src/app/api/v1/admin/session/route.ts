import { NextResponse } from "next/server";
import { z } from "zod";
import {
  adminSessionCookieName,
  adminSessionLifetimeMs,
} from "@/modules/auth/admin-auth";
import {
  authenticateAdmin,
  revokeAdminSession,
} from "@/modules/auth/admin-session.server";
import { requestHasValidOrigin } from "@/modules/auth/admin-api.server";
import { LoginAttemptLimiter } from "@/modules/auth/login-attempt-limiter";

const loginSchema = z.object({ email: z.email(), password: z.string().min(1) });
const loginLimiter = new LoginAttemptLimiter({
  maximumFailures: 10,
  windowMs: 15 * 60 * 1000,
});

function requestClientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local"
  );
}

export async function POST(request: Request) {
  if (!requestHasValidOrigin(request))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const clientKey = requestClientKey(request);
  if (loginLimiter.isBlocked(clientKey))
    return NextResponse.json({ error: "too-many-attempts" }, { status: 429 });

  const input = loginSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) {
    loginLimiter.recordFailure(clientKey);
    return NextResponse.json({ error: "invalid-credentials" }, { status: 401 });
  }

  try {
    const session = await authenticateAdmin(
      input.data.email,
      input.data.password,
    );
    if (!session) {
      loginLimiter.recordFailure(clientKey);
      return NextResponse.json(
        { error: "invalid-credentials" },
        { status: 401 },
      );
    }
    loginLimiter.reset(clientKey);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(adminSessionCookieName, session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.floor(adminSessionLifetimeMs / 1000),
    });
    return response;
  } catch {
    return NextResponse.json({ error: "service-unavailable" }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  if (!requestHasValidOrigin(request))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const token = request.headers
    .get("cookie")
    ?.match(new RegExp(`(?:^|; )${adminSessionCookieName}=([^;]+)`))?.[1];
  await revokeAdminSession(token ? decodeURIComponent(token) : undefined);
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(adminSessionCookieName);
  return response;
}
