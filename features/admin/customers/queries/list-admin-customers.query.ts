import "server-only";

import { db } from "@/core/db";
import {
  CUSTOMER_DEFAULT_SORT,
  CUSTOMER_DEFAULT_PER_PAGE,
  CUSTOMER_STATUS_FILTER_ALL,
  type CustomerSortOption,
  isCustomerLifecycleStatus,
} from "@/entities/customer";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import type {
  AdminCustomerSummary,
  AdminCustomersFilter,
  AdminCustomersListResult,
} from "@/features/admin/customers/types/admin-customer.types";
import type { Prisma } from "@/src/generated/prisma/client";

const ADMIN_CUSTOMER_SELECT = {
  id: true,
  email: true,
  displayName: true,
  firstName: true,
  lastName: true,
  phone: true,
  status: true,
  isGuest: true,
  acceptsEmail: true,
  createdAt: true,
  lastSeenAt: true,
  _count: {
    select: {
      orders: true,
    },
  },
} satisfies Prisma.CustomerSelect;

function resolveCustomerOrderBy(
  sort: CustomerSortOption
): Prisma.CustomerOrderByWithRelationInput[] {
  switch (sort) {
    case "name-asc":
      return [
        { lastName: "asc" },
        { firstName: "asc" },
        { displayName: "asc" },
        { email: "asc" },
      ];
    case "name-desc":
      return [
        { lastName: "desc" },
        { firstName: "desc" },
        { displayName: "desc" },
        { email: "desc" },
      ];
    case "orders-desc":
      return [{ orders: { _count: "desc" } }, { createdAt: "desc" }];
    case "orders-asc":
      return [{ orders: { _count: "asc" } }, { createdAt: "desc" }];
    case "last-seen-desc":
      return [{ lastSeenAt: "desc" }, { createdAt: "desc" }];
    case "last-seen-asc":
      return [{ lastSeenAt: "asc" }, { createdAt: "desc" }];
    case "status-asc":
      return [{ status: "asc" }, { createdAt: "desc" }];
    case "status-desc":
      return [{ status: "desc" }, { createdAt: "desc" }];
    case "email-opt-in-desc":
      return [{ acceptsEmail: "desc" }, { createdAt: "desc" }];
    case "email-opt-in-asc":
      return [{ acceptsEmail: "asc" }, { createdAt: "desc" }];
    case "created-asc":
      return [{ createdAt: "asc" }];
    case "created-desc":
    default:
      return [{ createdAt: "desc" }];
  }
}

export async function listAdminCustomers(
  filter: AdminCustomersFilter = {}
): Promise<AdminCustomersListResult> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return {
      items: [],
      total: 0,
      currentPage: 1,
      totalPages: 1,
      perPage: filter.perPage ?? CUSTOMER_DEFAULT_PER_PAGE,
    };
  }

  const searchTerm = filter.search?.trim();

  const status =
    filter.status !== undefined &&
    filter.status !== CUSTOMER_STATUS_FILTER_ALL &&
    isCustomerLifecycleStatus(filter.status)
      ? filter.status
      : undefined;

  const where = {
    storeId,
    archivedAt: null,
    isGuest: false,
    ...(status !== undefined ? { status } : {}),
    ...(searchTerm
      ? {
          OR: [
            {
              email: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              firstName: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              displayName: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  } satisfies Prisma.CustomerWhereInput;

  const safePerPage = filter.perPage ?? CUSTOMER_DEFAULT_PER_PAGE;
  const safePage = Math.max(1, filter.page ?? 1);
  const sort = filter.sort ?? CUSTOMER_DEFAULT_SORT;

  const total = await db.customer.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / safePerPage));
  const currentPage = Math.min(safePage, totalPages);

  const customers = await db.customer.findMany({
    where,
    orderBy: resolveCustomerOrderBy(sort),
    select: ADMIN_CUSTOMER_SELECT,
    skip: (currentPage - 1) * safePerPage,
    take: safePerPage,
  });

  const items: readonly AdminCustomerSummary[] = customers.map((customer) => ({
    id: customer.id,
    email: customer.email,
    displayName: customer.displayName,
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone,
    status: customer.status,
    isGuest: customer.isGuest,
    acceptsEmail: customer.acceptsEmail,
    ordersCount: customer._count.orders,
    createdAt: customer.createdAt.toISOString(),
    lastSeenAt: customer.lastSeenAt?.toISOString() ?? null,
  }));

  return {
    items,
    total,
    currentPage,
    totalPages,
    perPage: safePerPage,
  };
}
