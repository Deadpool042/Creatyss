import { db } from "@/core/db";
import type {
  AdminPaymentListFilters,
  AdminPaymentListResult,
  AdminPaymentStatus,
} from "@/features/admin/commerce/payments/list/types/admin-payment-list.types";
import { mapAdminPaymentSummary } from "../mappers/map-admin-payment-summary";

const DEFAULT_PER_PAGE = 20;
const MAX_PER_PAGE = 100;

type PrismaPaymentStatus = "PENDING" | "AUTHORIZED" | "CAPTURED" | "PARTIALLY_REFUNDED" | "REFUNDED" | "FAILED" | "CANCELLED" | "EXPIRED";

function toPrismaPaymentStatus(status: AdminPaymentStatus): PrismaPaymentStatus {
  switch (status) {
    case "captured": return "CAPTURED";
    case "cancelled": return "CANCELLED";
    default: return "PENDING";
  }
}

export async function listAdminPayments(
  storeId: string,
  filters: AdminPaymentListFilters = {}
): Promise<AdminPaymentListResult> {
  const safePage = Math.max(1, filters.page ?? 1);
  const safePerPage = Math.max(1, Math.min(MAX_PER_PAGE, filters.perPage ?? DEFAULT_PER_PAGE));
  const skip = (safePage - 1) * safePerPage;

  const statusWhere =
    filters.status && filters.status.length > 0
      ? { status: { in: [...filters.status].map(toPrismaPaymentStatus) } }
      : {};

  const where = { storeId, ...statusWhere };

  const [rawPayments, total] = await Promise.all([
    db.payment.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip,
      take: safePerPage,
      select: {
        id: true,
        orderId: true,
        currencyCode: true,
        amountAuthorized: true,
        amountCaptured: true,
        status: true,
        methodType: true,
        createdAt: true,
        capturedAt: true,
        cancelledAt: true,
      },
    }),
    db.payment.count({ where }),
  ]);

  const orderIds = rawPayments.map((p) => p.orderId);
  const orders = await db.order.findMany({
    where: { storeId, id: { in: orderIds } },
    select: {
      id: true,
      orderNumber: true,
      customerEmail: true,
      customerFirstName: true,
      customerLastName: true,
    },
  });
  const orderMap = new Map(orders.map((o) => [o.id, o]));

  const totalPages = Math.max(1, Math.ceil(total / safePerPage));

  return {
    items: rawPayments.map((p) => {
      const order = orderMap.get(p.orderId) ?? {
        orderNumber: "",
        customerEmail: null,
        customerFirstName: null,
        customerLastName: null,
      };
      return mapAdminPaymentSummary({ ...p, order });
    }),
    total,
    totalPages,
    currentPage: safePage,
  };
}
