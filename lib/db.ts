import { PrismaClient } from "@prisma/client";

declare global {
  var __db__: PrismaClient | undefined;
}

export const db =
  global.__db__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__db__ = db;
}
