import type { PrismaOrderStatus } from "@/entities/order/order-status";
import type { ReturnRequestStatus } from "@/prisma-generated/client";

export type IdentifiedReturnOrderContext = {
  orderId: string;
  status: PrismaOrderStatus;
  lines: ReadonlyArray<{ orderLineId: string; quantity: number }>;
  shipment: { deliveredAt: Date | null } | null;
  existingReturnRequests: ReadonlyArray<{
    status: ReturnRequestStatus;
    items: ReadonlyArray<{ orderLineId: string | null; quantity: number }>;
  }>;
};

/**
 * Résultat volontairement binaire : aucune variante ne doit permettre de
 * distinguer "référence inconnue" de "email ne correspond pas". Ne jamais
 * ajouter de champ de raison à la variante d'échec.
 */
export type IdentifyOrderForReturnResult =
  | { outcome: "IDENTIFIED"; order: IdentifiedReturnOrderContext }
  | { outcome: "NOT_IDENTIFIED" };
