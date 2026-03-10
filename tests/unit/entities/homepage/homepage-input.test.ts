import { describe, expect, it } from "vitest";
import { validateHomepageInput } from "@/entities/homepage/homepage-input";

describe("validateHomepageInput", () => {
  it("valide une homepage nominale, trie les selections et conserve l'image hero actuelle", () => {
    const result = validateHomepageInput({
      homepageId: "7",
      heroTitle: "  Hero title  ",
      heroText: "  Hero text  ",
      currentHeroImagePath: "homepage/hero.jpg",
      heroImageMediaAssetId: "__keep_current__",
      editorialTitle: "  Editorial title  ",
      editorialText: "  Editorial text  ",
      featuredProductIds: ["11", "10"],
      featuredProductSortOrders: {
        "10": "0",
        "11": "2"
      },
      featuredCategoryIds: ["21"],
      featuredCategorySortOrders: {
        "21": "1"
      },
      featuredBlogPostIds: ["31", "30"],
      featuredBlogPostSortOrders: {
        "30": "1",
        "31": "0"
      }
    });

    expect(result).toEqual({
      ok: true,
      data: {
        homepageId: "7",
        heroTitle: "Hero title",
        heroText: "Hero text",
        heroImage: {
          kind: "keep_current",
          filePath: "homepage/hero.jpg"
        },
        editorialTitle: "Editorial title",
        editorialText: "Editorial text",
        featuredProducts: [
          {
            productId: "10",
            sortOrder: 0
          },
          {
            productId: "11",
            sortOrder: 2
          }
        ],
        featuredCategories: [
          {
            categoryId: "21",
            sortOrder: 1
          }
        ],
        featuredBlogPosts: [
          {
            blogPostId: "31",
            sortOrder: 0
          },
          {
            blogPostId: "30",
            sortOrder: 1
          }
        ]
      }
    });
  });

  it("accepte la suppression explicite de l'image hero et des selections vides", () => {
    const result = validateHomepageInput({
      homepageId: "7",
      heroTitle: " ",
      heroText: "",
      currentHeroImagePath: "homepage/hero.jpg",
      heroImageMediaAssetId: "",
      editorialTitle: " ",
      editorialText: "",
      featuredProductIds: [],
      featuredProductSortOrders: {},
      featuredCategoryIds: [],
      featuredCategorySortOrders: {},
      featuredBlogPostIds: [],
      featuredBlogPostSortOrders: {}
    });

    expect(result).toEqual({
      ok: true,
      data: {
        homepageId: "7",
        heroTitle: null,
        heroText: null,
        heroImage: {
          kind: "clear"
        },
        editorialTitle: null,
        editorialText: null,
        featuredProducts: [],
        featuredCategories: [],
        featuredBlogPosts: []
      }
    });
  });

  it("rejette une selection hero invalide", () => {
    expect(
      validateHomepageInput({
        homepageId: "7",
        heroTitle: null,
        heroText: null,
        currentHeroImagePath: null,
        heroImageMediaAssetId: "__keep_current__",
        editorialTitle: null,
        editorialText: null,
        featuredProductIds: [],
        featuredProductSortOrders: {},
        featuredCategoryIds: [],
        featuredCategorySortOrders: {},
        featuredBlogPostIds: [],
        featuredBlogPostSortOrders: {}
      })
    ).toEqual({
      ok: false,
      code: "invalid_hero_image"
    });
  });

  it("rejette des ordres dupliques dans les produits mis en avant", () => {
    expect(
      validateHomepageInput({
        homepageId: "7",
        heroTitle: null,
        heroText: null,
        currentHeroImagePath: null,
        heroImageMediaAssetId: "",
        editorialTitle: null,
        editorialText: null,
        featuredProductIds: ["10", "11"],
        featuredProductSortOrders: {
          "10": "0",
          "11": "0"
        },
        featuredCategoryIds: [],
        featuredCategorySortOrders: {},
        featuredBlogPostIds: [],
        featuredBlogPostSortOrders: {}
      })
    ).toEqual({
      ok: false,
      code: "duplicate_product_sort_order"
    });
  });

  it("rejette des ids invalides dans les categories mises en avant", () => {
    expect(
      validateHomepageInput({
        homepageId: "7",
        heroTitle: null,
        heroText: null,
        currentHeroImagePath: null,
        heroImageMediaAssetId: "",
        editorialTitle: null,
        editorialText: null,
        featuredProductIds: [],
        featuredProductSortOrders: {},
        featuredCategoryIds: ["cat-1"],
        featuredCategorySortOrders: {
          "cat-1": "0"
        },
        featuredBlogPostIds: [],
        featuredBlogPostSortOrders: {}
      })
    ).toEqual({
      ok: false,
      code: "invalid_category_selection"
    });
  });
});
