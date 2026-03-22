import type { PrismaClient } from "@prisma/client";

export type ProductTxClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;
