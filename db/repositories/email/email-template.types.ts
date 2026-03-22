export type EmailTemplateStatus = "draft" | "active" | "archived";

export type EmailTemplateType = "transactional" | "newsletter";

export type EmailTemplateSummary = {
  id: string;
  key: string;
  name: string;
  type: EmailTemplateType;
  status: EmailTemplateStatus;
  updatedAt: Date;
};

export type EmailTemplateDetail = {
  id: string;
  key: string;
  name: string;
  type: EmailTemplateType;
  subjectTemplate: string;
  bodyHtml: string;
  bodyText: string | null;
  status: EmailTemplateStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateEmailTemplateInput = {
  key: string;
  name: string;
  type: EmailTemplateType;
  subjectTemplate: string;
  bodyHtml: string;
  bodyText?: string | null;
  status?: EmailTemplateStatus;
};

export type UpdateEmailTemplateInput = {
  id: string;
  key: string;
  name: string;
  type: EmailTemplateType;
  subjectTemplate: string;
  bodyHtml: string;
  bodyText?: string | null;
  status: EmailTemplateStatus;
};

export type EmailTemplateRepositoryErrorCode =
  | "email_template_not_found"
  | "email_template_key_invalid"
  | "email_template_name_invalid"
  | "email_template_subject_invalid"
  | "email_template_body_invalid"
  | "email_template_key_conflict";

export class EmailTemplateRepositoryError extends Error {
  readonly code: EmailTemplateRepositoryErrorCode;

  constructor(code: EmailTemplateRepositoryErrorCode, message: string) {
    super(message);
    this.name = "EmailTemplateRepositoryError";
    this.code = code;
  }
}
