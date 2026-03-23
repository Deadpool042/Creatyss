import type {
  TemplateDefinitionDetail,
  TemplateDefinitionStatus,
  TemplateUsageKind,
} from "@db-template-system/definitions";
import type { TemplateVariantDetail } from "@db-template-system/variants";
import type {
  TemplateDefinitionRow,
  TemplateVariantRow,
} from "@db-template-system/types/rows";

export function mapTemplateDefinitionStatusToPrisma(
  status: TemplateDefinitionStatus
): "DRAFT" | "ACTIVE" | "ARCHIVED" {
  switch (status) {
    case "draft":
      return "DRAFT";
    case "active":
      return "ACTIVE";
    case "archived":
      return "ARCHIVED";
  }
}

export function mapTemplateUsageKindToPrisma(
  usageKind: TemplateUsageKind
): "EMAIL" | "NOTIFICATION" | "PAGE_SECTION" | "EVENT" | "MARKETING" | "GENERIC" {
  switch (usageKind) {
    case "email":
      return "EMAIL";
    case "notification":
      return "NOTIFICATION";
    case "page_section":
      return "PAGE_SECTION";
    case "event":
      return "EVENT";
    case "marketing":
      return "MARKETING";
    case "generic":
      return "GENERIC";
  }
}

function mapTemplateDefinitionStatus(
  status: "DRAFT" | "ACTIVE" | "ARCHIVED"
): TemplateDefinitionStatus {
  switch (status) {
    case "DRAFT":
      return "draft";
    case "ACTIVE":
      return "active";
    case "ARCHIVED":
      return "archived";
  }
}

function mapTemplateUsageKind(
  usageKind: "EMAIL" | "NOTIFICATION" | "PAGE_SECTION" | "EVENT" | "MARKETING" | "GENERIC"
): TemplateUsageKind {
  switch (usageKind) {
    case "EMAIL":
      return "email";
    case "NOTIFICATION":
      return "notification";
    case "PAGE_SECTION":
      return "page_section";
    case "EVENT":
      return "event";
    case "MARKETING":
      return "marketing";
    case "GENERIC":
      return "generic";
  }
}

export function mapTemplateDefinition(row: TemplateDefinitionRow): TemplateDefinitionDetail {
  return {
    id: row.id,
    storeId: row.storeId,
    code: row.code,
    name: row.name,
    description: row.description,
    usageKind: mapTemplateUsageKind(row.usageKind),
    status: mapTemplateDefinitionStatus(row.status),
    subject: row.subject,
    htmlBody: row.htmlBody,
    textBody: row.textBody,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapTemplateVariant(row: TemplateVariantRow): TemplateVariantDetail {
  return {
    id: row.id,
    templateDefinitionId: row.templateDefinitionId,
    code: row.code,
    locale: row.locale,
    channel: row.channel,
    name: row.name,
    subject: row.subject,
    htmlBody: row.htmlBody,
    textBody: row.textBody,
    isDefault: row.isDefault,
    status: mapTemplateDefinitionStatus(row.status),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
