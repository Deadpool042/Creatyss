import { describe, expect, it } from "vitest";
import {
  normalizeProductSlug,
  validateProductInput
} from "@/entities/product/product-input";

describe("normalizeProductSlug", () => {
  it("normalise le slug produit", () => {
    expect(normalizeProductSlug("  Sac Camel / Édition Atelier  ")).toBe(
      "sac-camel-edition-atelier"
    );
  });
});

describe("validateProductInput", () => {
  it("valide un produit nominal, dedupe les categories et nettoie les optionnels", () => {
    const result = validateProductInput({
      name: "  Sac Camel  ",
      slug: "  Sac Camel / Édition Atelier  ",
      shortDescription: "  Description courte  ",
      description: "  Description longue  ",
      seoTitle: "  SEO title  ",
      seoDescription: "  SEO description  ",
      status: "published",
      isFeatured: "1",
      categoryIds: ["1", "2", "1"]
    });

    expect(result).toEqual({
      ok: true,
      data: {
        name: "Sac Camel",
        slug: "sac-camel-edition-atelier",
        shortDescription: "Description courte",
        description: "Description longue",
        seoTitle: "SEO title",
        seoDescription: "SEO description",
        status: "published",
        isFeatured: true,
        categoryIds: ["1", "2"]
      }
    });
  });

  it("convertit les champs optionnels vides en null et accepte aucune categorie", () => {
    const result = validateProductInput({
      name: "Produit",
      slug: "produit",
      shortDescription: "  ",
      description: null,
      seoTitle: "",
      seoDescription: undefined,
      status: "draft",
      isFeatured: null,
      categoryIds: undefined
    });

    expect(result).toEqual({
      ok: true,
      data: {
        name: "Produit",
        slug: "produit",
        shortDescription: null,
        description: null,
        seoTitle: null,
        seoDescription: null,
        status: "draft",
        isFeatured: false,
        categoryIds: []
      }
    });
  });

  it("rejette un statut invalide", () => {
    expect(
      validateProductInput({
        name: "Produit",
        slug: "produit",
        shortDescription: null,
        description: null,
        seoTitle: null,
        seoDescription: null,
        status: "archived",
        isFeatured: null,
        categoryIds: []
      })
    ).toEqual({
      ok: false,
      code: "invalid_status"
    });
  });

  it("rejette des ids de categories invalides", () => {
    expect(
      validateProductInput({
        name: "Produit",
        slug: "produit",
        shortDescription: null,
        description: null,
        seoTitle: null,
        seoDescription: null,
        status: "draft",
        isFeatured: null,
        categoryIds: ["1", "abc"]
      })
    ).toEqual({
      ok: false,
      code: "invalid_category_ids"
    });
  });
});
