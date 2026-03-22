import type { PrismaClient } from "@prisma/client";

export type BlogTxClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;
