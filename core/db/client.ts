//core/db/client.ts
import { PrismaClient } from "@prisma-generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { serverEnv } from "@core/config/env";

declare global {
  var __db__: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: serverEnv.databaseUrl,
  });

  return new PrismaClient({
    adapter,
  });
}

export const db: PrismaClient = global.__db__ ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__db__ = db;
}
