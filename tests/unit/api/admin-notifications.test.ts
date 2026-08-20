import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/v1/admin/notifications/[id]/retry/route";

describe("admin notification retry API", () => {
  it("rejects a retry request without an administrator session", async () => {
    const request = new Request(
      "http://localhost/api/v1/admin/notifications/job-1/retry",
      { method: "POST" },
    );

    const response = await POST(request, {
      params: Promise.resolve({ id: "job-1" }),
    });

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "unauthorized" });
  });
});
