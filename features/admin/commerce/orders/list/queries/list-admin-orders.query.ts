import { db } from "@/core/db";
import { toPrismaOrderStatus } from "@/entities/order/order-status";
import { mapAdminOrderSummary } from "@/features/admin/commerce/orders/list/mappers/map-admin-order-summary";
import type {
  AdminOrderListFilters,
  AdminOrderListResult,
  AdminOrderStatusCounts,
} from "@/features/admin/commerce/orders/list/types/admin-order-list.types";

const DEFAULT_PER_PAGE = 20;
const MAX_PER_PAGE = 100;

export async function listAdminOrders(
  filters: AdminOrderListFilters = {}
): Promise<AdminOrderListResult> {
  const safePage = Math.max(1, filters.page ?? 1);
  const safePerPage = Math.max(1, Math.min(MAX_PER_PAGE, filters.perPage ?? DEFAULT_PER_PAGE));
  const skip = (safePage - 1) * safePerPage;

  const normalizedSearch = filters.search?.trim();
  const searchWhere = normalizedSearch
    ? {
        OR: [
          { orderNumber: { contains: normalizedSearch, mode: "insensitive" as const } },
          { customerEmail: { contains: normalizedSearch, mode: "insensitive" as const } },
          { customerFirstName: { contains: normalizedSearch, mode: "insensitive" as const } },
          { customerLastName: { contains: normalizedSearch, mode: "insensitive" as const } },
        ],
      }
    : {};

  const statusWhere =
    filters.status && filters.status.length > 0
      ? { status: { in: [...filters.status].map(toPrismaOrderStatus) } }
      : {};

  const baseWhere = { ...searchWhere, ...statusWhere };

  const sortKey = filters.sort ?? "created-desc";
  const orderBy: Array<
    | { createdAt: "asc" | "desc" }
    | { updatedAt: "asc" | "desc" }
    | { id: "asc" | "desc" }
  > =
    sortKey === "created-asc"
      ? [{ createdAt: "asc" }, { id: "asc" }]
      : sortKey === "updated-desc"
        ? [{ updatedAt: "desc" }, { id: "desc" }]
        : sortKey === "updated-asc"
          ? [{ updatedAt: "asc" }, { id: "asc" }]
          : [{ createdAt: "desc" }, { id: "desc" }];

  const [orders, total, statusGroupBy] = await Promise.all([
    db.order.findMany({
      where: baseWhere,
      orderBy,
      skip,
      take: safePerPage,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        customerEmail: true,
        customerFirstName: true,
        customerLastName: true,
        totalAmount: true,
        createdAt: true,
        updatedAt: true,
        payments: {
          select: {
            status: true,
          },
          take: 1,
          orderBy: { createdAt: "desc" as const },
        },
        _count: {
          select: {
            lines: true,
          },
        },
      },
    }),
    db.order.count({ where: baseWhere }),
    db.order.groupBy({
      by: ["status"],
      where: searchWhere,
      _count: { id: true },
    }),
  ]);

  const statusCounts: AdminOrderStatusCounts = Object.fromEntries(
    statusGroupBy.map((g) => [g.status, g._count.id])
  ) as AdminOrderStatusCounts;

  return {
    items: orders.map(mapAdminOrderSummary),
    total,
    totalPages: Math.ceil(total / safePerPage),
    currentPage: safePage,
    statusCounts,
  };
}
