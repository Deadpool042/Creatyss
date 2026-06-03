import {
  parseAdminListArrayParam,
  parseAdminListPageParam,
  parseAdminListPerPageParam,
  parseAdminListSortParam,
  parseAdminListStringArrayParam,
} from "@/components/admin/tables/state/admin-list-search-params";
import { PRODUCT_FILTER_VALID_VALUES } from "@/features/admin/products/config";
import type {
  ProductFeaturedFilterValue,
  ProductFilterImageOption,
  ProductFilterStockOption,
  ProductFilterVariantOption,
  ProductSortOption,
  ProductTableStatus,
} from "@/features/admin/products/list/types/product-table.types";
import { type AdminProductsListView } from "@/features/admin/products/list/queries";

export type ProductsListSearchParams = {
  view?: string;
  search?: string;
  status?: string;
  sort?: string;
  page?: string;
  perPage?: string;
  categories?: string;
  featured?: string;
  image?: string;
  stock?: string;
  variant?: string;
};

const VALID_STATUSES = PRODUCT_FILTER_VALID_VALUES.statuses as ProductTableStatus[];
const VALID_FEATURED = PRODUCT_FILTER_VALID_VALUES.featured.filter(
  (value): value is ProductFeaturedFilterValue => value !== "all"
);
const VALID_IMAGES = PRODUCT_FILTER_VALID_VALUES.images as ProductFilterImageOption[];
const VALID_STOCK = PRODUCT_FILTER_VALID_VALUES.stock as ProductFilterStockOption[];
const VALID_VARIANTS = PRODUCT_FILTER_VALID_VALUES.variants as ProductFilterVariantOption[];
const VALID_SORTS = PRODUCT_FILTER_VALID_VALUES.sorts as ProductSortOption[];
const VALID_PER_PAGE = PRODUCT_FILTER_VALID_VALUES.perPage as readonly number[];

export function resolveProductsView(rawView: string | undefined): AdminProductsListView {
  return rawView === "trash" ? "trash" : "active";
}

export function parseProductsListSearchParams(params: ProductsListSearchParams) {
  return {
    view: resolveProductsView(params.view),
    search: params.search ?? "",
    status: parseAdminListArrayParam(params.status, VALID_STATUSES),
    sort: parseAdminListSortParam(params.sort, VALID_SORTS, "updated-desc"),
    featured: parseAdminListArrayParam(params.featured, VALID_FEATURED),
    categorySlugs: parseAdminListStringArrayParam(params.categories),
    image: parseAdminListSortParam(params.image, VALID_IMAGES, "all"),
    stock: parseAdminListSortParam(params.stock, VALID_STOCK, "all"),
    variant: parseAdminListSortParam(params.variant, VALID_VARIANTS, "all"),
    page: parseAdminListPageParam(params.page),
    perPage: parseAdminListPerPageParam(
      params.perPage,
      VALID_PER_PAGE,
      PRODUCT_FILTER_VALID_VALUES.perPageDefault
    ),
  };
}

export function getDefaultProductsListParams() {
  return parseProductsListSearchParams({});
}
