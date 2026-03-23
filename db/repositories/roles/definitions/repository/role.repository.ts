import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import { mapRoleDefinition, mapRoleScopeTypeToPrisma, mapRoleStatusToPrisma } from "@db-roles/helpers/mappers";
import {
  normalizeRoleCode,
  parseCreateRoleDefinitionInput,
  parseUpdateRoleDefinitionInput,
} from "@db-roles/helpers/validation";
import {
  findRoleDefinitionRowByCode,
  findRoleDefinitionRowById,
  listRoleDefinitionRows,
} from "@db-roles/queries/role.queries";
import {
  RoleRepositoryError,
  type CreateRoleDefinitionInput,
  type RoleDefinitionDetail,
  type RoleDefinitionSummary,
  type UpdateRoleDefinitionInput,
} from "@db-roles/definitions/types/role.types";

function mapRoleWriteError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new RoleRepositoryError(
      "role_code_conflict",
      "Un rôle avec ce code existe déjà pour ce scope."
    );
  }

  throw error;
}

export async function listRoleDefinitions(
  storeId?: string | null
): Promise<RoleDefinitionSummary[]> {
  const rows = await listRoleDefinitionRows(storeId);
  return rows.map(mapRoleDefinition);
}

export async function findRoleDefinitionById(id: string): Promise<RoleDefinitionDetail | null> {
  const row = await findRoleDefinitionRowById(id);
  return row ? mapRoleDefinition(row) : null;
}

export async function findRoleDefinitionByCode(
  code: string,
  storeId?: string | null
): Promise<RoleDefinitionDetail | null> {
  const row = await findRoleDefinitionRowByCode(normalizeRoleCode(code), storeId);
  return row ? mapRoleDefinition(row) : null;
}

export async function createRoleDefinition(
  input: CreateRoleDefinitionInput
): Promise<RoleDefinitionDetail> {
  const parsedInput = parseCreateRoleDefinitionInput(input);

  try {
    const created = await prisma.role.create({
      data: {
        storeId: parsedInput.storeId ?? null,
        code: normalizeRoleCode(parsedInput.code),
        name: parsedInput.name,
        description: parsedInput.description ?? null,
        scopeType: mapRoleScopeTypeToPrisma(parsedInput.scopeType),
        status: mapRoleStatusToPrisma(parsedInput.status),
        isSystemRole: parsedInput.isSystemRole,
      },
      select: {
        id: true,
      },
    });

    const row = await findRoleDefinitionRowById(created.id);

    if (!row) {
      throw new RoleRepositoryError("role_not_found", "Rôle introuvable.");
    }

    return mapRoleDefinition(row);
  } catch (error) {
    mapRoleWriteError(error);
  }
}

export async function updateRoleDefinition(
  input: UpdateRoleDefinitionInput
): Promise<RoleDefinitionDetail | null> {
  const parsedInput = parseUpdateRoleDefinitionInput(input);
  const data: Prisma.RoleUncheckedUpdateInput = {};

  if (parsedInput.code !== undefined) {
    data.code = normalizeRoleCode(parsedInput.code);
  }

  if (parsedInput.name !== undefined) {
    data.name = parsedInput.name;
  }

  if (parsedInput.description !== undefined) {
    data.description = parsedInput.description;
  }

  if (parsedInput.scopeType !== undefined) {
    data.scopeType = mapRoleScopeTypeToPrisma(parsedInput.scopeType);
  }

  if (parsedInput.status !== undefined) {
    data.status = mapRoleStatusToPrisma(parsedInput.status);
  }

  if (parsedInput.isSystemRole !== undefined) {
    data.isSystemRole = parsedInput.isSystemRole;
  }

  try {
    const updated = await prisma.role.updateMany({
      where: {
        id: parsedInput.id,
      },
      data,
    });

    if (updated.count === 0) {
      return null;
    }

    const row = await findRoleDefinitionRowById(parsedInput.id);
    return row ? mapRoleDefinition(row) : null;
  } catch (error) {
    mapRoleWriteError(error);
  }
}
