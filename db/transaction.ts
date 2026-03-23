// db/transaction.ts
import { type Prisma } from "@/src/generated/prisma/client";
import { prisma } from "./prisma-client";

export type DbTx = Prisma.TransactionClient;
export type TransactionIsolationLevel = Prisma.TransactionIsolationLevel;

export type TxOptions = {
  isolationLevel?: TransactionIsolationLevel;
  timeoutMs?: number;
  maxWaitMs?: number;
};

export async function withTransaction<T>(
  fn: (tx: DbTx) => Promise<T>,
  options: TxOptions = {}
): Promise<T> {
  const txOptions: {
    isolationLevel?: TransactionIsolationLevel;
    timeout?: number;
    maxWait?: number;
  } = {};

  if (options.isolationLevel !== undefined) {
    txOptions.isolationLevel = options.isolationLevel;
  }

  if (options.timeoutMs !== undefined) {
    txOptions.timeout = options.timeoutMs;
  }

  if (options.maxWaitMs !== undefined) {
    txOptions.maxWait = options.maxWaitMs;
  }

  return prisma.$transaction(async (tx: DbTx) => fn(tx), txOptions);
}
