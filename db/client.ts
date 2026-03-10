import { Pool } from "pg";
import { env } from "@/lib/env";

declare global {
  var __creatyssPool__: Pool | undefined;
}

function createPool() {
  return new Pool({
    connectionString: env.databaseUrl
  });
}

export const db = globalThis.__creatyssPool__ ?? createPool();

if (env.nodeEnv !== "production") {
  globalThis.__creatyssPool__ = db;
}
