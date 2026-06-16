import {
  parseAdminListSortParam,
} from "@/components/admin/tables/state/admin-list-search-params";

export const CUSTOMER_SORT_OPTIONS = [
  "created-desc",
  "created-asc",
  "name-asc",
  "name-desc",
  "orders-desc",
  "orders-asc",
  "last-seen-desc",
  "last-seen-asc",
  "status-asc",
  "status-desc",
  "email-opt-in-desc",
  "email-opt-in-asc",
] as const;

export type CustomerSortOption = (typeof CUSTOMER_SORT_OPTIONS)[number];

export const CUSTOMER_DEFAULT_SORT: CustomerSortOption = "created-desc";

export const CUSTOMER_SORT_LABEL_OPTIONS: ReadonlyArray<{
  value: CustomerSortOption;
  label: string;
}> = [
  { value: "created-desc", label: "Plus récents" },
  { value: "created-asc", label: "Plus anciens" },
  { value: "name-asc", label: "Nom A → Z" },
  { value: "name-desc", label: "Nom Z → A" },
  { value: "last-seen-desc", label: "Activité récente" },
  { value: "last-seen-asc", label: "Activité ancienne" },
  { value: "orders-desc", label: "Commandes décroissantes" },
  { value: "orders-asc", label: "Commandes croissantes" },
  { value: "status-asc", label: "Statut A → Z" },
  { value: "status-desc", label: "Statut Z → A" },
  { value: "email-opt-in-desc", label: "Consentement email d'abord" },
  { value: "email-opt-in-asc", label: "Sans consentement d'abord" },
] as const;

export function parseCustomerSortOption(value: string | null | undefined): CustomerSortOption {
  return parseAdminListSortParam(value, CUSTOMER_SORT_OPTIONS, CUSTOMER_DEFAULT_SORT);
}
