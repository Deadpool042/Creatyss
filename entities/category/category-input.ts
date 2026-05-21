import {
  categoryInputSchema,
  normalizeCategorySlug,
  type CategoryInputSchema,
} from "./category-input.schema";

export type ValidatedCategoryInput = CategoryInputSchema;

export type CategoryInputErrorCode = "missing_name" | "missing_slug" | "invalid_slug";

type CategoryInputSource = {
  name: FormDataEntryValue | string | null | undefined;
  slug: FormDataEntryValue | string | null | undefined;
  description: FormDataEntryValue | string | null | undefined;
  isFeatured: FormDataEntryValue | string | null | undefined;
};

export type CategoryInputValidationResult =
  | {
      ok: true;
      data: ValidatedCategoryInput;
    }
  | {
      ok: false;
      code: CategoryInputErrorCode;
    };

export { normalizeCategorySlug };

export function validateCategoryInput(input: CategoryInputSource): CategoryInputValidationResult {
  const parsed = categoryInputSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const issuePath = issue?.path[0];
    const issueMessage = issue?.message;

    let code: CategoryInputErrorCode = "invalid_slug";

    if (issuePath === "name") {
      code = "missing_name";
    } else if (issuePath === "slug") {
      code = issueMessage === "invalid_slug" ? "invalid_slug" : "missing_slug";
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
