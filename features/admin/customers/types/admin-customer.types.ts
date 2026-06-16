import type {
  CustomerLifecycleStatus,
  CustomerSortOption,
  CustomerStatusFilterValue,
} from "@/entities/customer";

export type AdminCustomerSummary = Readonly<{
  id: string;
  email: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  status: CustomerLifecycleStatus;
  isGuest: boolean;
  acceptsEmail: boolean;
  ordersCount: number;
  createdAt: string;
  lastSeenAt: string | null;
}>;

export type AdminCustomersFilter = Readonly<{
  search?: string;
  status?: CustomerStatusFilterValue;
  sort?: CustomerSortOption;
  page?: number;
  perPage?: number;
}>;

export type AdminCustomersListResult = Readonly<{
  items: readonly AdminCustomerSummary[];
  total: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
}>;
