export const CUSTOMER_STATUSES = ["LEAD", "ACTIVE", "INACTIVE", "BLOCKED", "ARCHIVED"] as const;

export type CustomerLifecycleStatus = (typeof CUSTOMER_STATUSES)[number];

export function isCustomerLifecycleStatus(value: string): value is CustomerLifecycleStatus {
  return CUSTOMER_STATUSES.some((status) => status === value);
}
