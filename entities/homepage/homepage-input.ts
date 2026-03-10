import type {
  AdminHomepageFeaturedBlogPostSelection,
  AdminHomepageFeaturedCategorySelection,
  AdminHomepageFeaturedProductSelection
} from "@/db/repositories/admin-homepage.repository";

type RawInputValue = FormDataEntryValue | string | null | undefined;

type SelectionSortOrders = Readonly<Record<string, RawInputValue>>;

type HomepageHeroImageSelection =
  | {
      kind: "clear";
    }
  | {
      kind: "keep_current";
      filePath: string;
    }
  | {
      kind: "media_asset";
      mediaAssetId: string;
    };

export type ValidatedHomepageInput = {
  homepageId: string;
  heroTitle: string | null;
  heroText: string | null;
  heroImage: HomepageHeroImageSelection;
  editorialTitle: string | null;
  editorialText: string | null;
  featuredProducts: AdminHomepageFeaturedProductSelection[];
  featuredCategories: AdminHomepageFeaturedCategorySelection[];
  featuredBlogPosts: AdminHomepageFeaturedBlogPostSelection[];
};

export type HomepageInputErrorCode =
  | "missing_homepage"
  | "invalid_hero_image"
  | "invalid_product_selection"
  | "invalid_product_sort_order"
  | "duplicate_product_sort_order"
  | "invalid_category_selection"
  | "invalid_category_sort_order"
  | "duplicate_category_sort_order"
  | "invalid_blog_post_selection"
  | "invalid_blog_post_sort_order"
  | "duplicate_blog_post_sort_order";

type HomepageInputSource = {
  homepageId: RawInputValue;
  heroTitle: RawInputValue;
  heroText: RawInputValue;
  currentHeroImagePath: RawInputValue;
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
  | {
      ok: true;
      data: ValidatedHomepageInput;
    }
  | {
      ok: false;
      code: HomepageInputErrorCode;
    };

type SelectionValidationOptions<TSelection> = {
  duplicateSortOrderCode: HomepageInputErrorCode;
  invalidSelectionCode: HomepageInputErrorCode;
  invalidSortOrderCode: HomepageInputErrorCode;
  selectedIds: readonly RawInputValue[];
  sortOrders: SelectionSortOrders;
  toSelection: (id: string, sortOrder: number) => TSelection;
};

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

function normalizeSelectedIds(
  values: readonly RawInputValue[]
): string[] | null {
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
  toSelection
}: SelectionValidationOptions<TSelection>):
  | {
      ok: true;
      data: TSelection[];
    }
  | {
      ok: false;
      code: HomepageInputErrorCode;
    } {
  const normalizedIds = normalizeSelectedIds(selectedIds);

  if (normalizedIds === null) {
    return {
      ok: false,
      code: invalidSelectionCode
    };
  }

  const seenSortOrders = new Set<number>();
  const validatedSelections: Array<{
    id: string;
    sortOrder: number;
  }> = [];

  for (const id of normalizedIds) {
    const sortOrder = parseNonNegativeInteger(sortOrders[id]);

    if (sortOrder === null) {
      return {
        ok: false,
        code: invalidSortOrderCode
      };
    }

    if (seenSortOrders.has(sortOrder)) {
      return {
        ok: false,
        code: duplicateSortOrderCode
      };
    }

    seenSortOrders.add(sortOrder);
    validatedSelections.push({ id, sortOrder });
  }

  validatedSelections.sort((left, right) => left.sortOrder - right.sortOrder);

  return {
    ok: true,
    data: validatedSelections.map((selection) =>
      toSelection(selection.id, selection.sortOrder)
    )
  };
}

function validateHeroImageSelection(
  currentHeroImagePath: RawInputValue,
  heroImageMediaAssetId: RawInputValue
):
  | {
      ok: true;
      data: HomepageHeroImageSelection;
    }
  | {
      ok: false;
      code: HomepageInputErrorCode;
    } {
  const currentPath = normalizeOptionalText(currentHeroImagePath);
  const selection = readTrimmedString(heroImageMediaAssetId);

  if (selection === null || selection.length === 0) {
    return {
      ok: true,
      data: {
        kind: "clear"
      }
    };
  }

  if (selection === "__keep_current__") {
    if (currentPath === null) {
      return {
        ok: false,
        code: "invalid_hero_image"
      };
    }

    return {
      ok: true,
      data: {
        kind: "keep_current",
        filePath: currentPath
      }
    };
  }

  if (!/^[0-9]+$/.test(selection)) {
    return {
      ok: false,
      code: "invalid_hero_image"
    };
  }

  return {
    ok: true,
    data: {
      kind: "media_asset",
      mediaAssetId: selection
    }
  };
}

export function validateHomepageInput(
  input: HomepageInputSource
): HomepageInputValidationResult {
  const homepageId = normalizeRequiredNumericId(input.homepageId);

  if (homepageId === null) {
    return {
      ok: false,
      code: "missing_homepage"
    };
  }

  const heroImage = validateHeroImageSelection(
    input.currentHeroImagePath,
    input.heroImageMediaAssetId
  );

  if (!heroImage.ok) {
    return heroImage;
  }

  const featuredProducts = validateSelections({
    selectedIds: input.featuredProductIds,
    sortOrders: input.featuredProductSortOrders,
    invalidSelectionCode: "invalid_product_selection",
    invalidSortOrderCode: "invalid_product_sort_order",
    duplicateSortOrderCode: "duplicate_product_sort_order",
    toSelection: (id, sortOrder) => ({
      productId: id,
      sortOrder
    })
  });

  if (!featuredProducts.ok) {
    return featuredProducts;
  }

  const featuredCategories = validateSelections({
    selectedIds: input.featuredCategoryIds,
    sortOrders: input.featuredCategorySortOrders,
    invalidSelectionCode: "invalid_category_selection",
    invalidSortOrderCode: "invalid_category_sort_order",
    duplicateSortOrderCode: "duplicate_category_sort_order",
    toSelection: (id, sortOrder) => ({
      categoryId: id,
      sortOrder
    })
  });

  if (!featuredCategories.ok) {
    return featuredCategories;
  }

  const featuredBlogPosts = validateSelections({
    selectedIds: input.featuredBlogPostIds,
    sortOrders: input.featuredBlogPostSortOrders,
    invalidSelectionCode: "invalid_blog_post_selection",
    invalidSortOrderCode: "invalid_blog_post_sort_order",
    duplicateSortOrderCode: "duplicate_blog_post_sort_order",
    toSelection: (id, sortOrder) => ({
      blogPostId: id,
      sortOrder
    })
  });

  if (!featuredBlogPosts.ok) {
    return featuredBlogPosts;
  }

  return {
    ok: true,
    data: {
      homepageId,
      heroTitle: normalizeOptionalText(input.heroTitle),
      heroText: normalizeOptionalText(input.heroText),
      heroImage: heroImage.data,
      editorialTitle: normalizeOptionalText(input.editorialTitle),
      editorialText: normalizeOptionalText(input.editorialText),
      featuredProducts: featuredProducts.data,
      featuredCategories: featuredCategories.data,
      featuredBlogPosts: featuredBlogPosts.data
    }
  };
}
