import type { PrismaClient } from "@prisma/client";

export type CartTxClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;
