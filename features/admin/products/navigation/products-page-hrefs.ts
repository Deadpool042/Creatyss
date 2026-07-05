import type { ProductsPageParams } from "./products-page-params";
import {
  ADMIN_PRODUCTS_CREATE_PATH,
  ADMIN_PRODUCTS_LIST_PATH,
  buildAdminProductEditPath,
} from "./product-routes";

type ProductsPageQueryValue = string | null | undefined;

type ProductsPageQueryInput = {
  q?: ProductsPageQueryValue;
  status?: ProductsPageQueryValue;
  category?: ProductsPageQueryValue;
  featured?: ProductsPageQueryValue;
};

function setQueryValue(params: URLSearchParams, key: string, value: ProductsPageQueryValue): void {
  if (!value || value.trim().length === 0) {
    params.delete(key);
    return;
  }

  params.set(key, value);
}

export function buildProductsPageSearchParams(input: ProductsPageQueryInput): string {
  const params = new URLSearchParams();

  setQueryValue(params, "q", input.q);
  setQueryValue(params, "status", input.status);
  setQueryValue(params, "category", input.category);
  setQueryValue(params, "featured", input.featured);

  const query = params.toString();
  return query.length > 0 ? `?${query}` : "";
}

export function buildProductsPageHref(input: ProductsPageQueryInput): string {
  return `${ADMIN_PRODUCTS_LIST_PATH}${buildProductsPageSearchParams(input)}`;
}

export function buildProductsListHref(params: ProductsPageParams): string {
  return buildProductsPageHref({
    q: params.search,
    status: params.status,
    category: params.category,
    featured: params.featured,
  });
}

export function buildProductDetailsHref(params: ProductsPageParams, slug: string): string {
  return `${buildAdminProductEditPath(slug)}${buildProductsPageSearchParams({
    q: params.search,
    status: params.status,
    category: params.category,
    featured: params.featured,
  })}`;
}

export function buildProductEditorHref(params: ProductsPageParams, slug: string): string {
  return buildProductDetailsHref(params, slug);
}

export function buildProductsCreateHref(params: ProductsPageParams): string {
  return `${ADMIN_PRODUCTS_CREATE_PATH}${buildProductsPageSearchParams({
    q: params.search,
    status: params.status,
    category: params.category,
    featured: params.featured,
  })}`;
}

export {
  buildAdminProductAvailabilityPath,
  ADMIN_PRODUCTS_CREATE_PATH,
  buildAdminProductBreadcrumbs,
  buildAdminProductCategoriesPath,
  buildAdminProductCharacteristicsPath,
  ADMIN_PRODUCTS_LIST_PATH,
  ADMIN_PRODUCTS_TRASH_PATH,
  buildAdminProductEditPath,
  buildAdminProductInventoryPath,
  buildAdminProductMediaPath,
  buildAdminProductPath,
  buildAdminProductPricingPath,
  buildAdminProductPreviewPath,
  buildAdminProductRelatedPath,
  buildAdminProductSeoPath,
  buildAdminProductVariantsPath,
} from "./product-routes";

export function buildProductsFiltersHref(
  params: ProductsPageParams,
  input: {
    q?: string;
    status?: string;
    category?: string;
    featured?: string;
  }
): string {
  return buildProductsPageHref({
    q: input.q ?? params.search,
    status: input.status ?? params.status,
    category: input.category ?? params.category,
    featured: input.featured ?? params.featured,
  });
}
