import nextEnvironment from "@next/env";

export function loadProjectEnvironment(projectDirectory: string): void {
  nextEnvironment.loadEnvConfig(projectDirectory);
}
