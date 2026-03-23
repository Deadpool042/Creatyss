// db/types.ts
import type { PrismaClient } from "@/src/generated/prisma/client";
import type { DbTx } from "./transaction";

export type DbExecutor = PrismaClient | DbTx;
