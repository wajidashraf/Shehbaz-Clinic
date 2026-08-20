import { describe, expect, it } from "vitest";
import packageJson from "../../package.json";

describe("project scaffold", () => {
  it("exposes every required quality command", () => {
    expect(packageJson.scripts).toMatchObject({
      build: "next build",
      lint: "eslint .",
      typecheck: "tsc --noEmit",
      test: "vitest run",
      "test:e2e": "npm run build && playwright test",
    });
  });
});
