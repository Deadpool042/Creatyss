import type {
  AdminOrderPaymentStatus,
  AdminOrderSummary,
} from "@/features/admin/commerce/orders/list/types/admin-order-list.types";

type OrderBadgeVariant = "secondary" | "outline" | "destructive";
type ShipmentBadgeVariant = "secondary" | "outline" | "destructive" | "default";

export function getOrderStatusBadgeVariant(status: AdminOrderSummary["status"]): OrderBadgeVariant {
  if (status === "cancelled") {
    return "destructive";
  }

  if (status === "pending") {
    return "outline";
  }

  return "secondary";
}

export function getPaymentStatusBadgeVariant(status: AdminOrderPaymentStatus): OrderBadgeVariant {
  if (status === "failed") {
    return "destructive";
  }

  if (status === "pending") {
    return "outline";
  }

  return "secondary";
}

export function getShipmentStatusLabel(status: string | null): string {
  switch (status) {
    case null:
      return "Non expédiée";
    case "DELIVERED":
      return "Livrée";
    case "SHIPPED":
      return "Expédiée";
    case "READY":
      return "Prête à expédier";
    case "RETURNED":
      return "Retournée";
    case "CANCELLED":
      return "Annulée";
    case "PENDING":
    default:
      return "En attente";
  }
}

export function getShipmentStatusBadgeVariant(status: string | null): ShipmentBadgeVariant {
  switch (status) {
    case "DELIVERED":
    case "SHIPPED":
      return "secondary";
    case "RETURNED":
    case "CANCELLED":
      return "destructive";
    case "READY":
      return "default";
    case "PENDING":
    default:
      return "outline";
  }
}
