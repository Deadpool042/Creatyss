import type { ReadonlyURLSearchParams } from "next/navigation";

export const ADMIN_CATEGORIES_LIST_PATH = "/admin/catalog/categories";
export const ADMIN_CATEGORIES_NEW_PATH = "/admin/catalog/categories/new";

export function getAdminCategoryDetailPath(slug: string): string {
  return `${ADMIN_CATEGORIES_LIST_PATH}/${slug}`;
}

const ADMIN_CATEGORY_LIST_PARAM_KEYS = [
  "search",
  "status",
  "featured",
  "sort",
  "page",
  "perPage",
] as const;

export function withAdminCategoryListParams(
  href: string,
  searchParams: ReadonlyURLSearchParams
): string {
  const params = new URLSearchParams();
  for (const key of ADMIN_CATEGORY_LIST_PARAM_KEYS) {
    for (const value of searchParams.getAll(key)) {
      if (value.length > 0) params.append(key, value);
    }
  }
  const query = params.toString();
  return query ? `${href}?${query}` : href;
}
