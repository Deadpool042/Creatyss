import type { ProductsPageMode, ProductsPageParams } from "./products-page-params";

type ProductsPageQueryValue = string | null | undefined;

type ProductsPageQueryInput = {
  selected?: ProductsPageQueryValue;
  mode?: ProductsPageQueryValue;
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

  setQueryValue(params, "selected", input.selected);
  setQueryValue(params, "mode", input.mode);
  setQueryValue(params, "q", input.q);
  setQueryValue(params, "status", input.status);
  setQueryValue(params, "category", input.category);
  setQueryValue(params, "featured", input.featured);

  const query = params.toString();
  return query.length > 0 ? `?${query}` : "";
}

export function buildProductsPageHref(input: ProductsPageQueryInput): string {
  return `/admin/products${buildProductsPageSearchParams(input)}`;
}

export function buildProductsListHref(params: ProductsPageParams): string {
  return buildProductsPageHref({
    q: params.search,
    status: params.status,
    category: params.category,
    featured: params.featured,
  });
}

export function buildProductDetailsHref(params: ProductsPageParams, selectedSlug: string): string {
  return buildProductsPageHref({
    selected: selectedSlug,
    mode: "view",
    q: params.search,
    status: params.status,
    category: params.category,
    featured: params.featured,
  });
}

export function buildProductEditorHref(params: ProductsPageParams, selectedSlug: string): string {
  return buildProductsPageHref({
    selected: selectedSlug,
    mode: "edit",
    q: params.search,
    status: params.status,
    category: params.category,
    featured: params.featured,
  });
}

export function buildProductsPageModeHref(
  params: ProductsPageParams,
  mode: ProductsPageMode
): string {
  return buildProductsPageHref({
    selected: params.selectedSlug,
    mode,
    q: params.search,
    status: params.status,
    category: params.category,
    featured: params.featured,
  });
}

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
    selected: params.selectedSlug,
    mode: params.mode,
    q: input.q ?? params.search,
    status: input.status ?? params.status,
    category: input.category ?? params.category,
    featured: input.featured ?? params.featured,
  });
}

export function buildProductsCreateHref(params: ProductsPageParams): string {
  return buildProductsPageHref({
    mode: "edit",
    q: params.search,
    status: params.status,
    category: params.category,
    featured: params.featured,
  });
}

export function isProductSelected(params: ProductsPageParams, slug: string): boolean {
  return params.selectedSlug === slug;
}

export function isProductEditorOpen(params: ProductsPageParams): boolean {
  return params.mode === "edit";
}
