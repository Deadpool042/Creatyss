// import nextEnv from "@next/env";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "../../src/generated/prisma/client";

// const { loadEnvConfig } = nextEnv;
// loadEnvConfig(process.cwd());

// function readDatabaseUrl(): string {
//   const value = process.env.DATABASE_URL;

//   if (!value || value.trim().length === 0) {
//     throw new Error("Missing DATABASE_URL");
//   }

//   return value.trim();
// }

// export function createScriptPrismaClient(): PrismaClient {
//   const adapter = new PrismaPg({
//     connectionString: readDatabaseUrl(),
//   });

//   return new PrismaClient({ adapter });
// }
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";

function readDatabaseUrl(): string {
  const value = process.env.DATABASE_URL;

  if (!value || value.trim().length === 0) {
    throw new Error("Missing DATABASE_URL");
  }

  return value.trim();
}

export function createScriptPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: readDatabaseUrl(),
  });

  return new PrismaClient({ adapter });
}
