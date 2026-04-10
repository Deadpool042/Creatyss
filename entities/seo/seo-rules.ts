export const SEO_META_TITLE_SOFT_LIMIT = 60;
export const SEO_META_DESCRIPTION_SOFT_LIMIT = 160;

export function normalizeSeoText(value: string): string {
  return value.trim();
}
