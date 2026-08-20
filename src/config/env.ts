import "server-only";

import {
  isCloudinaryConfigured,
  parseServerEnvironment,
  type ServerEnvironment,
} from "@/config/env-schema";

export { isCloudinaryConfigured, type ServerEnvironment };

export function getServerEnv(
  source: Record<string, string | undefined> = process.env,
): ServerEnvironment {
  return parseServerEnvironment(source);
}
