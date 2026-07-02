import { describe, expect, it } from "vitest";

import { CONTENT_PAGES_COPY_FR } from "@/entities/languages/fr/content-pages/content-pages-copy_fr";
import {
  LES_MARCHES_PAGE_COPY_FIELDS,
  getLesMarchesPageCopyFrValue,
  withLesMarchesPageCopyOverrides,
} from "@/entities/localization/les-marches-page-copy-fields";

describe("LES_MARCHES_PAGE_COPY_FIELDS", () => {
  it("has unique fieldName values", () => {
    const fieldNames = LES_MARCHES_PAGE_COPY_FIELDS.map((field) => field.fieldName);

    expect(new Set(fieldNames).size).toBe(fieldNames.length);
  });

  it("every fieldName resolves to a non-empty string", () => {
    for (const field of LES_MARCHES_PAGE_COPY_FIELDS) {
      const value = getLesMarchesPageCopyFrValue(field.fieldName);

      expect(value).not.toBeNull();
      expect(typeof value).toBe("string");
      expect((value as string).length).toBeGreaterThan(0);
    }
  });

  it("every field has a non-empty label and group", () => {
    for (const field of LES_MARCHES_PAGE_COPY_FIELDS) {
      expect(field.label.length).toBeGreaterThan(0);
      expect(field.group.length).toBeGreaterThan(0);
    }
  });
});

describe("getLesMarchesPageCopyFrValue", () => {
  it("resolves a known dot-path", () => {
    expect(getLesMarchesPageCopyFrValue("metadata.title")).toBe(
      CONTENT_PAGES_COPY_FR.lesMarches.metadata.title
    );
  });

  it("returns null for an unknown nested key", () => {
    expect(getLesMarchesPageCopyFrValue("metadata.unknownField")).toBeNull();
  });

  it("returns null for a path that resolves to an object", () => {
    expect(getLesMarchesPageCopyFrValue("metadata")).toBeNull();
  });
});

describe("withLesMarchesPageCopyOverrides", () => {
  it("returns the same reference when overrides is empty", () => {
    expect(withLesMarchesPageCopyOverrides(CONTENT_PAGES_COPY_FR.lesMarches, {})).toBe(
      CONTENT_PAGES_COPY_FR.lesMarches
    );
  });

  it("overrides scalar and nested fields without mutating the base dictionary", () => {
    const result = withLesMarchesPageCopyOverrides(CONTENT_PAGES_COPY_FR.lesMarches, {
      title: "Prochains rendez-vous",
      "placeholder.title": "Agenda à venir",
    });

    expect(result.title).toBe("Prochains rendez-vous");
    expect(result.placeholder.title).toBe("Agenda à venir");
    expect(CONTENT_PAGES_COPY_FR.lesMarches.title).not.toBe("Prochains rendez-vous");
    expect(CONTENT_PAGES_COPY_FR.lesMarches.placeholder.title).not.toBe("Agenda à venir");
  });

  it("ignores overrides for unknown paths", () => {
    const result = withLesMarchesPageCopyOverrides(CONTENT_PAGES_COPY_FR.lesMarches, {
      "unknown.field": "Ignored",
      "placeholder.unknownField": "Ignored",
    });

    expect(result).toEqual(CONTENT_PAGES_COPY_FR.lesMarches);
  });
});
