import { describe, expect, it } from "vitest";
import { requestHasValidOrigin } from "@/modules/auth/admin-api.server";

describe("administrator request origin validation", () => {
  it("accepts the browser origin forwarded by Netlify", () => {
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
