import { readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

describe("clinic favicon", () => {
  it("contains 16, 32, and 48 pixel icon entries", async () => {
    const favicon = await readFile(
      path.join(process.cwd(), "src/app/favicon.ico"),
    );

    expect([...favicon.subarray(0, 4)]).toEqual([0, 0, 1, 0]);
    expect(favicon.readUInt16LE(4)).toBe(3);

    const widths = Array.from(
      { length: 3 },
      (_, index) => favicon[6 + index * 16],
    );
    const heights = Array.from(
      { length: 3 },
      (_, index) => favicon[7 + index * 16],
    );

    expect(widths).toEqual([16, 32, 48]);
    expect(heights).toEqual([16, 32, 48]);
  });
});
