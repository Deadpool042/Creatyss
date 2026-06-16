export const CUSTOMER_PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;

export const CUSTOMER_DEFAULT_PER_PAGE = CUSTOMER_PER_PAGE_OPTIONS[1];

export function isCustomerPerPageOption(value: number): value is (typeof CUSTOMER_PER_PAGE_OPTIONS)[number] {
  return CUSTOMER_PER_PAGE_OPTIONS.some((option) => option === value);
}

export function parseCustomerPage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

export function parseCustomerPerPage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsed) || !isCustomerPerPageOption(parsed)) {
    return CUSTOMER_DEFAULT_PER_PAGE;
  }

  return parsed;
}
