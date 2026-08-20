import { getServerEnv, isCloudinaryConfigured } from "@/config/env";
import {
  checkMongoHealth,
  type DatabaseHealth,
} from "@/infrastructure/database/health";

type HealthDependencies = {
  checkMongoHealth: () => Promise<DatabaseHealth>;
  cloudinaryConfigured: () => boolean;
};

export function createHealthHandler(dependencies: HealthDependencies) {
  return async function GET(): Promise<Response> {
    const database = await dependencies.checkMongoHealth();
    const status = database.status === "up" ? "ok" : "degraded";
    let cloudinaryConfigured = false;

    try {
      cloudinaryConfigured = dependencies.cloudinaryConfigured();
    } catch {
      cloudinaryConfigured = false;
    }

    return Response.json(
      {
        status,
        services: {
          mongodb: database.status,
          cloudinary: cloudinaryConfigured ? "configured" : "not-configured",
        },
      },
      {
        status: database.status === "up" ? 200 : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  };
}

export const GET = createHealthHandler({
  checkMongoHealth,
  cloudinaryConfigured: () => isCloudinaryConfigured(getServerEnv()),
});
