import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  mapTemplateDefinition,
  mapTemplateDefinitionStatusToPrisma,
  mapTemplateUsageKindToPrisma,
} from "@db-template-system/helpers/mappers";
import {
  normalizeTemplateCode,
  parseCreateTemplateDefinitionInput,
  parseUpdateTemplateDefinitionInput,
} from "@db-template-system/helpers/validation";
import {
  findTemplateDefinitionRowByCode,
  findTemplateDefinitionRowById,
  listTemplateDefinitionRowsByStoreId,
} from "@db-template-system/queries/template-definition.queries";
import {
  TemplateRepositoryError,
  type CreateTemplateDefinitionInput,
  type TemplateDefinitionDetail,
  type TemplateDefinitionSummary,
  type UpdateTemplateDefinitionInput,
} from "@db-template-system/definitions/types/template-definition.types";

function mapTemplateWriteError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new TemplateRepositoryError(
      "template_code_conflict",
      "Un template avec ce code existe déjà pour cette boutique."
    );
  }

  throw error;
}

export async function listTemplateDefinitionsByStoreId(
  storeId: string
): Promise<TemplateDefinitionSummary[]> {
  const rows = await listTemplateDefinitionRowsByStoreId(storeId);
  return rows.map(mapTemplateDefinition);
}

export async function findTemplateDefinitionById(
  id: string
): Promise<TemplateDefinitionDetail | null> {
  const row = await findTemplateDefinitionRowById(id.trim());
  return row ? mapTemplateDefinition(row) : null;
}

export async function findTemplateDefinitionByCode(
  storeId: string,
  code: string
): Promise<TemplateDefinitionDetail | null> {
  const row = await findTemplateDefinitionRowByCode(storeId.trim(), normalizeTemplateCode(code));
  return row ? mapTemplateDefinition(row) : null;
}

export async function createTemplateDefinition(
  input: CreateTemplateDefinitionInput
): Promise<TemplateDefinitionDetail> {
  const parsedInput = parseCreateTemplateDefinitionInput(input);

  try {
    const created = await prisma.templateDefinition.create({
      data: {
        storeId: parsedInput.storeId,
        code: normalizeTemplateCode(parsedInput.code),
        name: parsedInput.name,
        description: parsedInput.description ?? null,
        usageKind: mapTemplateUsageKindToPrisma(parsedInput.usageKind),
        status: mapTemplateDefinitionStatusToPrisma(parsedInput.status),
        subject: parsedInput.subject ?? null,
        htmlBody: parsedInput.htmlBody ?? null,
        textBody: parsedInput.textBody ?? null,
      },
      select: {
        id: true,
      },
    });

    const row = await findTemplateDefinitionRowById(created.id);

    if (!row) {
      throw new TemplateRepositoryError("template_not_found", "Template introuvable.");
    }

    return mapTemplateDefinition(row);
  } catch (error) {
    mapTemplateWriteError(error);
  }
}

export async function updateTemplateDefinition(
  input: UpdateTemplateDefinitionInput
): Promise<TemplateDefinitionDetail | null> {
  const parsedInput = parseUpdateTemplateDefinitionInput(input);
  const data: Prisma.TemplateDefinitionUncheckedUpdateInput = {};

  if (parsedInput.code !== undefined) {
    data.code = normalizeTemplateCode(parsedInput.code);
  }

  if (parsedInput.name !== undefined) {
    data.name = parsedInput.name;
  }

  if (parsedInput.description !== undefined) {
    data.description = parsedInput.description;
  }

  if (parsedInput.usageKind !== undefined) {
    data.usageKind = mapTemplateUsageKindToPrisma(parsedInput.usageKind);
  }

  if (parsedInput.status !== undefined) {
    data.status = mapTemplateDefinitionStatusToPrisma(parsedInput.status);
  }

  if (parsedInput.subject !== undefined) {
    data.subject = parsedInput.subject;
  }

  if (parsedInput.htmlBody !== undefined) {
    data.htmlBody = parsedInput.htmlBody;
  }

  if (parsedInput.textBody !== undefined) {
    data.textBody = parsedInput.textBody;
  }

  try {
    const updated = await prisma.templateDefinition.updateMany({
      where: {
        id: parsedInput.id,
      },
      data,
    });

    if (updated.count === 0) {
      return null;
    }

    const row = await findTemplateDefinitionRowById(parsedInput.id);
    return row ? mapTemplateDefinition(row) : null;
  } catch (error) {
    mapTemplateWriteError(error);
  }
}
