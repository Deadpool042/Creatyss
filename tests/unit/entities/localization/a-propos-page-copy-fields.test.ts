import { describe, expect, it } from "vitest";

import { CONTENT_PAGES_COPY_FR } from "@/entities/languages/fr/content-pages/content-pages-copy_fr";
import {
  A_PROPOS_PAGE_COPY_FIELDS,
  getAProposPageCopyFrValue,
  withAProposPageCopyOverrides,
} from "@/entities/localization/a-propos-page-copy-fields";

describe("A_PROPOS_PAGE_COPY_FIELDS", () => {
  it("has unique fieldName values", () => {
    const fieldNames = A_PROPOS_PAGE_COPY_FIELDS.map((field) => field.fieldName);

    expect(new Set(fieldNames).size).toBe(fieldNames.length);
  });

  it("every fieldName resolves to a non-empty string", () => {
    for (const field of A_PROPOS_PAGE_COPY_FIELDS) {
      const value = getAProposPageCopyFrValue(field.fieldName);

      expect(value).not.toBeNull();
      expect(typeof value).toBe("string");
      expect((value as string).length).toBeGreaterThan(0);
    }
  });

  it("every field has a non-empty label and group", () => {
    for (const field of A_PROPOS_PAGE_COPY_FIELDS) {
      expect(field.label.length).toBeGreaterThan(0);
      expect(field.group.length).toBeGreaterThan(0);
    }
  });
});

describe("getAProposPageCopyFrValue", () => {
  it("resolves a known dot-path", () => {
    expect(getAProposPageCopyFrValue("metadata.title")).toBe("À propos — Creatyss");
  });

  it("resolves a known array path", () => {
    expect(getAProposPageCopyFrValue("sections.0.title")).toBe(
      CONTENT_PAGES_COPY_FR.aPropos.sections[0].title
    );
  });

  it("returns null for an unknown nested key", () => {
    expect(getAProposPageCopyFrValue("metadata.unknownField")).toBeNull();
  });

  it("returns null for a path that resolves to an object", () => {
    expect(getAProposPageCopyFrValue("metadata")).toBeNull();
  });
});

describe("withAProposPageCopyOverrides", () => {
  it("returns the same reference when overrides is empty", () => {
    expect(withAProposPageCopyOverrides(CONTENT_PAGES_COPY_FR.aPropos, {})).toBe(
      CONTENT_PAGES_COPY_FR.aPropos
    );
  });

  it("overrides scalar, nested and array fields without mutating the base dictionary", () => {
    const result = withAProposPageCopyOverrides(CONTENT_PAGES_COPY_FR.aPropos, {
      title: "Notre atelier",
      "ctaPrimary.label": "Voir la boutique",
      "sections.0.title": "Création locale",
    });

    expect(result.title).toBe("Notre atelier");
    expect(result.ctaPrimary.label).toBe("Voir la boutique");
    expect(result.sections[0].title).toBe("Création locale");
    expect(CONTENT_PAGES_COPY_FR.aPropos.title).not.toBe("Notre atelier");
    expect(CONTENT_PAGES_COPY_FR.aPropos.sections[0].title).not.toBe("Création locale");
  });

  it("ignores overrides for unknown paths", () => {
    const result = withAProposPageCopyOverrides(CONTENT_PAGES_COPY_FR.aPropos, {
      "sections.999.title": "Ignored",
      "unknown.field": "Ignored",
    });

    expect(result).toEqual(CONTENT_PAGES_COPY_FR.aPropos);
  });
});
