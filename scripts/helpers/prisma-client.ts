import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

function readDatabaseUrl(): string {
  const value = process.env.DATABASE_URL;

  if (!value || value.trim().length === 0) {
    return "postgresql://creatyss:creatyss@db:5432/creatyss";
  }

  return value.trim();
}

export function createScriptPrismaClient() {
  const adapter = new PrismaPg({ connectionString: readDatabaseUrl() });
  return new PrismaClient({ adapter });
}
