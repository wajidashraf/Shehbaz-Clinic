import "server-only";

import mongoose from "mongoose";

export type MongoConnectionOptions = {
  uri: string;
  database: string;
};

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var clinicMongooseCache: MongooseCache | undefined;
}

const cache = globalThis.clinicMongooseCache ?? {
  connection: null,
  promise: null,
};

globalThis.clinicMongooseCache = cache;

export class DatabaseConnectionError extends Error {
  constructor() {
    super("Database connection is unavailable");
    this.name = "DatabaseConnectionError";
  }
}

export async function connectMongoWithOptions({
  uri,
  database,
}: MongoConnectionOptions): Promise<typeof mongoose> {
  if (cache.connection?.connection.readyState === 1) {
    return cache.connection;
  }

  if (cache.connection) {
    cache.connection = null;
    cache.promise = null;
  }

  cache.promise ??= mongoose.connect(uri, {
    dbName: database,
    serverSelectionTimeoutMS: 5_000,
  });

  try {
    cache.connection = await cache.promise;
    return cache.connection;
  } catch {
    cache.promise = null;
    throw new DatabaseConnectionError();
  }
}
