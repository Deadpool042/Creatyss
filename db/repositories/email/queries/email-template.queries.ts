import { prisma } from "@/db/prisma-client";
import { emailTemplateListSelect, emailTemplateDetailSelect } from "../types/rows";

export async function listEmailTemplateRows() {
  return prisma.emailTemplate.findMany({
    orderBy: [{ type: "asc" }, { updatedAt: "desc" }],
    select: emailTemplateListSelect,
  });
}

export async function findEmailTemplateRowById(id: string) {
  return prisma.emailTemplate.findUnique({
    where: { id },
    select: emailTemplateDetailSelect,
  });
}

export async function findEmailTemplateRowByKey(key: string) {
  return prisma.emailTemplate.findFirst({
    where: { key },
    select: emailTemplateDetailSelect,
  });
}
