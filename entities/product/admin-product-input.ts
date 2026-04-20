type RawInputValue = FormDataEntryValue | string | null | undefined;

export type ProductLifecycleStatus = "draft" | "active" | "inactive" | "archived";

export type RelatedProductLinkType = "related" | "cross_sell" | "up_sell" | "accessory" | "similar";

export type ValidatedAdminProductCategoryLinkInput = {
  categoryId: string;
  isPrimary: boolean;
  sortOrder: number;
};

export type ValidatedAdminRelatedProductInput = {
  targetProductId: string;
  type: RelatedProductLinkType;
  sortOrder: number;
};

export type ValidatedAdminProductInput = {
  name: string;
  slug: string;
  skuRoot: string | null;
  shortDescription: string | null;
  description: string | null;
  productTypeId: string | null;
  primaryImageMediaAssetId: string | null;
  status: ProductLifecycleStatus;
  isFeatured: boolean;
  isStandalone: boolean;
  categoryLinks: ValidatedAdminProductCategoryLinkInput[];
  relatedProducts: ValidatedAdminRelatedProductInput[];
};

export type AdminProductInputErrorCode =
  | "missing_name"
  | "missing_slug"
  | "invalid_slug"
  | "invalid_status"
  | "invalid_product_type_id"
  | "invalid_primary_image"
  | "invalid_category_links"
  | "invalid_category_sort_order"
  | "duplicate_primary_category"
  | "duplicate_category_link"
  | "invalid_related_products"
  | "invalid_related_product_type"
  | "invalid_related_product_sort_order"
  | "duplicate_related_product";

type AdminProductInputSource = {
  name: RawInputValue;
  slug: RawInputValue;
  skuRoot: RawInputValue;
  shortDescription: RawInputValue;
  description: RawInputValue;
  productTypeId: RawInputValue;
  primaryImageMediaAssetId: RawInputValue;
  status: RawInputValue;
  isFeatured: RawInputValue;
  isStandalone: RawInputValue;
  categoryIds: readonly RawInputValue[] | undefined;
  categoryPrimaryIds: readonly RawInputValue[] | undefined;
  categorySortOrders: Readonly<Record<string, RawInputValue>>;
  relatedProductIds: readonly RawInputValue[] | undefined;
  relatedProductTypes: Readonly<Record<string, RawInputValue>>;
  relatedProductSortOrders: Readonly<Record<string, RawInputValue>>;
};

export type AdminProductInputValidationResult =
  | { ok: true; data: ValidatedAdminProductInput }
  | { ok: false; code: AdminProductInputErrorCode };

function readTrimmedString(value: RawInputValue): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeOptionalText(value: RawInputValue): string | null {
  return readTrimmedString(value);
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

function normalizeOptionalId(value: RawInputValue): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null) {
    return null;
  }

  return normalizedValue;
}

function normalizeBoolean(value: RawInputValue): boolean {
  return value === "on" || value === "true" || value === "1";
}

function parseNonNegativeInteger(value: RawInputValue): number | null {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null) {
    return null;
  }

  if (!/^\d+$/.test(normalizedValue)) {
    return null;
  }

  return Number(normalizedValue);
}

function isProductLifecycleStatus(value: string | null): value is ProductLifecycleStatus {
  return value === "draft" || value === "active" || value === "inactive" || value === "archived";
}

function isRelatedProductLinkType(value: string | null): value is RelatedProductLinkType {
  return (
    value === "related" ||
    value === "cross_sell" ||
    value === "up_sell" ||
    value === "accessory" ||
    value === "similar"
  );
}

function normalizeDistinctIds(values: readonly RawInputValue[] | undefined): string[] | null {
  if (!values) {
    return [];
  }

  const normalizedIds: string[] = [];

  for (const value of values) {
    const normalizedValue = readTrimmedString(value);

    if (normalizedValue === null) {
      return null;
    }

    if (!normalizedIds.includes(normalizedValue)) {
      normalizedIds.push(normalizedValue);
    }
  }

  return normalizedIds;
}

function validateCategoryLinks(input: {
  categoryIds: readonly RawInputValue[] | undefined;
  categoryPrimaryIds: readonly RawInputValue[] | undefined;
  categorySortOrders: Readonly<Record<string, RawInputValue>>;
}):
  | { ok: true; data: ValidatedAdminProductCategoryLinkInput[] }
  | { ok: false; code: AdminProductInputErrorCode } {
  const categoryIds = normalizeDistinctIds(input.categoryIds);

  if (categoryIds === null) {
    return { ok: false, code: "invalid_category_links" };
  }

  const categoryPrimaryIds = normalizeDistinctIds(input.categoryPrimaryIds);

  if (categoryPrimaryIds === null) {
    return { ok: false, code: "invalid_category_links" };
  }

  const primarySet = new Set(categoryPrimaryIds);

  let primaryCount = 0;
  const seen = new Set<string>();
  const links: ValidatedAdminProductCategoryLinkInput[] = [];

  for (const categoryId of categoryIds) {
    if (seen.has(categoryId)) {
      return { ok: false, code: "duplicate_category_link" };
    }

    seen.add(categoryId);

    const sortOrder = parseNonNegativeInteger(input.categorySortOrders[categoryId]);

    if (sortOrder === null) {
      return { ok: false, code: "invalid_category_sort_order" };
    }

    const isPrimary = primarySet.has(categoryId);

    if (isPrimary) {
      primaryCount += 1;
    }

    links.push({
      categoryId,
      isPrimary,
      sortOrder,
    });
  }

  if (primaryCount > 1) {
    return { ok: false, code: "duplicate_primary_category" };
  }

  links.sort((left, right) => left.sortOrder - right.sortOrder);

  return { ok: true, data: links };
}

function validateRelatedProducts(input: {
  relatedProductIds: readonly RawInputValue[] | undefined;
  relatedProductTypes: Readonly<Record<string, RawInputValue>>;
  relatedProductSortOrders: Readonly<Record<string, RawInputValue>>;
}):
  | { ok: true; data: ValidatedAdminRelatedProductInput[] }
  | { ok: false; code: AdminProductInputErrorCode } {
  const relatedProductIds = normalizeDistinctIds(input.relatedProductIds);

  if (relatedProductIds === null) {
    return { ok: false, code: "invalid_related_products" };
  }

  const seen = new Set<string>();
  const relatedProducts: ValidatedAdminRelatedProductInput[] = [];

  for (const targetProductId of relatedProductIds) {
    if (seen.has(targetProductId)) {
      return { ok: false, code: "duplicate_related_product" };
    }

    seen.add(targetProductId);

    const type = readTrimmedString(input.relatedProductTypes[targetProductId]);

    if (!isRelatedProductLinkType(type)) {
      return { ok: false, code: "invalid_related_product_type" };
    }

    const sortOrder = parseNonNegativeInteger(input.relatedProductSortOrders[targetProductId]);

    if (sortOrder === null) {
      return { ok: false, code: "invalid_related_product_sort_order" };
    }

    relatedProducts.push({
      targetProductId,
      type,
      sortOrder,
    });
  }

  relatedProducts.sort((left, right) => left.sortOrder - right.sortOrder);

  return { ok: true, data: relatedProducts };
}

export type AdminProductCategoryLinksValidationResult =
  | { ok: true; data: ValidatedAdminProductCategoryLinkInput[] }
  | { ok: false; code: AdminProductInputErrorCode };

export function validateAdminProductCategoryLinks(input: {
  categoryIds: readonly RawInputValue[] | undefined;
  categoryPrimaryIds: readonly RawInputValue[] | undefined;
  categorySortOrders: Readonly<Record<string, RawInputValue>>;
}): AdminProductCategoryLinksValidationResult {
  return validateCategoryLinks(input);
}

export type AdminProductRelatedProductsValidationResult =
  | { ok: true; data: ValidatedAdminRelatedProductInput[] }
  | { ok: false; code: AdminProductInputErrorCode };

export function validateAdminProductRelatedProducts(input: {
  relatedProductIds: readonly RawInputValue[] | undefined;
  relatedProductTypes: Readonly<Record<string, RawInputValue>>;
  relatedProductSortOrders: Readonly<Record<string, RawInputValue>>;
}): AdminProductRelatedProductsValidationResult {
  return validateRelatedProducts(input);
}

export function validateAdminProductInput(
  input: AdminProductInputSource
): AdminProductInputValidationResult {
  const name = readTrimmedString(input.name);

  if (name === null) {
    return { ok: false, code: "missing_name" };
  }

  const rawSlug = readTrimmedString(input.slug);

  if (rawSlug === null) {
    return { ok: false, code: "missing_slug" };
  }

  const slug = normalizeProductSlug(rawSlug);

  if (slug.length === 0) {
    return { ok: false, code: "invalid_slug" };
  }

  const status = readTrimmedString(input.status);

  if (!isProductLifecycleStatus(status)) {
    return { ok: false, code: "invalid_status" };
  }

  const productTypeId = normalizeOptionalId(input.productTypeId);

  if (productTypeId === undefined) {
    return { ok: false, code: "invalid_product_type_id" };
  }

  const primaryImageMediaAssetId = normalizeOptionalId(input.primaryImageMediaAssetId);

  if (primaryImageMediaAssetId === undefined) {
    return { ok: false, code: "invalid_primary_image" };
  }

  const categoryLinks = validateCategoryLinks({
    categoryIds: input.categoryIds,
    categoryPrimaryIds: input.categoryPrimaryIds,
    categorySortOrders: input.categorySortOrders,
  });

  if (!categoryLinks.ok) {
    return categoryLinks;
  }

  const relatedProducts = validateRelatedProducts({
    relatedProductIds: input.relatedProductIds,
    relatedProductTypes: input.relatedProductTypes,
    relatedProductSortOrders: input.relatedProductSortOrders,
  });

  if (!relatedProducts.ok) {
    return relatedProducts;
  }

  return {
    ok: true,
    data: {
      name,
      slug,
      skuRoot: normalizeOptionalText(input.skuRoot),
      shortDescription: normalizeOptionalText(input.shortDescription),
      description: normalizeOptionalText(input.description),
      productTypeId,
      primaryImageMediaAssetId,
      status,
      isFeatured: normalizeBoolean(input.isFeatured),
      isStandalone: normalizeBoolean(input.isStandalone),
      categoryLinks: categoryLinks.data,
      relatedProducts: relatedProducts.data,
    },
  };
}
