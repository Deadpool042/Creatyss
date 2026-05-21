export const ADMIN_CATEGORIES_LIST_PATH = "/admin/catalog/categories";
export const ADMIN_CATEGORIES_NEW_PATH = "/admin/catalog/categories/new";

export function getAdminCategoryDetailPath(slug: string): string {
  return `${ADMIN_CATEGORIES_LIST_PATH}/${slug}`;
}
