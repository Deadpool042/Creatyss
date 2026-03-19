import { describe, expect, it } from "vitest";
import {
  MAX_CATALOG_SEARCH_QUERY_LENGTH,
  normalizeCatalogSearchQuery,
  validateCatalogSearchQuery,
} from "@/entities/catalog/catalog-search-input";

describe("normalizeCatalogSearchQuery", () => {
  it("trim la requete et reduit les espaces multiples", () => {
    expect(normalizeCatalogSearchQuery("  sac   bandouliere  ")).toBe("sac bandouliere");
  });

  it("convertit une requete vide en null", () => {
    expect(normalizeCatalogSearchQuery("   ")).toBeNull();
    expect(normalizeCatalogSearchQuery(null)).toBeNull();
  });
});

describe("validateCatalogSearchQuery", () => {
  it("retourne une requete nominale normalisee", () => {
    expect(validateCatalogSearchQuery("  Sable  ")).toBe("Sable");
  });

  it("borne la longueur maximale de la requete", () => {
    const longQuery = "a".repeat(MAX_CATALOG_SEARCH_QUERY_LENGTH + 25);

    expect(validateCatalogSearchQuery(longQuery)).toBe("a".repeat(MAX_CATALOG_SEARCH_QUERY_LENGTH));
  });
});
