import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadProjectEnvironment } from "../../../scripts/load-project-environment";

const variableName = "CLINIC_ENV_LOADER_TEST_VALUE";
let temporaryDirectory: string | undefined;

afterEach(async () => {
  delete process.env[variableName];
  if (temporaryDirectory) {
    await rm(temporaryDirectory, { force: true, recursive: true });
    temporaryDirectory = undefined;
  }
});

describe("project environment loader", () => {
  it("loads test environment files through the seed runtime", async () => {
    temporaryDirectory = await mkdtemp(path.join(tmpdir(), "clinic-env-"));
    await writeFile(
      path.join(temporaryDirectory, ".env.test"),
      `${variableName}=loaded\n`,
      "utf8",
    );

    loadProjectEnvironment(temporaryDirectory);

    expect(process.env[variableName]).toBe("loaded");
  });
});
