import { spawnSync } from "node:child_process";
import path from "node:path";

const buildEnvironment = { ...process.env };

// Next.js selects the correct value for `next build`. Removing a dashboard
// override prevents React and Next.js from loading different runtime branches.
delete buildEnvironment.NODE_ENV;

const nextCli = path.join(
  process.cwd(),
  "node_modules",
  "next",
  "dist",
  "bin",
  "next",
);

const result = spawnSync(process.execPath, [nextCli, "build"], {
  cwd: process.cwd(),
  env: buildEnvironment,
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
