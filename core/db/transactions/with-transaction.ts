//core/db/transactions/with-transaction.ts
import { db } from "@/core/db";
import type { Prisma } from "@prisma-generated/client";

export type DbTx = Prisma.TransactionClient;

export async function withTransaction<T>(callback: (tx: DbTx) => Promise<T>): Promise<T> {
  return db.$transaction(async (tx) => {
    return callback(tx);
  });
}
