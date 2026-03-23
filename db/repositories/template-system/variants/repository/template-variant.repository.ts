import type { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  mapTemplateDefinitionStatusToPrisma,
  mapTemplateVariant,
} from "@db-template-system/helpers/mappers";
import {
  parseCreateTemplateVariantInput,
  parseUpdateTemplateVariantInput,
} from "@db-template-system/helpers/validation";
import {
  findTemplateVariantRowById,
  listTemplateVariantRowsByDefinitionId,
} from "@db-template-system/queries/template-variant.queries";
import type {
  CreateTemplateVariantInput,
  TemplateVariantDetail,
  TemplateVariantSummary,
  UpdateTemplateVariantInput,
} from "@db-template-system/variants/types/template-variant.types";

async function clearDefaultVariant(
  templateDefinitionId: string,
  excludeVariantId?: string
): Promise<void> {
  await prisma.templateVariant.updateMany({
    where: {
      templateDefinitionId,
      isDefault: true,
      ...(excludeVariantId ? { id: { not: excludeVariantId } } : {}),
    },
    data: {
      isDefault: false,
    },
  });
}

export async function listTemplateVariantsByDefinitionId(
  templateDefinitionId: string
): Promise<TemplateVariantSummary[]> {
  const rows = await listTemplateVariantRowsByDefinitionId(templateDefinitionId.trim());
  return rows.map(mapTemplateVariant);
}

export async function findTemplateVariantById(
  id: string
): Promise<TemplateVariantDetail | null> {
  const row = await findTemplateVariantRowById(id.trim());
  return row ? mapTemplateVariant(row) : null;
}

export async function createTemplateVariant(
  input: CreateTemplateVariantInput
): Promise<TemplateVariantDetail> {
  const parsedInput = parseCreateTemplateVariantInput(input);

  if (parsedInput.isDefault) {
    await clearDefaultVariant(parsedInput.templateDefinitionId);
  }

  const created = await prisma.templateVariant.create({
    data: {
      templateDefinitionId: parsedInput.templateDefinitionId,
      code: parsedInput.code ?? null,
      locale: parsedInput.locale ?? null,
      channel: parsedInput.channel ?? null,
      name: parsedInput.name ?? null,
      subject: parsedInput.subject ?? null,
      htmlBody: parsedInput.htmlBody ?? null,
      textBody: parsedInput.textBody ?? null,
      isDefault: parsedInput.isDefault,
      status: mapTemplateDefinitionStatusToPrisma(parsedInput.status),
    },
    select: {
      id: true,
    },
  });

  const row = await findTemplateVariantRowById(created.id);

  if (!row) {
    throw new Error("Template variant not found after create.");
  }

  return mapTemplateVariant(row);
}

export async function updateTemplateVariant(
  input: UpdateTemplateVariantInput
): Promise<TemplateVariantDetail | null> {
  const parsedInput = parseUpdateTemplateVariantInput(input);
  const currentRow = await findTemplateVariantRowById(parsedInput.id);

  if (!currentRow) {
    return null;
  }

  if (parsedInput.isDefault === true) {
    await clearDefaultVariant(currentRow.templateDefinitionId, currentRow.id);
  }

  const data: Prisma.TemplateVariantUncheckedUpdateManyInput = {};

  if (parsedInput.code !== undefined) {
    data.code = parsedInput.code;
  }

  if (parsedInput.locale !== undefined) {
    data.locale = parsedInput.locale;
  }

  if (parsedInput.channel !== undefined) {
    data.channel = parsedInput.channel;
  }

  if (parsedInput.name !== undefined) {
    data.name = parsedInput.name;
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

  if (parsedInput.isDefault !== undefined) {
    data.isDefault = parsedInput.isDefault;
  }

  if (parsedInput.status !== undefined) {
    data.status = mapTemplateDefinitionStatusToPrisma(parsedInput.status);
  }

  const updated = await prisma.templateVariant.updateMany({
    where: {
      id: parsedInput.id,
    },
    data,
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findTemplateVariantRowById(parsedInput.id);
  return row ? mapTemplateVariant(row) : null;
}
