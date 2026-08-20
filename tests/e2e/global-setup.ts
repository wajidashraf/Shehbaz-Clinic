import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { once } from "node:events";

const testPort = "3100";
const serverUrl = `http://127.0.0.1:${testPort}/en`;

async function serverIsReady(): Promise<boolean> {
  try {
    const response = await fetch(serverUrl, {
      signal: AbortSignal.timeout(1_000),
    });
    return response.status < 500;
  } catch {
    return false;
  }
}

async function waitForServer(server: ChildProcess): Promise<void> {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(
        "The Playwright application server exited during startup",
      );
    }

    if (await serverIsReady()) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error("The Playwright application server did not become ready");
}

async function stopServer(server: ChildProcess): Promise<void> {
  if (!server.pid || server.exitCode !== null) return;

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
    return;
  }

  server.kill("SIGTERM");
  await Promise.race([
    once(server, "exit"),
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]);
  if (server.exitCode === null) server.kill("SIGKILL");
}

export default async function globalSetup() {
  if (await serverIsReady()) {
    throw new Error(
      `Playwright's dedicated port ${testPort} is already in use. Stop the stale test server and retry.`,
    );
  }

  const server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      testPort,
    ],
    {
      cwd: process.cwd(),
      env: { ...process.env, PLAYWRIGHT_TEST: "1" },
      stdio: "ignore",
      windowsHide: true,
    },
  );

  try {
    await waitForServer(server);
  } catch (error) {
    await stopServer(server);
    throw error;
  }

  return async () => stopServer(server);
}
