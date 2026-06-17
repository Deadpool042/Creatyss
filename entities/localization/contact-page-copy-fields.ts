import { CONTENT_PAGES_COPY_FR } from "@/entities/languages/fr/content-pages/content-pages-copy_fr";

export const CONTACT_PAGE_COPY_SUBJECT_TYPE = "content_page_copy";
export const CONTACT_PAGE_COPY_SUBJECT_ID = "contact";

export type ContactPageCopyFieldDefinition = Readonly<{
  fieldName: string;
  group: string;
  label: string;
  multiline?: boolean;
}>;

export const CONTACT_PAGE_COPY_FIELDS: readonly ContactPageCopyFieldDefinition[] = [
  {
    fieldName: "metadata.title",
    group: "Référencement",
    label: "Titre SEO",
  },
  {
    fieldName: "metadata.description",
    group: "Référencement",
    label: "Description SEO",
    multiline: true,
  },
] as const;

export type ContactPageCopyDictionary = typeof CONTENT_PAGES_COPY_FR.contact;

export function getContactPageCopyFrValue(fieldName: string): string | null {
  const segments = fieldName.split(".");
  let current: unknown = CONTENT_PAGES_COPY_FR.contact;

  for (const segment of segments) {
    if (typeof current !== "object" || current === null || !(segment in current)) {
      return null;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === "string" ? current : null;
}

export function withContactPageCopyOverrides(
  base: ContactPageCopyDictionary,
  overrides: Readonly<Record<string, string>>
): ContactPageCopyDictionary {
  const entries = Object.entries(overrides);

  if (entries.length === 0) {
    return base;
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(base)) {
    result[key] =
      typeof value === "object" && value !== null
        ? { ...(value as Record<string, unknown>) }
        : value;
  }

  for (const [fieldName, value] of entries) {
    const [group, key] = fieldName.split(".");

    if (group === undefined || key === undefined) {
      continue;
    }

    const groupFields = result[group];

    if (
      typeof groupFields !== "object" ||
      groupFields === null ||
      !(key in groupFields)
    ) {
      continue;
    }

    (groupFields as Record<string, unknown>)[key] = value;
  }

  return result as ContactPageCopyDictionary;
}
