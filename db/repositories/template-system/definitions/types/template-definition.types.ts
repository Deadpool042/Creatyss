export type TemplateDefinitionStatus = "draft" | "active" | "archived";
export type TemplateUsageKind =
  | "email"
  | "notification"
  | "page_section"
  | "event"
  | "marketing"
  | "generic";

export type TemplateDefinitionSummary = {
  id: string;
  storeId: string;
  code: string;
  name: string;
  description: string | null;
  usageKind: TemplateUsageKind;
  status: TemplateDefinitionStatus;
  subject: string | null;
  htmlBody: string | null;
  textBody: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TemplateDefinitionDetail = TemplateDefinitionSummary;

export type CreateTemplateDefinitionInput = {
  storeId: string;
  code: string;
  name: string;
  description?: string | null;
  usageKind: TemplateUsageKind;
  status?: TemplateDefinitionStatus;
  subject?: string | null;
  htmlBody?: string | null;
  textBody?: string | null;
};

export type UpdateTemplateDefinitionInput = {
  id: string;
  code?: string;
  name?: string;
  description?: string | null;
  usageKind?: TemplateUsageKind;
  status?: TemplateDefinitionStatus;
  subject?: string | null;
  htmlBody?: string | null;
  textBody?: string | null;
};

export class TemplateRepositoryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "TemplateRepositoryError";
    this.code = code;
  }
}
