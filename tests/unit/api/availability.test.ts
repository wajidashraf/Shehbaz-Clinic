import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/v1/availability/route";

describe("public availability API", () => {
  it("rejects a malformed dentist id before accessing the database", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/v1/availability?dentistId=unknown%20dentist!&dateKey=2026-09-01",
      ),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "invalid-request",
    });
  });
});
