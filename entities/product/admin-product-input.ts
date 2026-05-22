import { z } from "zod";

import {
  normalizeBoolean,
  normalizeOptionalId,
  normalizeOptionalText,
  normalizeProductSlug,
  parseNonNegativeInteger,
  readTrimmedString,
  type RawInputValue,
} from "./shared-input";

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

export type ValidatedAdminProductCharacteristicInput = {
  label: string;
  value: string;
  sortOrder: number;
};

export type ValidatedAdminProductInput = {
  name: string;
  slug: string;
  skuRoot: string | null;
  marketingHook: string | null;
  shortDescription: string | null;
  description: string | null;
  careInstructions: string | null;
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
  | "short_description_too_long"
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

export type AdminProductCharacteristicInputErrorCode =
  | "invalid_characteristics"
  | "too_many_characteristics";

export type AdminProductCharacteristicIssueCode =
  | "missing_label"
  | "missing_value"
  | "label_too_long"
  | "value_too_long";

export type AdminProductCharacteristicValidationIssue = {
  index: number;
  field: "label" | "value";
  code: AdminProductCharacteristicIssueCode;
};

type AdminProductInputSource = {
  name: RawInputValue;
  slug: RawInputValue;
  skuRoot: RawInputValue;
  marketingHook: RawInputValue;
  shortDescription: RawInputValue;
  description: RawInputValue;
  careInstructions: RawInputValue;
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

const SHORT_DESCRIPTION_MAX_LENGTH = 220;
const CHARACTERISTIC_LABEL_MAX_LENGTH = 80;
const CHARACTERISTIC_VALUE_MAX_LENGTH = 220;
const MAX_PRODUCT_CHARACTERISTICS = 20;

type AdminProductCharacteristicInputSource = {
  label: RawInputValue;
  value: RawInputValue;
};

export type AdminProductInputValidationResult =
  | { ok: true; data: ValidatedAdminProductInput }
  | { ok: false; code: AdminProductInputErrorCode };

/**
 * Sanitizer minimal et volontairement conservateur pour le HTML issu de l'éditeur admin (TipTap).
 *
 * Objectif:
 * - garantir qu'on ne persiste pas de HTML manifestement dangereux (script/iframe, handlers on*, href javascript:)
 * - conserver un sous-ensemble de balises attendu pour un rich-text produit (p, strong, em, u, lists, headings, a, ...)
 *
 * Contraintes:
 * - pas de dépendance externe dans ce lot
 * - la sanitation reste côté domaine/serveur (pas dans les composants React)
 *
 * Note: ce n'est pas un sanitizer universel. Il vise à normaliser/filtrer un HTML produit par notre éditeur.
 */
function sanitizeAdminRichTextHtml(input: string): string {
  const raw = input.trim();

  if (raw.length === 0) {
    return "";
  }

  // Remove whole dangerous blocks early.
  let html = raw
    .replace(/<!--([\s\S]*?)-->/g, "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed\b[^>]*>[\s\S]*?<\/embed>/gi, "");

  // Strip inline event handlers and srcdoc.
  html = html
    .replace(/\son[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "")
    .replace(/\ssrcdoc\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, "");

  const allowedTags = new Set([
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "mark",
    "ul",
    "ol",
    "li",
    "blockquote",
    "h1",
    "h2",
    "h3",
    "a",
  ]);

  html = html.replace(/<\s*(\/?)\s*([a-z0-9]+)([^>]*)>/gi, (_match, slash, tag, attrs) => {
    const isClosing = String(slash).length > 0;
    const name = String(tag).toLowerCase();

    if (!allowedTags.has(name)) {
      return "";
    }

    if (isClosing) {
      if (name === "br") {
        return "";
      }
      return `</${name}>`;
    }

    if (name === "br") {
      return "<br />";
    }

    if (name !== "a") {
      // Keep the element but drop attributes.
      return `<${name}>`;
    }

    // <a>: allow only safe href, and re-apply safe rel/target for external links.
    const attrsValue = String(attrs ?? "");
    const hrefMatch = attrsValue.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const href = (hrefMatch?.[1] ?? hrefMatch?.[2] ?? hrefMatch?.[3] ?? "").trim();

    const normalizedHref = href.replace(/^['"]|['"]$/g, "");
    const isExternal =
      normalizedHref.startsWith("http://") ||
      normalizedHref.startsWith("https://") ||
      normalizedHref.startsWith("mailto:");
    const isInternal = normalizedHref.startsWith("/");
    const isHash = normalizedHref.startsWith("#");
    const isSafe = isExternal || isInternal || isHash;

    if (!isSafe) {
      return "<a>";
    }

    // Explicitly block javascript: / data: even if disguised.
    if (/^\s*javascript:/i.test(normalizedHref) || /^\s*data:/i.test(normalizedHref)) {
      return "<a>";
    }

    if (isExternal) {
      return `<a href="${normalizedHref}" target="_blank" rel="noopener noreferrer nofollow">`;
    }

    return `<a href="${normalizedHref}">`;
  });

  return html.trim();
}

function normalizeOptionalRichTextHtml(value: unknown): string | null {
  const trimmed = readTrimmedString(value);
  if (trimmed === null) {
    return null;
  }

  const sanitized = sanitizeAdminRichTextHtml(trimmed);
  return sanitized.length > 0 ? sanitized : null;
}

function getVisibleTextLength(html: string): number {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim().length;
}

export { normalizeProductSlug };

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

const productLifecycleStatusSchema = z.enum(["draft", "active", "inactive", "archived"]);

const adminProductTopLevelSchema = z.object({
  name: z.preprocess((value) => readTrimmedString(value), z.string().min(1)),
  slug: z
    .preprocess((value) => readTrimmedString(value), z.string().min(1))
    .transform((value) => normalizeProductSlug(value))
    .refine((value) => value.length > 0),
  skuRoot: z.preprocess((value) => normalizeOptionalText(value), z.string().nullable()),
  marketingHook: z.preprocess((value) => normalizeOptionalText(value), z.string().nullable()),
  shortDescription: z.preprocess(
    (value) => normalizeOptionalRichTextHtml(value),
    z.string().nullable()
  ),
  description: z.preprocess(
    (value) => normalizeOptionalRichTextHtml(value),
    z.string().nullable()
  ),
  careInstructions: z.preprocess(
    (value) => normalizeOptionalRichTextHtml(value),
    z.string().nullable()
  ),
  productTypeId: z.preprocess((value) => normalizeOptionalId(value), z.string().nullable()),
  primaryImageMediaAssetId: z.preprocess(
    (value) => normalizeOptionalId(value),
    z.string().nullable()
  ),
  status: z.preprocess((value) => readTrimmedString(value), productLifecycleStatusSchema),
  isFeatured: z.preprocess((value) => normalizeBoolean(value), z.boolean()),
  isStandalone: z.preprocess((value) => normalizeBoolean(value), z.boolean()),
});

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

    if (sortOrder === undefined) {
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

    if (sortOrder === undefined) {
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

export type AdminProductCharacteristicsValidationResult =
  | { ok: true; data: ValidatedAdminProductCharacteristicInput[] }
  | {
      ok: false;
      code: AdminProductCharacteristicInputErrorCode;
      issues: AdminProductCharacteristicValidationIssue[];
    };

export function validateAdminProductCharacteristics(input: {
  characteristics: readonly AdminProductCharacteristicInputSource[] | undefined;
}): AdminProductCharacteristicsValidationResult {
  const source = input.characteristics ?? [];
  const characteristics: ValidatedAdminProductCharacteristicInput[] = [];
  const issues: AdminProductCharacteristicValidationIssue[] = [];

  for (const [index, item] of source.entries()) {
    const label = readTrimmedString(item.label);
    const value = readTrimmedString(item.value);

    if (label === null) {
      issues.push({
        index,
        field: "label",
        code: "missing_label",
      });
    } else if (label.length > CHARACTERISTIC_LABEL_MAX_LENGTH) {
      issues.push({
        index,
        field: "label",
        code: "label_too_long",
      });
    }

    if (value === null) {
      issues.push({
        index,
        field: "value",
        code: "missing_value",
      });
    } else if (value.length > CHARACTERISTIC_VALUE_MAX_LENGTH) {
      issues.push({
        index,
        field: "value",
        code: "value_too_long",
      });
    }

    if (label === null || value === null) {
      continue;
    }

    if (
      label.length > CHARACTERISTIC_LABEL_MAX_LENGTH ||
      value.length > CHARACTERISTIC_VALUE_MAX_LENGTH
    ) {
      continue;
    }

    if (characteristics.length >= MAX_PRODUCT_CHARACTERISTICS) {
      return { ok: false, code: "too_many_characteristics", issues: [] };
    }

    characteristics.push({
      label,
      value,
      sortOrder: characteristics.length,
    });
  }

  if (issues.length > 0) {
    return {
      ok: false,
      code: "invalid_characteristics",
      issues,
    };
  }

  return { ok: true, data: characteristics };
}

export function validateAdminProductInput(
  input: AdminProductInputSource
): AdminProductInputValidationResult {
  const parsed = adminProductTopLevelSchema.safeParse(input);

  if (!parsed.success) {
    const issuePath = parsed.error.issues[0]?.path[0];
    const receivedSlug = readTrimmedString(input.slug);

    switch (issuePath) {
      case "name":
        return { ok: false, code: "missing_name" };
      case "slug":
        if (receivedSlug === null) {
          return { ok: false, code: "missing_slug" };
        }
        return { ok: false, code: "invalid_slug" };
      case "status":
        return { ok: false, code: "invalid_status" };
      case "productTypeId":
        return { ok: false, code: "invalid_product_type_id" };
      case "primaryImageMediaAssetId":
        return { ok: false, code: "invalid_primary_image" };
      default:
        return { ok: false, code: "invalid_status" };
    }
  }

  if (
    parsed.data.shortDescription !== null &&
    getVisibleTextLength(parsed.data.shortDescription) > SHORT_DESCRIPTION_MAX_LENGTH
  ) {
    return { ok: false, code: "short_description_too_long" };
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
      name: parsed.data.name,
      slug: parsed.data.slug,
      skuRoot: parsed.data.skuRoot,
      marketingHook: parsed.data.marketingHook,
      shortDescription: parsed.data.shortDescription,
      description: parsed.data.description,
      careInstructions: parsed.data.careInstructions,
      productTypeId: parsed.data.productTypeId,
      primaryImageMediaAssetId: parsed.data.primaryImageMediaAssetId,
      status: parsed.data.status,
      isFeatured: parsed.data.isFeatured,
      isStandalone: parsed.data.isStandalone,
      categoryLinks: categoryLinks.data,
      relatedProducts: relatedProducts.data,
    },
  };
}
