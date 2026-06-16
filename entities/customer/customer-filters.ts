import { isCustomerLifecycleStatus, type CustomerLifecycleStatus } from "./customer-status";

export const CUSTOMER_STATUS_FILTER_ALL = "ALL" as const;

export type CustomerStatusFilterValue =
  | typeof CUSTOMER_STATUS_FILTER_ALL
  | CustomerLifecycleStatus;

export const CUSTOMER_STATUS_FILTER_OPTIONS = [
  { value: CUSTOMER_STATUS_FILTER_ALL, label: "Tous" },
  { value: "ACTIVE", label: "Actifs" },
  { value: "LEAD", label: "Prospects" },
  { value: "INACTIVE", label: "Inactifs" },
] as const satisfies ReadonlyArray<{
  value: CustomerStatusFilterValue;
  label: string;
}>;

export function isCustomerStatusFilterValue(value: string): value is CustomerStatusFilterValue {
  return value === CUSTOMER_STATUS_FILTER_ALL || isCustomerLifecycleStatus(value);
}
