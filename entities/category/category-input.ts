export type ValidatedCategoryInput = {
  name: string;
  slug: string;
  description: string | null;
  isFeatured: boolean;
};

export type CategoryInputErrorCode =
  | "missing_name"
  | "missing_slug"
  | "invalid_slug";

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

function readTrimmedString(
  value: FormDataEntryValue | string | null | undefined
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
}

export function normalizeCategorySlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateCategoryInput(
  input: CategoryInputSource
): CategoryInputValidationResult {
  const name = readTrimmedString(input.name);

  if (name === null || name.length === 0) {
    return {
      ok: false,
      code: "missing_name"
    };
  }

  const rawSlug = readTrimmedString(input.slug);

  if (rawSlug === null || rawSlug.length === 0) {
    return {
      ok: false,
      code: "missing_slug"
    };
  }

  const normalizedSlug = normalizeCategorySlug(rawSlug);

  if (normalizedSlug.length === 0) {
    return {
      ok: false,
      code: "invalid_slug"
    };
  }

  const descriptionValue = readTrimmedString(input.description);
  const isFeaturedValue =
    input.isFeatured === "on" ||
    input.isFeatured === "true" ||
    input.isFeatured === "1";

  return {
    ok: true,
    data: {
      name,
      slug: normalizedSlug,
      description:
        descriptionValue === null || descriptionValue.length === 0
          ? null
          : descriptionValue,
      isFeatured: isFeaturedValue
    }
  };
}
