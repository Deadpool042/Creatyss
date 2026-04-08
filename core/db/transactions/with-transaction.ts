//core/db/transactions/with-transaction.ts
import type { Prisma } from "@/prisma-generated/client";
import { db } from "../client";

export type DbTx = Prisma.TransactionClient;

export async function withTransaction<T>(callback: (tx: DbTx) => Promise<T>): Promise<T> {
  return db.$transaction(async (tx) => {
    return callback(tx);
  });
}
