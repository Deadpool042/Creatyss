import type { OrderEmailEventStatus, OrderStatus } from "@/db/repositories/order.repository";

import { type OrderDetailSearchParams } from "../types/order-detail-types";

const orderDateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short"
});

export function readOrderDetailSearchParam(
  searchParams: OrderDetailSearchParams,
  key: string
): string | undefined {
  const value = searchParams[key];

  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function getOrderDetailStatusMessage(
  status: string | undefined
): string | null {
  switch (status) {
    case "updated":
      return "Le statut de la commande a été mis à jour.";
    case "shipped":
      return "La commande a été marquée comme expédiée.";
    default:
      return null;
  }
}

export function getOrderDetailErrorMessage(
  error: string | undefined
): string | null {
  switch (error) {
    case "invalid_transition":
      return "Cette transition n'est pas autorisée.";
    case "ship_failed":
      return "La commande n'a pas pu être marquée comme expédiée.";
    case "update_failed":
      return "La commande n'a pas pu être mise à jour.";
    default:
      return null;
  }
}

export function formatOrderDateTime(value: string): string {
  return orderDateTimeFormatter.format(new Date(value));
}

export function formatOptionalOrderDateTime(value: string | null): string | null {
  if (value === null) {
    return null;
  }

  return formatOrderDateTime(value);
}

export function getOrderTransitionLabel(status: OrderStatus): string {
  switch (status) {
    case "preparing":
      return "Marquer en préparation";
    case "cancelled":
      return "Annuler la commande";
    default:
      return status;
  }
}

export function getEmailEventLabel(eventType: string): string {
  switch (eventType) {
    case "payment_succeeded":
      return "Paiement réussi";
    case "order_shipped":
      return "Commande expédiée";
    case "order_created":
    default:
      return "Commande créée";
  }
}

export function getEmailEventStatusLabel(
  status: OrderEmailEventStatus
): string {
  switch (status) {
    case "sent":
      return "Envoyé";
    case "failed":
      return "Échec";
    case "pending":
    default:
      return "En attente";
  }
}
