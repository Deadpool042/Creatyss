import { describe, expect, it } from "vitest";
import {
  normalizeCategorySlug,
  validateCategoryInput
} from "@/entities/category/category-input";

describe("normalizeCategorySlug", () => {
  it("normalise un slug avec accents, espaces et ponctuation", () => {
    expect(normalizeCategorySlug("  Été 2026 / Sacs !  ")).toBe("ete-2026-sacs");
  });
});

describe("validateCategoryInput", () => {
  it("valide une categorie nominale et normalise les champs", () => {
    const result = validateCategoryInput({
      name: "  Sacs iconiques  ",
      slug: "  Été 2026 / Sacs !  ",
      description: "  Collection phare  ",
      isFeatured: "on"
    });

    expect(result).toEqual({
      ok: true,
      data: {
        name: "Sacs iconiques",
        slug: "ete-2026-sacs",
        description: "Collection phare",
        isFeatured: true
      }
    });
  });

  it("convertit une description vide en null et un flag absent en false", () => {
    const result = validateCategoryInput({
      name: "Categorie",
      slug: "categorie",
      description: "   ",
      isFeatured: null
    });

    expect(result).toEqual({
      ok: true,
      data: {
        name: "Categorie",
        slug: "categorie",
        description: null,
        isFeatured: false
      }
    });
  });

  it("rejette un nom manquant", () => {
    expect(
      validateCategoryInput({
        name: "   ",
        slug: "categorie",
        description: null,
        isFeatured: null
      })
    ).toEqual({
      ok: false,
      code: "missing_name"
    });
  });

  it("rejette un slug qui devient vide apres normalisation", () => {
    expect(
      validateCategoryInput({
        name: "Categorie",
        slug: "!!!",
        description: null,
        isFeatured: null
      })
    ).toEqual({
      ok: false,
      code: "invalid_slug"
    });
  });
});
