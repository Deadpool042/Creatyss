import { describe, expect, it } from "vitest";
import {
  HOMEPAGE_EDITORIAL_TEXT_MAX_LENGTH,
  HOMEPAGE_EDITORIAL_TITLE_MAX_LENGTH,
  HOMEPAGE_FEATURED_BLOG_POSTS_MAX_COUNT,
  HOMEPAGE_FEATURED_CATEGORIES_MAX_COUNT,
  HOMEPAGE_FEATURED_PRODUCTS_MAX_COUNT,
  HOMEPAGE_HERO_TEXT_MAX_LENGTH,
  HOMEPAGE_HERO_TITLE_MAX_LENGTH,
  validateHomepageInput,
} from "@/entities/homepage/homepage-input";

describe("validateHomepageInput", () => {
  it("valide une homepage nominale, trie les selections et conserve l'image hero actuelle", () => {
    const result = validateHomepageInput({
      homepageId: "7",
      heroTitle: "  Hero title  ",
      heroText: "  Hero text  ",
      heroImageMediaAssetId: "__keep_current__",
      editorialTitle: "  Editorial title  ",
      editorialText: "  Editorial text  ",
      featuredProductIds: ["11", "10"],
      featuredProductSortOrders: {
        "10": "0",
        "11": "2",
      },
      featuredCategoryIds: ["21"],
      featuredCategorySortOrders: {
        "21": "1",
      },
      featuredBlogPostIds: ["31", "30"],
      featuredBlogPostSortOrders: {
        "30": "1",
        "31": "0",
      },
    });

    expect(result).toEqual({
      ok: true,
      data: {
        homepageId: "7",
        heroTitle: "Hero title",
        heroText: "Hero text",
        heroImage: {
          kind: "keep_current",
        },
        editorialTitle: "Editorial title",
        editorialText: "Editorial text",
        featuredProducts: [
          {
            productId: "10",
            sortOrder: 0,
          },
          {
            productId: "11",
            sortOrder: 2,
          },
        ],
        featuredCategories: [
          {
            categoryId: "21",
            sortOrder: 1,
          },
        ],
        featuredBlogPosts: [
          {
            blogPostId: "31",
            sortOrder: 0,
          },
          {
            blogPostId: "30",
            sortOrder: 1,
          },
        ],
      },
    });
  });

  it("accepte la suppression explicite de l'image hero et des selections vides", () => {
    const result = validateHomepageInput({
      homepageId: "7",
      heroTitle: " ",
      heroText: "",
      heroImageMediaAssetId: "",
      editorialTitle: " ",
      editorialText: "",
      featuredProductIds: [],
      featuredProductSortOrders: {},
      featuredCategoryIds: [],
      featuredCategorySortOrders: {},
      featuredBlogPostIds: [],
      featuredBlogPostSortOrders: {},
    });

    expect(result).toEqual({
      ok: true,
      data: {
        homepageId: "7",
        heroTitle: null,
        heroText: null,
        heroImage: {
          kind: "clear",
        },
        editorialTitle: null,
        editorialText: null,
        featuredProducts: [],
        featuredCategories: [],
        featuredBlogPosts: [],
      },
    });
  });

  it("rejette une valeur heroImageMediaAssetId invalide", () => {
    expect(
      validateHomepageInput({
        homepageId: "7",
        heroTitle: null,
        heroText: null,
        heroImageMediaAssetId: "not-a-valid-value",
        editorialTitle: null,
        editorialText: null,
        featuredProductIds: [],
        featuredProductSortOrders: {},
        featuredCategoryIds: [],
        featuredCategorySortOrders: {},
        featuredBlogPostIds: [],
        featuredBlogPostSortOrders: {},
      })
    ).toEqual({
      ok: false,
      code: "invalid_hero_image",
    });
  });

  it("rejette des ordres dupliques dans les produits mis en avant", () => {
    expect(
      validateHomepageInput({
        homepageId: "7",
        heroTitle: null,
        heroText: null,
        heroImageMediaAssetId: "",
        editorialTitle: null,
        editorialText: null,
        featuredProductIds: ["10", "11"],
        featuredProductSortOrders: {
          "10": "0",
          "11": "0",
        },
        featuredCategoryIds: [],
        featuredCategorySortOrders: {},
        featuredBlogPostIds: [],
        featuredBlogPostSortOrders: {},
      })
    ).toEqual({
      ok: false,
      code: "duplicate_product_sort_order",
    });
  });

  it("rejette des ids invalides dans les categories mises en avant", () => {
    expect(
      validateHomepageInput({
        homepageId: "7",
        heroTitle: null,
        heroText: null,
        heroImageMediaAssetId: "",
        editorialTitle: null,
        editorialText: null,
        featuredProductIds: [],
        featuredProductSortOrders: {},
        featuredCategoryIds: ["cat-1"],
        featuredCategorySortOrders: {
          "cat-1": "0",
        },
        featuredBlogPostIds: [],
        featuredBlogPostSortOrders: {},
      })
    ).toEqual({
      ok: false,
      code: "invalid_category_selection",
    });
  });

  it("rejette un heroTitle trop long", () => {
    expect(
      validateHomepageInput({
        homepageId: "7",
        heroTitle: "a".repeat(HOMEPAGE_HERO_TITLE_MAX_LENGTH + 1),
        heroText: null,
        heroImageMediaAssetId: "",
        editorialTitle: null,
        editorialText: null,
        featuredProductIds: [],
        featuredProductSortOrders: {},
        featuredCategoryIds: [],
        featuredCategorySortOrders: {},
        featuredBlogPostIds: [],
        featuredBlogPostSortOrders: {},
      })
    ).toEqual({
      ok: false,
      code: "hero_title_too_long",
    });
  });

  it("rejette un heroText trop long", () => {
    expect(
      validateHomepageInput({
        homepageId: "7",
        heroTitle: null,
        heroText: "a".repeat(HOMEPAGE_HERO_TEXT_MAX_LENGTH + 1),
        heroImageMediaAssetId: "",
        editorialTitle: null,
        editorialText: null,
        featuredProductIds: [],
        featuredProductSortOrders: {},
        featuredCategoryIds: [],
        featuredCategorySortOrders: {},
        featuredBlogPostIds: [],
        featuredBlogPostSortOrders: {},
      })
    ).toEqual({
      ok: false,
      code: "hero_text_too_long",
    });
  });

  it("rejette un editorialTitle trop long", () => {
    expect(
      validateHomepageInput({
        homepageId: "7",
        heroTitle: null,
        heroText: null,
        heroImageMediaAssetId: "",
        editorialTitle: "a".repeat(HOMEPAGE_EDITORIAL_TITLE_MAX_LENGTH + 1),
        editorialText: null,
        featuredProductIds: [],
        featuredProductSortOrders: {},
        featuredCategoryIds: [],
        featuredCategorySortOrders: {},
        featuredBlogPostIds: [],
        featuredBlogPostSortOrders: {},
      })
    ).toEqual({
      ok: false,
      code: "editorial_title_too_long",
    });
  });

  it("rejette un editorialText trop long", () => {
    expect(
      validateHomepageInput({
        homepageId: "7",
        heroTitle: null,
        heroText: null,
        heroImageMediaAssetId: "",
        editorialTitle: null,
        editorialText: "a".repeat(HOMEPAGE_EDITORIAL_TEXT_MAX_LENGTH + 1),
        featuredProductIds: [],
        featuredProductSortOrders: {},
        featuredCategoryIds: [],
        featuredCategorySortOrders: {},
        featuredBlogPostIds: [],
        featuredBlogPostSortOrders: {},
      })
    ).toEqual({
      ok: false,
      code: "editorial_text_too_long",
    });
  });

  it("rejette une liste de produits depassant la cardinalite maximale", () => {
    const ids = Array.from({ length: HOMEPAGE_FEATURED_PRODUCTS_MAX_COUNT + 1 }, (_, i) =>
      String(i + 1)
    );
    const sortOrders = Object.fromEntries(ids.map((id, i) => [id, String(i)]));

    expect(
      validateHomepageInput({
        homepageId: "7",
        heroTitle: null,
        heroText: null,
        heroImageMediaAssetId: "",
        editorialTitle: null,
        editorialText: null,
        featuredProductIds: ids,
        featuredProductSortOrders: sortOrders,
        featuredCategoryIds: [],
        featuredCategorySortOrders: {},
        featuredBlogPostIds: [],
        featuredBlogPostSortOrders: {},
      })
    ).toEqual({
      ok: false,
      code: "too_many_featured_products",
    });
  });

  it("rejette une liste de categories depassant la cardinalite maximale", () => {
    const ids = Array.from({ length: HOMEPAGE_FEATURED_CATEGORIES_MAX_COUNT + 1 }, (_, i) =>
      String(i + 1)
    );
    const sortOrders = Object.fromEntries(ids.map((id, i) => [id, String(i)]));

    expect(
      validateHomepageInput({
        homepageId: "7",
        heroTitle: null,
        heroText: null,
        heroImageMediaAssetId: "",
        editorialTitle: null,
        editorialText: null,
        featuredProductIds: [],
        featuredProductSortOrders: {},
        featuredCategoryIds: ids,
        featuredCategorySortOrders: sortOrders,
        featuredBlogPostIds: [],
        featuredBlogPostSortOrders: {},
      })
    ).toEqual({
      ok: false,
      code: "too_many_featured_categories",
    });
  });

  it("rejette une liste d'articles depassant la cardinalite maximale", () => {
    const ids = Array.from({ length: HOMEPAGE_FEATURED_BLOG_POSTS_MAX_COUNT + 1 }, (_, i) =>
      String(i + 1)
    );
    const sortOrders = Object.fromEntries(ids.map((id, i) => [id, String(i)]));

    expect(
      validateHomepageInput({
        homepageId: "7",
        heroTitle: null,
        heroText: null,
        heroImageMediaAssetId: "",
        editorialTitle: null,
        editorialText: null,
        featuredProductIds: [],
        featuredProductSortOrders: {},
        featuredCategoryIds: [],
        featuredCategorySortOrders: {},
        featuredBlogPostIds: ids,
        featuredBlogPostSortOrders: sortOrders,
      })
    ).toEqual({
      ok: false,
      code: "too_many_featured_blog_posts",
    });
  });
});
