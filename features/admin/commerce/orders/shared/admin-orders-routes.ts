import type { ReadonlyURLSearchParams } from "next/navigation";

export const ADMIN_ORDERS_LIST_PATH = "/admin/commerce/orders";

export function getAdminOrderDetailPath(orderId: string): string {
  return `${ADMIN_ORDERS_LIST_PATH}/${orderId}`;
}

const ADMIN_ORDER_LIST_PARAM_KEYS = [
  "search",
  "status",
  "sort",
  "page",
  "perPage",
] as const;

export function withAdminOrderListParams(
  href: string,
  searchParams: ReadonlyURLSearchParams
): string {
  const params = new URLSearchParams();
  for (const key of ADMIN_ORDER_LIST_PARAM_KEYS) {
    for (const value of searchParams.getAll(key)) {
      if (value.length > 0) params.append(key, value);
    }
  }
  const query = params.toString();
  return query ? `${href}?${query}` : href;
}
