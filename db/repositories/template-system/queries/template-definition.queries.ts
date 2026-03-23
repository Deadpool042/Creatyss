import { prisma } from "@/db/prisma-client";
import {
  templateDefinitionSelect,
  type TemplateDefinitionRow,
} from "@db-template-system/types/rows";

export async function listTemplateDefinitionRowsByStoreId(
  storeId: string
): Promise<TemplateDefinitionRow[]> {
  return prisma.templateDefinition.findMany({
    where: {
      storeId,
    },
    orderBy: [{ usageKind: "asc" }, { code: "asc" }],
    select: templateDefinitionSelect,
  });
}

export async function findTemplateDefinitionRowById(
  id: string
): Promise<TemplateDefinitionRow | null> {
  return prisma.templateDefinition.findUnique({
    where: {
      id,
    },
    select: templateDefinitionSelect,
  });
}

export async function findTemplateDefinitionRowByCode(
  storeId: string,
  code: string
): Promise<TemplateDefinitionRow | null> {
  return prisma.templateDefinition.findFirst({
    where: {
      storeId,
      code,
    },
    select: templateDefinitionSelect,
  });
}
