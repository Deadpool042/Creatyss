import {
  adminCategoryInputSchema,
  normalizeCategorySlug,
  type AdminCategoryInputSchema,
} from "./category-input.schema";

type RawInputValue = FormDataEntryValue | string | null | undefined;

export type ValidatedAdminCategoryInput = AdminCategoryInputSchema;

export type AdminCategoryInputErrorCode =
  | "missing_name"
  | "missing_slug"
  | "invalid_slug"
  | "invalid_parent_id"
  | "invalid_primary_image"
  | "invalid_sort_order";

export type AdminCategoryInputValidationResult =
  | { ok: true; data: ValidatedAdminCategoryInput }
  | { ok: false; code: AdminCategoryInputErrorCode };

export { normalizeCategorySlug };

export function validateAdminCategoryInput(input: {
  name: RawInputValue;
  slug: RawInputValue;
  description: RawInputValue;
  parentId: RawInputValue;
  primaryImageId: RawInputValue;
  isFeatured: RawInputValue;
  sortOrder: RawInputValue;
}): AdminCategoryInputValidationResult {
  const parsed = adminCategoryInputSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const issuePath = issue?.path[0];
    const issueMessage = issue?.message;

    let code: AdminCategoryInputErrorCode = "invalid_slug";

    if (issuePath === "name") {
      code = "missing_name";
    } else if (issuePath === "slug") {
      code = issueMessage === "invalid_slug" ? "invalid_slug" : "missing_slug";
    } else if (issuePath === "parentId") {
      code = "invalid_parent_id";
    } else if (issuePath === "primaryImageId") {
      code = "invalid_primary_image";
    } else if (issuePath === "sortOrder") {
      code = "invalid_sort_order";
    }

    return {
      ok: false,
      code,
    };
  }

  return {
    ok: true,
    data: parsed.data,
  };
}
