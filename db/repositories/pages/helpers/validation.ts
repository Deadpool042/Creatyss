import { z } from "zod";
import { AdminPageRepositoryError } from "@db-pages/admin";
import { PageRepositoryError } from "@db-pages/public";
import type {
  AdminPageSectionInput,
  CreateAdminPageInput,
  UpdateAdminPageInput,
} from "@db-pages/admin/types/page.types";

type PrismaPageSectionKind =
  | "HERO"
  | "RICH_TEXT"
  | "IMAGE"
  | "IMAGE_TEXT"
  | "FEATURED_PRODUCTS"
  | "FEATURED_CATEGORIES"
  | "FEATURED_POSTS"
  | "EDITORIAL"
  | "CUSTOM";

const pageStatusSchema = z.enum(["draft", "active", "archived"]);
const pageSectionKindSchema = z.enum([
  "hero",
  "rich_text",
  "image",
  "image_text",
  "featured_products",
  "featured_categories",
  "featured_posts",
  "editorial",
  "custom",
]);
const pageIdSchema = z.string().trim().min(1);
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
const adminPageSectionInputSchema = z.object({
  kind: pageSectionKindSchema,
  title: optionalNullableTrimmedStringSchema,
  subtitle: optionalNullableTrimmedStringSchema,
  content: optionalNullableTrimmedStringSchema,
  imageAssetId: optionalNullableTrimmedStringSchema,
  sortOrder: z.number().int().min(0).optional(),
  isEnabled: z.boolean().optional(),
});
const createAdminPageInputSchema = z.object({
  storeId: nonEmptyStringSchema,
  slug: z.string(),
  title: nonEmptyStringSchema,
  description: optionalNullableTrimmedStringSchema,
  status: pageStatusSchema.optional(),
  isHomepage: z.boolean().optional(),
  sections: z.array(adminPageSectionInputSchema).optional(),
});
const updateAdminPageInputSchema = z.object({
  id: pageIdSchema,
  slug: z.string().optional(),
  title: nonEmptyStringSchema.optional(),
  description: optionalNullableTrimmedStringSchema,
  status: pageStatusSchema.optional(),
  isHomepage: z.boolean().optional(),
  sections: z.array(adminPageSectionInputSchema).optional(),
});
type ParsedPageSectionInput = {
  kind: PrismaPageSectionKind;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  imageAssetId: string | null;
  sortOrder: number;
  isEnabled: boolean;
};
type ParsedCreateAdminPageInput = {
  storeId: string;
  slug: string;
  title: string;
  description: string | null;
  status: NonNullable<CreateAdminPageInput["status"]>;
  isHomepage: boolean;
  sections: ParsedPageSectionInput[];
};
type ParsedUpdateAdminPageInput = {
  id: string;
  slug?: string;
  title?: string;
  description?: string | null;
  status?: UpdateAdminPageInput["status"];
  isHomepage?: boolean;
  sections?: ParsedPageSectionInput[];
};

export function assertValidPageId(id: string): string {
  const result = pageIdSchema.safeParse(id);

  if (!result.success) {
    throw new PageRepositoryError("page_id_invalid", "Identifiant de page invalide.");
  }

  return result.data;
}

export function normalizePageSlug(slug: string): string {
  const result = nonEmptyStringSchema.safeParse(slug);

  if (!result.success) {
    throw new AdminPageRepositoryError("page_slug_invalid", "Slug de page invalide.");
  }

  const normalizedSlug = result.data
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!normalizedSlug) {
    throw new AdminPageRepositoryError("page_slug_invalid", "Slug de page invalide.");
  }

  return normalizedSlug;
}

function mapPageSectionKindToPrisma(kind: AdminPageSectionInput["kind"]): PrismaPageSectionKind {
  switch (kind) {
    case "hero":
      return "HERO";
    case "rich_text":
      return "RICH_TEXT";
    case "image":
      return "IMAGE";
    case "image_text":
      return "IMAGE_TEXT";
    case "featured_products":
      return "FEATURED_PRODUCTS";
    case "featured_categories":
      return "FEATURED_CATEGORIES";
    case "featured_posts":
      return "FEATURED_POSTS";
    case "editorial":
      return "EDITORIAL";
    case "custom":
      return "CUSTOM";
  }
}

function parseSectionInput(
  section: z.output<typeof adminPageSectionInputSchema>,
  index: number
): ParsedPageSectionInput {
  return {
    kind: mapPageSectionKindToPrisma(section.kind),
    title: section.title ?? null,
    subtitle: section.subtitle ?? null,
    content: section.content ?? null,
    imageAssetId: section.imageAssetId ?? null,
    sortOrder: section.sortOrder ?? index,
    isEnabled: section.isEnabled ?? true,
  } as const;
}

export function parseCreateAdminPageInput(
  input: CreateAdminPageInput
): ParsedCreateAdminPageInput {
  const result = createAdminPageInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "storeId":
        throw new AdminPageRepositoryError("page_store_invalid", "Boutique de page invalide.");
      case "slug":
        throw new AdminPageRepositoryError("page_slug_invalid", "Slug de page invalide.");
      case "title":
        throw new AdminPageRepositoryError("page_title_invalid", "Titre de page invalide.");
      case "status":
        throw new AdminPageRepositoryError("page_status_invalid", "Statut de page invalide.");
      case "sections":
        throw new AdminPageRepositoryError(
          "page_section_invalid",
          "Section de page invalide."
        );
      default:
        throw new AdminPageRepositoryError("page_title_invalid", "Les données de page sont invalides.");
    }
  }

  return {
    storeId: result.data.storeId,
    slug: normalizePageSlug(result.data.slug),
    title: result.data.title,
    description: result.data.description ?? null,
    status: result.data.status ?? "draft",
    isHomepage: result.data.isHomepage ?? false,
    sections: (result.data.sections ?? []).map(parseSectionInput),
  };
}

export function parseUpdateAdminPageInput(
  input: UpdateAdminPageInput
): ParsedUpdateAdminPageInput {
  const result = updateAdminPageInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "id":
        throw new AdminPageRepositoryError("page_id_invalid", "Identifiant de page invalide.");
      case "slug":
        throw new AdminPageRepositoryError("page_slug_invalid", "Slug de page invalide.");
      case "title":
        throw new AdminPageRepositoryError("page_title_invalid", "Titre de page invalide.");
      case "status":
        throw new AdminPageRepositoryError("page_status_invalid", "Statut de page invalide.");
      case "sections":
        throw new AdminPageRepositoryError(
          "page_section_invalid",
          "Section de page invalide."
        );
      default:
        throw new AdminPageRepositoryError("page_title_invalid", "Les données de page sont invalides.");
    }
  }

  const parsedInput: ParsedUpdateAdminPageInput = {
    id: result.data.id,
  };

  if (result.data.slug !== undefined) {
    parsedInput.slug = normalizePageSlug(result.data.slug);
  }

  if (result.data.title !== undefined) {
    parsedInput.title = result.data.title;
  }

  if (result.data.description !== undefined) {
    parsedInput.description = result.data.description;
  }

  if (result.data.status !== undefined) {
    parsedInput.status = result.data.status;
  }

  if (result.data.isHomepage !== undefined) {
    parsedInput.isHomepage = result.data.isHomepage;
  }

  if (result.data.sections !== undefined) {
    parsedInput.sections = result.data.sections.map(parseSectionInput);
  }

  return parsedInput;
}

export function toPrismaPageSectionCreateManyInput(
  pageId: string,
  sections: ParsedPageSectionInput[]
) {
  return sections.map((section) => ({
    pageId,
    kind: section.kind,
    title: section.title,
    subtitle: section.subtitle,
    content: section.content,
    imageAssetId: section.imageAssetId,
    sortOrder: section.sortOrder,
    isEnabled: section.isEnabled,
  }));
}
