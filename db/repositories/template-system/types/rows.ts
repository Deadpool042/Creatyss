import type { Prisma } from "@prisma/client";

export const templateDefinitionSelect = {
  id: true,
  storeId: true,
  code: true,
  name: true,
  description: true,
  usageKind: true,
  status: true,
  subject: true,
  htmlBody: true,
  textBody: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.TemplateDefinitionSelect;

export const templateVariantSelect = {
  id: true,
  templateDefinitionId: true,
  code: true,
  locale: true,
  channel: true,
  name: true,
  subject: true,
  htmlBody: true,
  textBody: true,
  isDefault: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.TemplateVariantSelect;

export type TemplateDefinitionRow = Prisma.TemplateDefinitionGetPayload<{
  select: typeof templateDefinitionSelect;
}>;

export type TemplateVariantRow = Prisma.TemplateVariantGetPayload<{
  select: typeof templateVariantSelect;
}>;
