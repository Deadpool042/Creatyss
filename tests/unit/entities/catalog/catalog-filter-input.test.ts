import { describe, expect, it } from "vitest";
import {
  CATALOG_AVAILABILITY_FILTER_VALUE,
  validateCatalogFilterInput,
} from "@/entities/catalog/catalog-filter-input";

describe("validateCatalogFilterInput", () => {
  it("normalise un tableau de slugs de categorie", () => {
    expect(
      validateCatalogFilterInput({
        categories: ["  Edition-Atelier  ", "CAPSULE"],
        availability: null,
      })
    ).toEqual({
      categorySlugs: ["edition-atelier", "capsule"],
      availabilityStatus: null,
      minPriceCents: null,
      maxPriceCents: null,
    });
  });

  it("filtre les slugs vides", () => {
    expect(
      validateCatalogFilterInput({
        categories: ["   ", "", "capsule"],
        availability: null,
      })
    ).toEqual({
      categorySlugs: ["capsule"],
      availabilityStatus: null,
      minPriceCents: null,
      maxPriceCents: null,
    });
  });

  it("retourne un tableau vide pour des categories toutes vides", () => {
    expect(
      validateCatalogFilterInput({
        categories: ["   ", ""],
        availability: null,
      })
    ).toEqual({
      categorySlugs: [],
      availabilityStatus: null,
      minPriceCents: null,
      maxPriceCents: null,
    });
  });

  it("active le filtre disponibilite uniquement pour la valeur attendue", () => {
    expect(
      validateCatalogFilterInput({
        categories: [],
        availability: CATALOG_AVAILABILITY_FILTER_VALUE,
      })
    ).toEqual({
      categorySlugs: [],
      availabilityStatus: "in-stock",
      minPriceCents: null,
      maxPriceCents: null,
    });
  });

  it("ignore une valeur de disponibilite inconnue", () => {
    expect(
      validateCatalogFilterInput({
        categories: [],
        availability: "yes",
      })
    ).toEqual({
      categorySlugs: [],
      availabilityStatus: null,
      minPriceCents: null,
      maxPriceCents: null,
    });
  });
});
