import type { PrismaClient } from "@prisma/client";

export type MediaTxClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;
