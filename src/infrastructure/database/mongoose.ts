import "server-only";

import { getServerEnv } from "@/config/env";
import {
  connectMongoWithOptions,
  DatabaseConnectionError,
} from "./mongoose-core";

export { DatabaseConnectionError };

export async function connectMongo() {
  try {
    const environment = getServerEnv();
    return await connectMongoWithOptions({
      uri: environment.MONGODB_URI,
      database: environment.MONGODB_DATABASE,
    });
  } catch {
    throw new DatabaseConnectionError();
  }
}
