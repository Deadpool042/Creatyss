export const ADMIN_PRODUCTS_LIST_PATH = "/admin/catalog/products";
export const ADMIN_PRODUCTS_CREATE_PATH = `${ADMIN_PRODUCTS_LIST_PATH}/new`;
export const ADMIN_PRODUCTS_TRASH_PATH = `${ADMIN_PRODUCTS_LIST_PATH}?view=trash`;

export function buildAdminProductPath(slug: string): string {
  return `${ADMIN_PRODUCTS_LIST_PATH}/${slug}`;
}

export function buildAdminProductEditPath(slug: string): string {
  return `${buildAdminProductPath(slug)}/edit`;
}

export function buildAdminProductPreviewPath(slug: string): string {
  return `${buildAdminProductPath(slug)}/preview`;
}

export function buildAdminProductMediaPath(slug: string): string {
  return `${buildAdminProductPath(slug)}/media`;
}

export function buildAdminProductSeoPath(slug: string): string {
  return `${buildAdminProductPath(slug)}/seo`;
}

export function buildAdminProductPricingPath(slug: string): string {
  return `${buildAdminProductPath(slug)}/pricing`;
}

export function buildAdminProductAvailabilityPath(slug: string): string {
  return `${buildAdminProductPath(slug)}/availability`;
}

export function buildAdminProductInventoryPath(slug: string): string {
  return `${buildAdminProductPath(slug)}/inventory`;
}

export function buildAdminProductVariantsPath(slug: string): string {
  return `${buildAdminProductPath(slug)}/variants`;
}

export function buildAdminProductCategoriesPath(slug: string): string {
  return `${buildAdminProductPath(slug)}/categories`;
}

export function buildAdminProductCharacteristicsPath(slug: string): string {
  return `${buildAdminProductPath(slug)}/characteristics`;
}

export function buildAdminProductRelatedPath(slug: string): string {
  return `${buildAdminProductPath(slug)}/related`;
}
