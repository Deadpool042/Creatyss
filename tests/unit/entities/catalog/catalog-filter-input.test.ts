import { describe, expect, it } from "vitest";
import {
  CATALOG_AVAILABILITY_FILTER_VALUE,
  validateCatalogFilterInput
} from "@/entities/catalog/catalog-filter-input";

describe("validateCatalogFilterInput", () => {
  it("normalise un slug de categorie simple", () => {
    expect(
      validateCatalogFilterInput({
        category: "  Edition-Atelier  ",
        availability: null
      })
    ).toEqual({
      categorySlug: "edition-atelier",
      onlyAvailable: false
    });
  });

  it("convertit une categorie vide en null", () => {
    expect(
      validateCatalogFilterInput({
        category: "   ",
        availability: null
      })
    ).toEqual({
      categorySlug: null,
      onlyAvailable: false
    });
  });

  it("active le filtre disponibilite uniquement pour la valeur attendue", () => {
    expect(
      validateCatalogFilterInput({
        category: null,
        availability: CATALOG_AVAILABILITY_FILTER_VALUE
      })
    ).toEqual({
      categorySlug: null,
      onlyAvailable: true
    });
  });

  it("ignore une valeur de disponibilite inconnue", () => {
    expect(
      validateCatalogFilterInput({
        category: null,
        availability: "yes"
      })
    ).toEqual({
      categorySlug: null,
      onlyAvailable: false
    });
  });
});
