import { prisma } from "@/db/prisma-client";
import { emailMessageSelect, type EmailMessageRow } from "@db-email/types/rows";

export async function listEmailMessageRowsByStoreId(storeId: string): Promise<EmailMessageRow[]> {
  return prisma.emailMessage.findMany({
    where: {
      storeId,
    },
    orderBy: [{ createdAt: "desc" }],
    select: emailMessageSelect,
  });
}

export async function findEmailMessageRowById(id: string): Promise<EmailMessageRow | null> {
  return prisma.emailMessage.findUnique({
    where: {
      id,
    },
    select: emailMessageSelect,
  });
}
