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
        shippingReturnsPolicy: null,
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
        shippingReturnsPolicy: null,
      },
    });
  });

  // Contrat actuel : l'identifiant d'image hero est une chaîne libre non vide
  // (la validation d'existence du media asset se fait en aval).
  it("accepte un identifiant d'image hero libre", () => {
    expect(
      validateHomepageInput({
        homepageId: "7",
        heroTitle: null,
        heroText: null,
        heroImageMediaAssetId: "media-asset-1",
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
      ok: true,
      data: {
        homepageId: "7",
        heroTitle: null,
        heroText: null,
        heroImage: {
          kind: "media_asset",
          mediaAssetId: "media-asset-1",
        },
        editorialTitle: null,
        editorialText: null,
        featuredProducts: [],
        featuredCategories: [],
        featuredBlogPosts: [],
        shippingReturnsPolicy: null,
      },
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

  // Contrat actuel : les ids de sélection sont des chaînes libres ;
  // l'invalidité porte sur les ids vides (après trim) ou non-string.
  it("rejette des ids vides dans les categories mises en avant", () => {
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
        featuredCategoryIds: ["  "],
        featuredCategorySortOrders: {},
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
