import { z } from "zod";
import { TemplateRepositoryError } from "@db-template-system/definitions";
import type {
  CreateTemplateDefinitionInput,
  UpdateTemplateDefinitionInput,
} from "@db-template-system/definitions/types/template-definition.types";
import type {
  CreateTemplateVariantInput,
  UpdateTemplateVariantInput,
} from "@db-template-system/variants/types/template-variant.types";

const templateDefinitionStatusSchema = z.enum(["draft", "active", "archived"]);
const templateUsageKindSchema = z.enum([
  "email",
  "notification",
  "page_section",
  "event",
  "marketing",
  "generic",
]);
const nonEmptyStringSchema = z.string().trim().min(1);
const optionalNullableTrimmedStringSchema = z
  .string()
  .trim()
  .nullish()
  .transform((value) => {
    if (value === undefined) {
      return undefined;
    }

    return value || null;
  });
const createTemplateDefinitionInputSchema = z.object({
  storeId: nonEmptyStringSchema,
  code: z.string(),
  name: nonEmptyStringSchema,
  description: optionalNullableTrimmedStringSchema,
  usageKind: templateUsageKindSchema,
  status: templateDefinitionStatusSchema.optional(),
  subject: optionalNullableTrimmedStringSchema,
  htmlBody: optionalNullableTrimmedStringSchema,
  textBody: optionalNullableTrimmedStringSchema,
});
const updateTemplateDefinitionInputSchema = z.object({
  id: nonEmptyStringSchema,
  code: z.string().optional(),
  name: nonEmptyStringSchema.optional(),
  description: optionalNullableTrimmedStringSchema,
  usageKind: templateUsageKindSchema.optional(),
  status: templateDefinitionStatusSchema.optional(),
  subject: optionalNullableTrimmedStringSchema,
  htmlBody: optionalNullableTrimmedStringSchema,
  textBody: optionalNullableTrimmedStringSchema,
});
const createTemplateVariantInputSchema = z.object({
  templateDefinitionId: nonEmptyStringSchema,
  code: optionalNullableTrimmedStringSchema,
  locale: optionalNullableTrimmedStringSchema,
  channel: optionalNullableTrimmedStringSchema,
  name: optionalNullableTrimmedStringSchema,
  subject: optionalNullableTrimmedStringSchema,
  htmlBody: optionalNullableTrimmedStringSchema,
  textBody: optionalNullableTrimmedStringSchema,
  isDefault: z.boolean().optional(),
  status: templateDefinitionStatusSchema.optional(),
});
const updateTemplateVariantInputSchema = z.object({
  id: nonEmptyStringSchema,
  code: optionalNullableTrimmedStringSchema,
  locale: optionalNullableTrimmedStringSchema,
  channel: optionalNullableTrimmedStringSchema,
  name: optionalNullableTrimmedStringSchema,
  subject: optionalNullableTrimmedStringSchema,
  htmlBody: optionalNullableTrimmedStringSchema,
  textBody: optionalNullableTrimmedStringSchema,
  isDefault: z.boolean().optional(),
  status: templateDefinitionStatusSchema.optional(),
});
type ParsedCreateTemplateDefinitionInput = {
  storeId: string;
  code: string;
  name: string;
  description: string | null;
  usageKind: CreateTemplateDefinitionInput["usageKind"];
  status: NonNullable<CreateTemplateDefinitionInput["status"]>;
  subject: string | null;
  htmlBody: string | null;
  textBody: string | null;
};
type ParsedUpdateTemplateDefinitionInput = {
  id: string;
  code?: string;
  name?: string;
  description?: string | null;
  usageKind?: UpdateTemplateDefinitionInput["usageKind"];
  status?: UpdateTemplateDefinitionInput["status"];
  subject?: string | null;
  htmlBody?: string | null;
  textBody?: string | null;
};
type ParsedCreateTemplateVariantInput = {
  templateDefinitionId: string;
  code: string | null;
  locale: string | null;
  channel: string | null;
  name: string | null;
  subject: string | null;
  htmlBody: string | null;
  textBody: string | null;
  isDefault: boolean;
  status: NonNullable<CreateTemplateVariantInput["status"]>;
};
type ParsedUpdateTemplateVariantInput = {
  id: string;
  code?: string | null;
  locale?: string | null;
  channel?: string | null;
  name?: string | null;
  subject?: string | null;
  htmlBody?: string | null;
  textBody?: string | null;
  isDefault?: boolean;
  status?: UpdateTemplateVariantInput["status"];
};

export function normalizeTemplateCode(code: string): string {
  const result = nonEmptyStringSchema.safeParse(code);

  if (!result.success) {
    throw new TemplateRepositoryError("template_code_invalid", "Code de template invalide.");
  }

  const normalizedCode = result.data.toLowerCase().replace(/[^a-z0-9_]+/g, "_");

  if (!normalizedCode) {
    throw new TemplateRepositoryError("template_code_invalid", "Code de template invalide.");
  }

  return normalizedCode;
}

export function parseCreateTemplateDefinitionInput(
  input: CreateTemplateDefinitionInput
): ParsedCreateTemplateDefinitionInput {
  const result = createTemplateDefinitionInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "storeId":
        throw new TemplateRepositoryError(
          "template_store_invalid",
          "Boutique de template invalide."
        );
      case "code":
        throw new TemplateRepositoryError("template_code_invalid", "Code de template invalide.");
      case "name":
        throw new TemplateRepositoryError("template_name_invalid", "Nom de template invalide.");
      case "usageKind":
        throw new TemplateRepositoryError(
          "template_usage_kind_invalid",
          "Usage de template invalide."
        );
      case "status":
        throw new TemplateRepositoryError(
          "template_status_invalid",
          "Statut de template invalide."
        );
      default:
        throw new TemplateRepositoryError(
          "template_name_invalid",
          "Les données de template sont invalides."
        );
    }
  }

  return {
    storeId: result.data.storeId,
    code: normalizeTemplateCode(result.data.code),
    name: result.data.name,
    description: result.data.description ?? null,
    usageKind: result.data.usageKind,
    status: result.data.status ?? "draft",
    subject: result.data.subject ?? null,
    htmlBody: result.data.htmlBody ?? null,
    textBody: result.data.textBody ?? null,
  };
}

export function parseUpdateTemplateDefinitionInput(
  input: UpdateTemplateDefinitionInput
): ParsedUpdateTemplateDefinitionInput {
  const result = updateTemplateDefinitionInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "id":
        throw new TemplateRepositoryError("template_id_invalid", "Template invalide.");
      case "code":
        throw new TemplateRepositoryError("template_code_invalid", "Code de template invalide.");
      case "name":
        throw new TemplateRepositoryError("template_name_invalid", "Nom de template invalide.");
      case "usageKind":
        throw new TemplateRepositoryError(
          "template_usage_kind_invalid",
          "Usage de template invalide."
        );
      case "status":
        throw new TemplateRepositoryError(
          "template_status_invalid",
          "Statut de template invalide."
        );
      default:
        throw new TemplateRepositoryError(
          "template_name_invalid",
          "Les données de template sont invalides."
        );
    }
  }

  const parsedInput: ParsedUpdateTemplateDefinitionInput = {
    id: result.data.id,
  };

  if (result.data.code !== undefined) {
    parsedInput.code = normalizeTemplateCode(result.data.code);
  }

  if (result.data.name !== undefined) {
    parsedInput.name = result.data.name;
  }

  if (result.data.description !== undefined) {
    parsedInput.description = result.data.description;
  }

  if (result.data.usageKind !== undefined) {
    parsedInput.usageKind = result.data.usageKind;
  }

  if (result.data.status !== undefined) {
    parsedInput.status = result.data.status;
  }

  if (result.data.subject !== undefined) {
    parsedInput.subject = result.data.subject;
  }

  if (result.data.htmlBody !== undefined) {
    parsedInput.htmlBody = result.data.htmlBody;
  }

  if (result.data.textBody !== undefined) {
    parsedInput.textBody = result.data.textBody;
  }

  return parsedInput;
}

export function parseCreateTemplateVariantInput(
  input: CreateTemplateVariantInput
): ParsedCreateTemplateVariantInput {
  const result = createTemplateVariantInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "templateDefinitionId":
        throw new TemplateRepositoryError(
          "template_definition_id_invalid",
          "Définition de template invalide."
        );
      case "status":
        throw new TemplateRepositoryError(
          "template_status_invalid",
          "Statut de template invalide."
        );
      default:
        throw new TemplateRepositoryError(
          "template_variant_invalid",
          "Les données de variante de template sont invalides."
        );
    }
  }

  return {
    templateDefinitionId: result.data.templateDefinitionId,
    code: result.data.code ?? null,
    locale: result.data.locale ?? null,
    channel: result.data.channel ?? null,
    name: result.data.name ?? null,
    subject: result.data.subject ?? null,
    htmlBody: result.data.htmlBody ?? null,
    textBody: result.data.textBody ?? null,
    isDefault: result.data.isDefault ?? false,
    status: result.data.status ?? "draft",
  };
}

export function parseUpdateTemplateVariantInput(
  input: UpdateTemplateVariantInput
): ParsedUpdateTemplateVariantInput {
  const result = updateTemplateVariantInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "id":
        throw new TemplateRepositoryError(
          "template_variant_id_invalid",
          "Variante de template invalide."
        );
      case "status":
        throw new TemplateRepositoryError(
          "template_status_invalid",
          "Statut de template invalide."
        );
      default:
        throw new TemplateRepositoryError(
          "template_variant_invalid",
          "Les données de variante de template sont invalides."
        );
    }
  }

  const parsedInput: ParsedUpdateTemplateVariantInput = {
    id: result.data.id,
  };

  if (result.data.code !== undefined) {
    parsedInput.code = result.data.code;
  }

  if (result.data.locale !== undefined) {
    parsedInput.locale = result.data.locale;
  }

  if (result.data.channel !== undefined) {
    parsedInput.channel = result.data.channel;
  }

  if (result.data.name !== undefined) {
    parsedInput.name = result.data.name;
  }

  if (result.data.subject !== undefined) {
    parsedInput.subject = result.data.subject;
  }

  if (result.data.htmlBody !== undefined) {
    parsedInput.htmlBody = result.data.htmlBody;
  }

  if (result.data.textBody !== undefined) {
    parsedInput.textBody = result.data.textBody;
  }

  if (result.data.isDefault !== undefined) {
    parsedInput.isDefault = result.data.isDefault;
  }

  if (result.data.status !== undefined) {
    parsedInput.status = result.data.status;
  }

  return parsedInput;
}
