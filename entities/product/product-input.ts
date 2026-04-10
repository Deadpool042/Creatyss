export type ProductStatus = "draft" | "published";
export type ProductType = "simple" | "variable";

export type ValidatedProductInput = {
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: ProductStatus;
  productType: ProductType;
  isFeatured: boolean;
  categoryIds: string[];
};

export type ProductInputErrorCode =
  | "missing_name"
  | "missing_slug"
  | "invalid_slug"
  | "invalid_status"
  | "invalid_product_type"
  | "invalid_category_ids";

type ProductInputSource = {
  name: FormDataEntryValue | string | null | undefined;
  slug: FormDataEntryValue | string | null | undefined;
  shortDescription: FormDataEntryValue | string | null | undefined;
  description: FormDataEntryValue | string | null | undefined;
  seoTitle: FormDataEntryValue | string | null | undefined;
  seoDescription: FormDataEntryValue | string | null | undefined;
  status: FormDataEntryValue | string | null | undefined;
  productType: FormDataEntryValue | string | null | undefined;
  isFeatured: FormDataEntryValue | string | null | undefined;
  categoryIds: readonly FormDataEntryValue[] | readonly string[] | undefined;
};

export type ProductInputValidationResult =
  | {
      ok: true;
      data: ValidatedProductInput;
    }
  | {
      ok: false;
      code: ProductInputErrorCode;
    };

function readTrimmedString(value: FormDataEntryValue | string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
}

function normalizeOptionalText(
  value: FormDataEntryValue | string | null | undefined
): string | null {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || normalizedValue.length === 0) {
    return null;
  }

  return normalizedValue;
}

export function normalizeProductSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeCategoryIds(
  values: readonly FormDataEntryValue[] | readonly string[] | undefined
): string[] | null {
  if (!values) {
    return [];
  }

  const normalizedIds: string[] = [];

  for (const value of values) {
    if (typeof value !== "string") {
      return null;
    }

    const normalizedValue = value.trim();

    if (normalizedValue.length === 0) {
      return null;
    }

    if (!normalizedIds.includes(normalizedValue)) {
      normalizedIds.push(normalizedValue);
    }
  }

  return normalizedIds;
}

function isProductStatus(value: string | null): value is ProductStatus {
  return value === "draft" || value === "published";
}

function isProductType(value: string | null): value is ProductType {
  return value === "simple" || value === "variable";
}

export function validateProductInput(input: ProductInputSource): ProductInputValidationResult {
  const name = readTrimmedString(input.name);

  if (name === null || name.length === 0) {
    return {
      ok: false,
      code: "missing_name",
    };
  }

  const rawSlug = readTrimmedString(input.slug);

  if (rawSlug === null || rawSlug.length === 0) {
    return {
      ok: false,
      code: "missing_slug",
    };
  }

  const normalizedSlug = normalizeProductSlug(rawSlug);

  if (normalizedSlug.length === 0) {
    return {
      ok: false,
      code: "invalid_slug",
    };
  }

  const status = readTrimmedString(input.status);

  if (!isProductStatus(status)) {
    return {
      ok: false,
      code: "invalid_status",
    };
  }

  const productType = readTrimmedString(input.productType);

  if (!isProductType(productType)) {
    return {
      ok: false,
      code: "invalid_product_type",
    };
  }

  const categoryIds = normalizeCategoryIds(input.categoryIds);

  if (categoryIds === null) {
    return {
      ok: false,
      code: "invalid_category_ids",
    };
  }

  return {
    ok: true,
    data: {
      name,
      slug: normalizedSlug,
      shortDescription: normalizeOptionalText(input.shortDescription),
      description: normalizeOptionalText(input.description),
      seoTitle: normalizeOptionalText(input.seoTitle),
      seoDescription: normalizeOptionalText(input.seoDescription),
      status,
      productType,
      isFeatured:
        input.isFeatured === "on" || input.isFeatured === "true" || input.isFeatured === "1",
      categoryIds,
    },
  };
}
