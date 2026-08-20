import "server-only";

import {
  connectMongo,
  DatabaseConnectionError,
} from "@/infrastructure/database/mongoose";

export type DatabaseHealth = {
  status: "up" | "down";
};

export function createMongoHealthCheck(
  connect: () => Promise<unknown>,
): () => Promise<DatabaseHealth> {
  return async () => {
    try {
      await connect();
      return { status: "up" };
    } catch {
      return { status: "down" };
    }
  };
}

async function probeMongoConnection(): Promise<void> {
  const database = await connectMongo();
  const connection = database.connection.db;
  if (!connection) throw new DatabaseConnectionError();
  await connection.admin().ping();
}

export const checkMongoHealth = createMongoHealthCheck(probeMongoConnection);
