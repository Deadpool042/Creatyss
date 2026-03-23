import { prisma } from "@/db/prisma-client";
import { templateVariantSelect, type TemplateVariantRow } from "@db-template-system/types/rows";

export async function listTemplateVariantRowsByDefinitionId(
  templateDefinitionId: string
): Promise<TemplateVariantRow[]> {
  return prisma.templateVariant.findMany({
    where: {
      templateDefinitionId,
    },
    orderBy: [{ isDefault: "desc" }, { locale: "asc" }, { channel: "asc" }, { createdAt: "asc" }],
    select: templateVariantSelect,
  });
}

export async function findTemplateVariantRowById(
  id: string
): Promise<TemplateVariantRow | null> {
  return prisma.templateVariant.findUnique({
    where: {
      id,
    },
    select: templateVariantSelect,
  });
}
