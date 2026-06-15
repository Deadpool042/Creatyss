import { describe, expect, it } from "vitest";

import { BOUTIQUE_PAGE_COPY_FR } from "@/entities/languages/fr/boutique-page/boutique-page-copy_fr";
import {
  BOUTIQUE_PAGE_COPY_FIELDS,
  getBoutiquePageCopyFrValue,
  withBoutiquePageCopyOverrides,
} from "@/entities/localization/boutique-page-copy-fields";

describe("BOUTIQUE_PAGE_COPY_FIELDS", () => {
  it("has unique fieldName values", () => {
    const fieldNames = BOUTIQUE_PAGE_COPY_FIELDS.map((field) => field.fieldName);

    expect(new Set(fieldNames).size).toBe(fieldNames.length);
  });

  it("every fieldName resolves to a non-empty string in BOUTIQUE_PAGE_COPY_FR", () => {
    for (const field of BOUTIQUE_PAGE_COPY_FIELDS) {
      const value = getBoutiquePageCopyFrValue(field.fieldName);

      expect(value).not.toBeNull();
      expect(typeof value).toBe("string");
      expect((value as string).length).toBeGreaterThan(0);
    }
  });

  it("every field has a non-empty label and group", () => {
    for (const field of BOUTIQUE_PAGE_COPY_FIELDS) {
      expect(field.label.length).toBeGreaterThan(0);
      expect(field.group.length).toBeGreaterThan(0);
    }
  });

  it("does not catalogue marketAside.events (placeholder array, hors périmètre)", () => {
    const fieldNames = BOUTIQUE_PAGE_COPY_FIELDS.map((field) => field.fieldName);

    expect(fieldNames.some((fieldName) => fieldName.startsWith("marketAside.events"))).toBe(false);
  });
});

describe("getBoutiquePageCopyFrValue", () => {
  it("resolves a known 2-level dot-path", () => {
    expect(getBoutiquePageCopyFrValue("header.intro")).toBe(BOUTIQUE_PAGE_COPY_FR.header.intro);
  });

  it("resolves a known 3-level dot-path", () => {
    expect(getBoutiquePageCopyFrValue("marketAside.uniqueBlock.title")).toBe(
      BOUTIQUE_PAGE_COPY_FR.marketAside.uniqueBlock.title
    );
  });

  it("returns null for an unknown top-level key", () => {
    expect(getBoutiquePageCopyFrValue("unknown.field")).toBeNull();
  });

  it("returns null for an unknown nested key", () => {
    expect(getBoutiquePageCopyFrValue("header.unknownField")).toBeNull();
  });

  it("returns null for a path that resolves to an object, not a string", () => {
    expect(getBoutiquePageCopyFrValue("header")).toBeNull();
    expect(getBoutiquePageCopyFrValue("marketAside.uniqueBlock")).toBeNull();
  });

  it("returns null for an empty fieldName", () => {
    expect(getBoutiquePageCopyFrValue("")).toBeNull();
  });
});

describe("withBoutiquePageCopyOverrides", () => {
  it("returns the same reference when overrides is empty", () => {
    expect(withBoutiquePageCopyOverrides(BOUTIQUE_PAGE_COPY_FR, {})).toBe(BOUTIQUE_PAGE_COPY_FR);
  });

  it("overrides a known 2-level field without mutating the base dictionary", () => {
    const result = withBoutiquePageCopyOverrides(BOUTIQUE_PAGE_COPY_FR, {
      "header.intro": "Hand-stitched in Saint-Étienne.",
    });

    expect(result.header.intro).toBe("Hand-stitched in Saint-Étienne.");
    expect(BOUTIQUE_PAGE_COPY_FR.header.intro).not.toBe("Hand-stitched in Saint-Étienne.");
  });

  it("overrides a known 3-level field without mutating the base dictionary", () => {
    const result = withBoutiquePageCopyOverrides(BOUTIQUE_PAGE_COPY_FR, {
      "marketAside.uniqueBlock.title": "Handmade one-of-a-kind pieces",
    });

    expect(result.marketAside.uniqueBlock.title).toBe("Handmade one-of-a-kind pieces");
    expect(BOUTIQUE_PAGE_COPY_FR.marketAside.uniqueBlock.title).not.toBe(
      "Handmade one-of-a-kind pieces"
    );
  });

  it("preserves untouched fields, groups, and marketAside.events (hors catalogue)", () => {
    const result = withBoutiquePageCopyOverrides(BOUTIQUE_PAGE_COPY_FR, {
      "marketAside.uniqueBlock.title": "Handmade one-of-a-kind pieces",
    });

    expect(result.header).toEqual(BOUTIQUE_PAGE_COPY_FR.header);
    expect(result.engagements).toEqual(BOUTIQUE_PAGE_COPY_FR.engagements);
    expect(result.marketAside.events).toEqual(BOUTIQUE_PAGE_COPY_FR.marketAside.events);
    expect(result.marketAside.uniqueBlock.body).toBe(BOUTIQUE_PAGE_COPY_FR.marketAside.uniqueBlock.body);
  });

  it("ignores overrides for an unknown group", () => {
    const result = withBoutiquePageCopyOverrides(BOUTIQUE_PAGE_COPY_FR, {
      "unknown.field": "value",
    });

    expect(result).toEqual(BOUTIQUE_PAGE_COPY_FR);
  });

  it("ignores overrides for an unknown key within a known group", () => {
    const result = withBoutiquePageCopyOverrides(BOUTIQUE_PAGE_COPY_FR, {
      "header.unknownField": "value",
    });

    expect(result).toEqual(BOUTIQUE_PAGE_COPY_FR);
  });

  it("ignores overrides targeting marketAside.events (hors catalogue)", () => {
    const result = withBoutiquePageCopyOverrides(BOUTIQUE_PAGE_COPY_FR, {
      "marketAside.events.name": "value",
    });

    expect(result).toEqual(BOUTIQUE_PAGE_COPY_FR);
  });
});
