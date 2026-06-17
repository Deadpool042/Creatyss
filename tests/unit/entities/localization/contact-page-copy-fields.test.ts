import { describe, expect, it } from "vitest";

import { CONTENT_PAGES_COPY_FR } from "@/entities/languages/fr/content-pages/content-pages-copy_fr";
import {
  CONTACT_PAGE_COPY_FIELDS,
  getContactPageCopyFrValue,
  withContactPageCopyOverrides,
} from "@/entities/localization/contact-page-copy-fields";

describe("CONTACT_PAGE_COPY_FIELDS", () => {
  it("has unique fieldName values", () => {
    const fieldNames = CONTACT_PAGE_COPY_FIELDS.map((field) => field.fieldName);

    expect(new Set(fieldNames).size).toBe(fieldNames.length);
  });

  it("every fieldName resolves to a non-empty string", () => {
    for (const field of CONTACT_PAGE_COPY_FIELDS) {
      const value = getContactPageCopyFrValue(field.fieldName);

      expect(value).not.toBeNull();
      expect(typeof value).toBe("string");
      expect((value as string).length).toBeGreaterThan(0);
    }
  });

  it("every field has a non-empty label and group", () => {
    for (const field of CONTACT_PAGE_COPY_FIELDS) {
      expect(field.label.length).toBeGreaterThan(0);
      expect(field.group.length).toBeGreaterThan(0);
    }
  });
});

describe("getContactPageCopyFrValue", () => {
  it("resolves a known dot-path", () => {
    expect(getContactPageCopyFrValue("metadata.title")).toBe("Contact — Creatyss");
  });

  it("returns null for an unknown top-level key", () => {
    expect(getContactPageCopyFrValue("unknown.field")).toBeNull();
  });

  it("returns null for an unknown nested key", () => {
    expect(getContactPageCopyFrValue("metadata.unknownField")).toBeNull();
  });

  it("returns null for a path that resolves to an object", () => {
    expect(getContactPageCopyFrValue("metadata")).toBeNull();
  });

  it("returns null for an empty fieldName", () => {
    expect(getContactPageCopyFrValue("")).toBeNull();
  });
});

describe("withContactPageCopyOverrides", () => {
  it("returns the same reference when overrides is empty", () => {
    expect(withContactPageCopyOverrides(CONTENT_PAGES_COPY_FR.contact, {})).toBe(
      CONTENT_PAGES_COPY_FR.contact
    );
  });

  it("overrides a known field without mutating the base dictionary", () => {
    const result = withContactPageCopyOverrides(CONTENT_PAGES_COPY_FR.contact, {
      "metadata.title": "Contact — Atelier",
    });

    expect(result.metadata.title).toBe("Contact — Atelier");
    expect(CONTENT_PAGES_COPY_FR.contact.metadata.title).toBe("Contact — Creatyss");
  });

  it("preserves the technical mailto placeholder", () => {
    const result = withContactPageCopyOverrides(CONTENT_PAGES_COPY_FR.contact, {
      "metadata.title": "Contact — Atelier",
    });

    expect(result.mailtoPlaceholder).toBe(
      CONTENT_PAGES_COPY_FR.contact.mailtoPlaceholder
    );
  });

  it("ignores overrides for an unknown group", () => {
    const result = withContactPageCopyOverrides(CONTENT_PAGES_COPY_FR.contact, {
      "unknown.field": "value",
    });

    expect(result).toEqual(CONTENT_PAGES_COPY_FR.contact);
  });

  it("ignores overrides for an unknown key within a known group", () => {
    const result = withContactPageCopyOverrides(CONTENT_PAGES_COPY_FR.contact, {
      "metadata.unknownField": "value",
    });

    expect(result).toEqual(CONTENT_PAGES_COPY_FR.contact);
  });
});
