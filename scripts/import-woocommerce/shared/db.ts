import type { Prisma, PrismaClient } from "../../../src/generated/prisma/client";

export type DbClient = PrismaClient | Prisma.TransactionClient;
