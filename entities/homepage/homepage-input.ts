import type {
  HomepageFeaturedBlogPostSelection,
  HomepageFeaturedCategorySelection,
  HomepageFeaturedProductSelection,
} from "./homepage-types";

export type {
  HomepageFeaturedBlogPostSelection,
  HomepageFeaturedCategorySelection,
  HomepageFeaturedProductSelection,
};

// --- Validation constants ---

export const HOMEPAGE_HERO_TITLE_MAX_LENGTH = 120;
export const HOMEPAGE_HERO_TEXT_MAX_LENGTH = 500;
export const HOMEPAGE_EDITORIAL_TITLE_MAX_LENGTH = 120;
export const HOMEPAGE_EDITORIAL_TEXT_MAX_LENGTH = 1200;

export const HOMEPAGE_FEATURED_PRODUCTS_MAX_COUNT = 12;
export const HOMEPAGE_FEATURED_CATEGORIES_MAX_COUNT = 8;
export const HOMEPAGE_FEATURED_BLOG_POSTS_MAX_COUNT = 6;

// --- Internal types ---

type RawInputValue = FormDataEntryValue | string | null | undefined;

type SelectionSortOrders = Readonly<Record<string, RawInputValue>>;

type HomepageHeroImageSelection =
  | { kind: "clear" }
  | { kind: "keep_current" }
  | { kind: "media_asset"; mediaAssetId: string };

// --- Public types ---

export type ValidatedHomepageInput = {
  homepageId: string;
  heroTitle: string | null;
  heroText: string | null;
  heroImage: HomepageHeroImageSelection;
  editorialTitle: string | null;
  editorialText: string | null;
  featuredProducts: HomepageFeaturedProductSelection[];
  featuredCategories: HomepageFeaturedCategorySelection[];
  featuredBlogPosts: HomepageFeaturedBlogPostSelection[];
};

export type HomepageInputErrorCode =
  | "missing_homepage"
  | "invalid_hero_image"
  | "hero_title_too_long"
  | "hero_text_too_long"
  | "editorial_title_too_long"
  | "editorial_text_too_long"
  | "invalid_product_selection"
  | "invalid_product_sort_order"
  | "duplicate_product_sort_order"
  | "too_many_featured_products"
  | "invalid_category_selection"
  | "invalid_category_sort_order"
  | "duplicate_category_sort_order"
  | "too_many_featured_categories"
  | "invalid_blog_post_selection"
  | "invalid_blog_post_sort_order"
  | "duplicate_blog_post_sort_order"
  | "too_many_featured_blog_posts";

type HomepageInputSource = {
  homepageId: RawInputValue;
  heroTitle: RawInputValue;
  heroText: RawInputValue;
  heroImageMediaAssetId: RawInputValue;
  editorialTitle: RawInputValue;
  editorialText: RawInputValue;
  featuredProductIds: readonly RawInputValue[];
  featuredProductSortOrders: SelectionSortOrders;
  featuredCategoryIds: readonly RawInputValue[];
  featuredCategorySortOrders: SelectionSortOrders;
  featuredBlogPostIds: readonly RawInputValue[];
  featuredBlogPostSortOrders: SelectionSortOrders;
};

export type HomepageInputValidationResult =
  | { ok: true; data: ValidatedHomepageInput }
  | { ok: false; code: HomepageInputErrorCode };

type SelectionValidationOptions<TSelection> = {
  duplicateSortOrderCode: HomepageInputErrorCode;
  invalidSelectionCode: HomepageInputErrorCode;
  invalidSortOrderCode: HomepageInputErrorCode;
  selectedIds: readonly RawInputValue[];
  sortOrders: SelectionSortOrders;
  toSelection: (id: string, sortOrder: number) => TSelection;
};

// --- Internal utilities ---

function readTrimmedString(value: RawInputValue): string | null {
  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
}

function normalizeOptionalText(value: RawInputValue): string | null {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || normalizedValue.length === 0) {
    return null;
  }

  return normalizedValue;
}

function normalizeRequiredNumericId(value: RawInputValue): string | null {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || !/^[0-9]+$/.test(normalizedValue)) {
    return null;
  }

  return normalizedValue;
}

function normalizeSelectedIds(values: readonly RawInputValue[]): string[] | null {
  const normalizedIds: string[] = [];

  for (const value of values) {
    if (typeof value !== "string") {
      return null;
    }

    const normalizedValue = value.trim();

    if (!/^[0-9]+$/.test(normalizedValue)) {
      return null;
    }

    if (normalizedIds.includes(normalizedValue)) {
      return null;
    }

    normalizedIds.push(normalizedValue);
  }

  return normalizedIds;
}

function parseNonNegativeInteger(value: RawInputValue): number | null {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || normalizedValue.length === 0) {
    return null;
  }

  if (!/^\d+$/.test(normalizedValue)) {
    return null;
  }

  return Number(normalizedValue);
}

function validateSelections<TSelection>({
  duplicateSortOrderCode,
  invalidSelectionCode,
  invalidSortOrderCode,
  selectedIds,
  sortOrders,
  toSelection,
}: SelectionValidationOptions<TSelection>):
  | { ok: true; data: TSelection[] }
  | { ok: false; code: HomepageInputErrorCode } {
  const normalizedIds = normalizeSelectedIds(selectedIds);

  if (normalizedIds === null) {
    return { ok: false, code: invalidSelectionCode };
  }

  const seenSortOrders = new Set<number>();
  const validatedSelections: Array<{ id: string; sortOrder: number }> = [];

  for (const id of normalizedIds) {
    const sortOrder = parseNonNegativeInteger(sortOrders[id]);

    if (sortOrder === null) {
      return { ok: false, code: invalidSortOrderCode };
    }

    if (seenSortOrders.has(sortOrder)) {
      return { ok: false, code: duplicateSortOrderCode };
    }

    seenSortOrders.add(sortOrder);
    validatedSelections.push({ id, sortOrder });
  }

  validatedSelections.sort((left, right) => left.sortOrder - right.sortOrder);

  return {
    ok: true,
    data: validatedSelections.map((selection) => toSelection(selection.id, selection.sortOrder)),
  };
}

function validateHeroImageSelection(
  heroImageMediaAssetId: RawInputValue
): { ok: true; data: HomepageHeroImageSelection } | { ok: false; code: HomepageInputErrorCode } {
  const selection = readTrimmedString(heroImageMediaAssetId);

  if (selection === null || selection.length === 0) {
    return { ok: true, data: { kind: "clear" } };
  }

  if (selection === "__keep_current__") {
    return { ok: true, data: { kind: "keep_current" } };
  }

  if (!/^[0-9]+$/.test(selection)) {
    return { ok: false, code: "invalid_hero_image" };
  }

  return { ok: true, data: { kind: "media_asset", mediaAssetId: selection } };
}

// --- Public function ---

export function validateHomepageInput(input: HomepageInputSource): HomepageInputValidationResult {
  const homepageId = normalizeRequiredNumericId(input.homepageId);

  if (homepageId === null) {
    return { ok: false, code: "missing_homepage" };
  }

  const heroImage = validateHeroImageSelection(input.heroImageMediaAssetId);

  if (!heroImage.ok) {
    return heroImage;
  }

  const heroTitle = normalizeOptionalText(input.heroTitle);

  if (heroTitle !== null && heroTitle.length > HOMEPAGE_HERO_TITLE_MAX_LENGTH) {
    return { ok: false, code: "hero_title_too_long" };
  }

  const heroText = normalizeOptionalText(input.heroText);

  if (heroText !== null && heroText.length > HOMEPAGE_HERO_TEXT_MAX_LENGTH) {
    return { ok: false, code: "hero_text_too_long" };
  }

  const editorialTitle = normalizeOptionalText(input.editorialTitle);

  if (editorialTitle !== null && editorialTitle.length > HOMEPAGE_EDITORIAL_TITLE_MAX_LENGTH) {
    return { ok: false, code: "editorial_title_too_long" };
  }

  const editorialText = normalizeOptionalText(input.editorialText);

  if (editorialText !== null && editorialText.length > HOMEPAGE_EDITORIAL_TEXT_MAX_LENGTH) {
    return { ok: false, code: "editorial_text_too_long" };
  }

  if (input.featuredProductIds.length > HOMEPAGE_FEATURED_PRODUCTS_MAX_COUNT) {
    return { ok: false, code: "too_many_featured_products" };
  }

  const featuredProducts = validateSelections({
    selectedIds: input.featuredProductIds,
    sortOrders: input.featuredProductSortOrders,
    invalidSelectionCode: "invalid_product_selection",
    invalidSortOrderCode: "invalid_product_sort_order",
    duplicateSortOrderCode: "duplicate_product_sort_order",
    toSelection: (id, sortOrder) => ({ productId: id, sortOrder }),
  });

  if (!featuredProducts.ok) {
    return featuredProducts;
  }

  if (input.featuredCategoryIds.length > HOMEPAGE_FEATURED_CATEGORIES_MAX_COUNT) {
    return { ok: false, code: "too_many_featured_categories" };
  }

  const featuredCategories = validateSelections({
    selectedIds: input.featuredCategoryIds,
    sortOrders: input.featuredCategorySortOrders,
    invalidSelectionCode: "invalid_category_selection",
    invalidSortOrderCode: "invalid_category_sort_order",
    duplicateSortOrderCode: "duplicate_category_sort_order",
    toSelection: (id, sortOrder) => ({ categoryId: id, sortOrder }),
  });

  if (!featuredCategories.ok) {
    return featuredCategories;
  }

  if (input.featuredBlogPostIds.length > HOMEPAGE_FEATURED_BLOG_POSTS_MAX_COUNT) {
    return { ok: false, code: "too_many_featured_blog_posts" };
  }

  const featuredBlogPosts = validateSelections({
    selectedIds: input.featuredBlogPostIds,
    sortOrders: input.featuredBlogPostSortOrders,
    invalidSelectionCode: "invalid_blog_post_selection",
    invalidSortOrderCode: "invalid_blog_post_sort_order",
    duplicateSortOrderCode: "duplicate_blog_post_sort_order",
    toSelection: (id, sortOrder) => ({ blogPostId: id, sortOrder }),
  });

  if (!featuredBlogPosts.ok) {
    return featuredBlogPosts;
  }

  return {
    ok: true,
    data: {
      homepageId,
      heroTitle,
      heroText,
      heroImage: heroImage.data,
      editorialTitle,
      editorialText,
      featuredProducts: featuredProducts.data,
      featuredCategories: featuredCategories.data,
      featuredBlogPosts: featuredBlogPosts.data,
    },
  };
}
