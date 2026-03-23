import type { TemplateDefinitionStatus } from "@db-template-system/definitions";

export type TemplateVariantSummary = {
  id: string;
  templateDefinitionId: string;
  code: string | null;
  locale: string | null;
  channel: string | null;
  name: string | null;
  subject: string | null;
  htmlBody: string | null;
  textBody: string | null;
  isDefault: boolean;
  status: TemplateDefinitionStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type TemplateVariantDetail = TemplateVariantSummary;

export type CreateTemplateVariantInput = {
  templateDefinitionId: string;
  code?: string | null;
  locale?: string | null;
  channel?: string | null;
  name?: string | null;
  subject?: string | null;
  htmlBody?: string | null;
  textBody?: string | null;
  isDefault?: boolean;
  status?: TemplateDefinitionStatus;
};

export type UpdateTemplateVariantInput = {
  id: string;
  code?: string | null;
  locale?: string | null;
  channel?: string | null;
  name?: string | null;
  subject?: string | null;
  htmlBody?: string | null;
  textBody?: string | null;
  isDefault?: boolean;
  status?: TemplateDefinitionStatus;
};
