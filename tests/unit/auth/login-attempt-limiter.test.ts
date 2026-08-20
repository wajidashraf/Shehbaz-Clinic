import { describe, expect, it, vi } from "vitest";
import { LoginAttemptLimiter } from "@/modules/auth/login-attempt-limiter";

describe("LoginAttemptLimiter", () => {
  it("blocks a client only after the configured number of failed logins", () => {
    const limiter = new LoginAttemptLimiter({
      maximumFailures: 2,
      windowMs: 60_000,
    });

    expect(limiter.isBlocked("client-1")).toBe(false);
    limiter.recordFailure("client-1");
    expect(limiter.isBlocked("client-1")).toBe(false);
    limiter.recordFailure("client-1");
    expect(limiter.isBlocked("client-1")).toBe(true);
  });

  it("clears failures after a successful login", () => {
    const limiter = new LoginAttemptLimiter({
      maximumFailures: 1,
      windowMs: 60_000,
    });

    limiter.recordFailure("client-1");
    expect(limiter.isBlocked("client-1")).toBe(true);

    limiter.reset("client-1");
    expect(limiter.isBlocked("client-1")).toBe(false);
  });

  it("expires failures at the end of the rate-limit window", () => {
    vi.useFakeTimers();
    const limiter = new LoginAttemptLimiter({
      maximumFailures: 1,
      windowMs: 60_000,
    });

    limiter.recordFailure("client-1");
    vi.advanceTimersByTime(60_001);

    expect(limiter.isBlocked("client-1")).toBe(false);
    vi.useRealTimers();
  });
});
