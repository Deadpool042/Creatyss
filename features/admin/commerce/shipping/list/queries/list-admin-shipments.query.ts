import { db } from "@/core/db";
import type {
  AdminShipmentListFilters,
  AdminShipmentListResult,
  AdminShipmentStatus,
} from "@/features/admin/commerce/shipping/list/types/admin-shipment-list.types";
import { mapAdminShipmentSummary } from "../mappers/map-admin-shipment-summary";

const DEFAULT_PER_PAGE = 20;
const MAX_PER_PAGE = 100;

type PrismaShipmentStatus = "PENDING" | "READY" | "SHIPPED" | "DELIVERED" | "RETURNED" | "CANCELLED";

function toPrismaShipmentStatus(status: AdminShipmentStatus): PrismaShipmentStatus {
  switch (status) {
    case "ready":
      return "READY";
    case "shipped":
      return "SHIPPED";
    case "delivered":
      return "DELIVERED";
    case "returned":
      return "RETURNED";
    case "cancelled":
      return "CANCELLED";
    case "pending":
    default:
      return "PENDING";
  }
}

export async function listAdminShipments(
  storeId: string,
  filters: AdminShipmentListFilters = {}
): Promise<AdminShipmentListResult> {
  const safePage = Math.max(1, filters.page ?? 1);
  const safePerPage = Math.max(1, Math.min(MAX_PER_PAGE, filters.perPage ?? DEFAULT_PER_PAGE));
  const skip = (safePage - 1) * safePerPage;

  const statusWhere = filters.status ? { status: toPrismaShipmentStatus(filters.status) } : {};

  const where = { storeId, ...statusWhere };

  const [rawShipments, total] = await Promise.all([
    db.shipment.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip,
      take: safePerPage,
      select: {
        id: true,
        orderId: true,
        status: true,
        carrier: true,
        trackingNumber: true,
        trackingUrl: true,
        shippedAt: true,
        deliveredAt: true,
        createdAt: true,
      },
    }),
    db.shipment.count({ where }),
  ]);

  const orderIds = rawShipments.map((s) => s.orderId);
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
    items: rawShipments.map((s) => {
      const order = orderMap.get(s.orderId) ?? {
        orderNumber: "",
        customerEmail: null,
        customerFirstName: null,
        customerLastName: null,
      };
      return mapAdminShipmentSummary({ ...s, order });
    }),
    total,
    totalPages,
    currentPage: safePage,
  };
}
