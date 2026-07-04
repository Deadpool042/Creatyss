import type { OrderStatus } from "@/entities/order/order-status-transition";
import type { AdminOrderListSort } from "@/features/admin/commerce/orders/list/types/admin-order-list.types";
import { ADMIN_ORDERS_LIST_PATH } from "@/features/admin/commerce/orders/shared/admin-orders-routes";

export const ORDER_STATUS_FILTERS = [
  "pending",
  "paid",
  "preparing",
  "shipped",
  "cancelled",
] as const satisfies readonly OrderStatus[];

export const ORDER_LIST_DEFAULT_SORT: AdminOrderListSort = "created-desc";

export type OrderSortOption = Readonly<{
  value: AdminOrderListSort;
  label: string;
}>;

export const ORDER_SORT_OPTIONS: readonly OrderSortOption[] = [
  { value: "created-desc", label: "Plus récentes d'abord" },
  { value: "created-asc", label: "Plus anciennes d'abord" },
  { value: "updated-desc", label: "Modifiées récemment" },
];

export const ORDER_NAVIGATION_CONFIG = {
  home: {
    label: "Accueil",
    href: "/admin",
  },
  commerceOverview: {
    label: "Vue d'ensemble",
    href: "/admin/commerce/overview",
  },
  orders: {
    label: "Commandes",
    href: ADMIN_ORDERS_LIST_PATH,
  },
} as const;

export const ORDER_LIST_PAGE_CONFIG = {
  eyebrow: "Commandes",
  title: "Gestion des commandes",
  description:
    "Visualisez et gérez les commandes passées par les clients, suivez leur statut et assurez un service client de qualité.",
} as const;
