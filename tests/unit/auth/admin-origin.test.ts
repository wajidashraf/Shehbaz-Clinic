import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { requestHasValidOrigin } from "@/modules/auth/admin-api.server";

describe("administrator request origin validation", () => {
  beforeEach(() => {
    vi.stubEnv("APP_URL", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("accepts the configured production origin without proxy headers", () => {
    vi.stubEnv("APP_URL", "https://shahbazdental.com");

    const request = new Request(
      "https://internal-runtime.local/api/v1/appointments",
      {
        method: "POST",
        headers: { origin: "https://shahbazdental.com" },
      },
    );

    expect(requestHasValidOrigin(request)).toBe(true);
  });

  it("fails closed when the configured application URL is malformed", () => {
    vi.stubEnv("APP_URL", "not a valid URL");

    const request = new Request(
      "https://internal-runtime.local/api/v1/appointments",
      {
        method: "POST",
        headers: { origin: "https://shahbazdental.com" },
      },
    );

    expect(requestHasValidOrigin(request)).toBe(false);
  });

  it("rejects an Origin header containing a path", () => {
    vi.stubEnv("APP_URL", "https://shahbazdental.com");

    const request = new Request(
      "https://internal-runtime.local/api/v1/appointments",
      {
        method: "POST",
        headers: { origin: "https://shahbazdental.com/not-an-origin" },
      },
    );

    expect(requestHasValidOrigin(request)).toBe(false);
  });

  it("rejects forged forwarded headers that do not match the configured origin", () => {
    vi.stubEnv("APP_URL", "https://shahbazdental.com");

    const request = new Request(
      "https://internal-runtime.local/api/v1/appointments",
      {
        method: "POST",
        headers: {
          origin: "https://malicious.example",
          "x-forwarded-host": "malicious.example",
          "x-forwarded-proto": "https",
        },
      },
    );

    expect(requestHasValidOrigin(request)).toBe(false);
  });

  it("accepts the browser origin forwarded by Netlify", () => {
    vi.stubEnv("APP_URL", "https://shahbaz-clinic.netlify.app");

    const request = new Request(
      "https://internal-runtime.local/api/v1/admin/session",
      {
        method: "POST",
        headers: {
          origin: "https://shahbaz-clinic.netlify.app",
          "x-forwarded-host": "shahbaz-clinic.netlify.app",
          "x-forwarded-proto": "https",
        },
      },
    );

    expect(requestHasValidOrigin(request)).toBe(true);
  });

  it("rejects a cross-site origin even when forwarded headers are present", () => {
    const request = new Request(
      "https://internal-runtime.local/api/v1/admin/session",
      {
        method: "POST",
        headers: {
          origin: "https://malicious.example",
          "x-forwarded-host": "shahbaz-clinic.netlify.app",
          "x-forwarded-proto": "https",
        },
      },
    );

    expect(requestHasValidOrigin(request)).toBe(false);
  });
});
