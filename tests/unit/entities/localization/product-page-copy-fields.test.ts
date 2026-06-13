import { describe, expect, it } from "vitest";

import { PRODUCT_PAGE_COPY_FR } from "@/entities/languages/fr/product-page/product-page-copy_fr";
import {
  PRODUCT_PAGE_COPY_FIELDS,
  getProductPageCopyFrValue,
  withProductPageCopyOverrides,
} from "@/entities/localization/product-page-copy-fields";

describe("PRODUCT_PAGE_COPY_FIELDS", () => {
  it("has unique fieldName values", () => {
    const fieldNames = PRODUCT_PAGE_COPY_FIELDS.map((field) => field.fieldName);

    expect(new Set(fieldNames).size).toBe(fieldNames.length);
  });

  it("every fieldName resolves to a non-empty string in PRODUCT_PAGE_COPY_FR", () => {
    for (const field of PRODUCT_PAGE_COPY_FIELDS) {
      const value = getProductPageCopyFrValue(field.fieldName);

      expect(value).not.toBeNull();
      expect(typeof value).toBe("string");
      expect((value as string).length).toBeGreaterThan(0);
    }
  });

  it("every field has a non-empty label and group", () => {
    for (const field of PRODUCT_PAGE_COPY_FIELDS) {
      expect(field.label.length).toBeGreaterThan(0);
      expect(field.group.length).toBeGreaterThan(0);
    }
  });
});

describe("getProductPageCopyFrValue", () => {
  it("resolves a known dot-path", () => {
    expect(getProductPageCopyFrValue("editorial.eyebrow")).toBe("Savoir-faire");
  });

  it("returns null for an unknown top-level key", () => {
    expect(getProductPageCopyFrValue("unknown.field")).toBeNull();
  });

  it("returns null for an unknown nested key", () => {
    expect(getProductPageCopyFrValue("editorial.unknownField")).toBeNull();
  });

  it("returns null for a path that resolves to an object, not a string", () => {
    expect(getProductPageCopyFrValue("editorial")).toBeNull();
  });

  it("returns null for an empty fieldName", () => {
    expect(getProductPageCopyFrValue("")).toBeNull();
  });
});

describe("withProductPageCopyOverrides", () => {
  it("returns the same reference when overrides is empty", () => {
    expect(withProductPageCopyOverrides(PRODUCT_PAGE_COPY_FR, {})).toBe(PRODUCT_PAGE_COPY_FR);
  });

  it("overrides a known field without mutating the base dictionary", () => {
    const result = withProductPageCopyOverrides(PRODUCT_PAGE_COPY_FR, {
      "editorial.eyebrow": "Craftsmanship",
    });

    expect(result.editorial.eyebrow).toBe("Craftsmanship");
    expect(PRODUCT_PAGE_COPY_FR.editorial.eyebrow).toBe("Savoir-faire");
  });

  it("preserves untouched fields and groups", () => {
    const result = withProductPageCopyOverrides(PRODUCT_PAGE_COPY_FR, {
      "editorial.eyebrow": "Craftsmanship",
    });

    expect(result.heroBadges).toEqual(PRODUCT_PAGE_COPY_FR.heroBadges);
    expect(result.editorial.body).toBe(PRODUCT_PAGE_COPY_FR.editorial.body);
  });

  it("passes through a top-level scalar field (jsonLdDefaultDescription) unchanged", () => {
    const result = withProductPageCopyOverrides(PRODUCT_PAGE_COPY_FR, {
      "editorial.eyebrow": "Craftsmanship",
    });

    expect(result.jsonLdDefaultDescription).toBe(PRODUCT_PAGE_COPY_FR.jsonLdDefaultDescription);
  });

  it("ignores overrides for an unknown group", () => {
    const result = withProductPageCopyOverrides(PRODUCT_PAGE_COPY_FR, {
      "unknown.field": "value",
    });

    expect(result).toEqual(PRODUCT_PAGE_COPY_FR);
  });

  it("ignores overrides for an unknown key within a known group", () => {
    const result = withProductPageCopyOverrides(PRODUCT_PAGE_COPY_FR, {
      "editorial.unknownField": "value",
    });

    expect(result).toEqual(PRODUCT_PAGE_COPY_FR);
  });
});
