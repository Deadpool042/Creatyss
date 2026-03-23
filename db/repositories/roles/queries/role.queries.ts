import { prisma } from "@/db/prisma-client";
import { roleDefinitionSelect, type RoleDefinitionRow } from "@db-roles/types/rows";

export async function listRoleDefinitionRows(
  storeId?: string | null
): Promise<RoleDefinitionRow[]> {
  const args: {
    where?: {
      OR: Array<{ storeId: string | null }>;
    };
    orderBy: Array<{ scopeType: "asc" } | { code: "asc" }>;
    select: typeof roleDefinitionSelect;
  } = {
    orderBy: [{ scopeType: "asc" }, { code: "asc" }],
    select: roleDefinitionSelect,
  };

  if (storeId !== undefined) {
    args.where = {
      OR: [{ storeId: null }, { storeId }],
    };
  }

  return prisma.role.findMany(args);
}

export async function findRoleDefinitionRowById(id: string): Promise<RoleDefinitionRow | null> {
  return prisma.role.findUnique({
    where: {
      id,
    },
    select: roleDefinitionSelect,
  });
}

export async function findRoleDefinitionRowByCode(
  code: string,
  storeId?: string | null
): Promise<RoleDefinitionRow | null> {
  return prisma.role.findFirst({
    where:
      storeId === undefined
        ? {
            code,
          }
        : {
            code,
            OR: [{ storeId: null }, { storeId }],
          },
    orderBy: [{ storeId: "desc" }],
    select: roleDefinitionSelect,
  });
}
