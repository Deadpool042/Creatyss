// db/prisma-client.ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/src/generated/prisma/client";
import { env } from "../lib/env";

declare global {
  var __creatyssPrisma__: PrismaClient | undefined;
}

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: env.databaseUrl });
  return new PrismaClient({ adapter });
}

export const prisma = globalThis.__creatyssPrisma__ ?? createPrismaClient();

if (env.nodeEnv !== "production") {
  globalThis.__creatyssPrisma__ = prisma;
}
