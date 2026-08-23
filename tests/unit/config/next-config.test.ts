import { describe, expect, it } from "vitest";

import nextConfig from "../../../next.config";

describe("Next.js development experience", () => {
  it("hides the floating development indicator", () => {
    expect(nextConfig.devIndicators).toBe(false);
  });

  it("does not enable a static export because booking requires server routes", () => {
    expect(nextConfig.output).not.toBe("export");
  });
});
