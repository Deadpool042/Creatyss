import { describe, expect, it } from "vitest";

import { HOMEPAGE_COPY_FR } from "@/entities/languages/fr/homepage/homepage-copy_fr";
import {
  HOMEPAGE_COPY_FIELDS,
  getHomepageCopyFrValue,
  withHomepageCopyOverrides,
} from "@/entities/localization/homepage-copy-fields";

describe("HOMEPAGE_COPY_FIELDS", () => {
  it("has unique fieldName values", () => {
    const fieldNames = HOMEPAGE_COPY_FIELDS.map((field) => field.fieldName);

    expect(new Set(fieldNames).size).toBe(fieldNames.length);
  });

  it("every fieldName resolves to a non-empty string in HOMEPAGE_COPY_FR", () => {
    for (const field of HOMEPAGE_COPY_FIELDS) {
      const value = getHomepageCopyFrValue(field.fieldName);

      expect(value).not.toBeNull();
      expect(typeof value).toBe("string");
      expect((value as string).length).toBeGreaterThan(0);
    }
  });

  it("every field has a non-empty label and group", () => {
    for (const field of HOMEPAGE_COPY_FIELDS) {
      expect(field.label.length).toBeGreaterThan(0);
      expect(field.group.length).toBeGreaterThan(0);
    }
  });
});

describe("getHomepageCopyFrValue", () => {
  it("resolves a known dot-path", () => {
    expect(getHomepageCopyFrValue("collections.eyebrow")).toBe("L'univers Creatyss");
  });

  it("returns null for an unknown top-level key", () => {
    expect(getHomepageCopyFrValue("unknown.field")).toBeNull();
  });

  it("returns null for an unknown nested key", () => {
    expect(getHomepageCopyFrValue("hero.unknownField")).toBeNull();
  });

  it("returns null for a path that resolves to an object, not a string", () => {
    expect(getHomepageCopyFrValue("hero")).toBeNull();
  });

  it("returns null for an empty fieldName", () => {
    expect(getHomepageCopyFrValue("")).toBeNull();
  });
});

describe("withHomepageCopyOverrides", () => {
  it("returns the same reference when overrides is empty", () => {
    expect(withHomepageCopyOverrides(HOMEPAGE_COPY_FR, {})).toBe(HOMEPAGE_COPY_FR);
  });

  it("overrides a known field without mutating the base dictionary", () => {
    const result = withHomepageCopyOverrides(HOMEPAGE_COPY_FR, {
      "collections.eyebrow": "The Creatyss universe",
    });

    expect(result.collections.eyebrow).toBe("The Creatyss universe");
    expect(HOMEPAGE_COPY_FR.collections.eyebrow).toBe("L'univers Creatyss");
  });

  it("preserves untouched fields and groups", () => {
    const result = withHomepageCopyOverrides(HOMEPAGE_COPY_FR, {
      "collections.eyebrow": "The Creatyss universe",
    });

    expect(result.hero.fallbackText).toBe(HOMEPAGE_COPY_FR.hero.fallbackText);
    expect(result.about).toEqual(HOMEPAGE_COPY_FR.about);
  });

  it("ignores overrides for an unknown group", () => {
    const result = withHomepageCopyOverrides(HOMEPAGE_COPY_FR, {
      "unknown.field": "value",
    });

    expect(result).toEqual(HOMEPAGE_COPY_FR);
  });

  it("ignores overrides for an unknown key within a known group", () => {
    const result = withHomepageCopyOverrides(HOMEPAGE_COPY_FR, {
      "hero.unknownField": "value",
    });

    expect(result).toEqual(HOMEPAGE_COPY_FR);
  });
});
