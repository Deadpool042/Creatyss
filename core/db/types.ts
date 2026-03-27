// core/db/types.ts
import type { PrismaClient } from "@prisma-generated/client";
import type { DbTx } from "./transactions/with-transaction";

export type DbExecutor = PrismaClient | DbTx;
