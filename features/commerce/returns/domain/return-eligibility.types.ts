import type { PrismaOrderStatus } from "@/entities/order/order-status";
import type { ReturnRequestStatus } from "@/prisma-generated/client";

/**
 * Motif déclaré par la cliente pour une demande de retour storefront,
 * catégorisé côté domaine (indépendant du texte libre `reasonCode` porté par
 * `ReturnRequest`). Le mapping texte → catégorie relève d'un lot ultérieur
 * (action serveur / UI).
 */
export const RETURN_REASON_CATEGORY_VALUES = [
  "WITHDRAWAL",
  "PRODUCT_DEFECT",
  "TRANSPORT_DAMAGE",
  "WRONG_ITEM_RECEIVED",
  "MISSING_ITEM",
  "OTHER",
] as const;

export type ReturnReasonCategory = (typeof RETURN_REASON_CATEGORY_VALUES)[number];

export const RETURN_ELIGIBILITY_OUTCOME_VALUES = [
  "ELIGIBLE",
  "MANUAL_REVIEW",
  "INELIGIBLE",
] as const;

export type ReturnEligibilityOutcome = (typeof RETURN_ELIGIBILITY_OUTCOME_VALUES)[number];

/**
 * Codes métier explicites justifiant un résultat d'éligibilité. Un code
 * n'est jamais réutilisé pour deux causes distinctes.
 */
export type ReturnEligibilityCode =
  | "ORDER_CANCELLED"
  | "ORDER_ARCHIVED"
  | "ACTIVE_REQUEST_EXISTS"
  | "INVALID_QUANTITY"
  | "QUANTITY_UNCERTAIN"
  | "NO_SHIPMENT_RECORDED"
  | "DELIVERY_UNKNOWN"
  | "WITHDRAWAL_PERIOD_VALID"
  | "WITHDRAWAL_PERIOD_EXPIRED"
  | "MANUAL_REVIEW_REQUIRED";

export type ReturnEligibilityOrderLine = {
  orderLineId: string;
  /** Quantité commandée pour cette ligne. */
  quantity: number;
};

export type ReturnEligibilityOrder = {
  status: PrismaOrderStatus;
  lines: ReadonlyArray<ReturnEligibilityOrderLine>;
};

/**
 * `null` = la commande ne porte aucun `Shipment` (ex. retrait atelier,
 * commande sans expédition). Distinct de `{ deliveredAt: null }`, qui
 * signifie qu'un `Shipment` existe mais n'a pas encore de date de livraison
 * connue.
 */
export type ReturnEligibilityShipment = { deliveredAt: Date | null } | null;

export type ReturnEligibilityExistingRequestItem = {
  /** `null` si l'article de retour n'est plus rattaché à une ligne de commande. */
  orderLineId: string | null;
  quantity: number;
};

export type ReturnEligibilityExistingRequest = {
  status: ReturnRequestStatus;
  items: ReadonlyArray<ReturnEligibilityExistingRequestItem>;
};

export type ReturnEligibilityRequestedLine = {
  orderLineId: string;
  quantity: number;
};

export type ReturnEligibilityInput = {
  order: ReturnEligibilityOrder;
  shipment: ReturnEligibilityShipment;
  existingReturnRequests: ReadonlyArray<ReturnEligibilityExistingRequest>;
  reason: ReturnReasonCategory;
  requestedLines: ReadonlyArray<ReturnEligibilityRequestedLine>;
  /** Horloge injectable pour la pureté/testabilité. Défaut : `new Date()`. */
  now?: Date;
};

export type ReturnEligibilityResult = {
  outcome: ReturnEligibilityOutcome;
  code: ReturnEligibilityCode;
  /** Message interne (exploitation/logs), pas un texte destiné à l'UI. */
  message: string;
  details: {
    /** Nombre de jours écoulés depuis la livraison connue, si calculable. */
    daysSinceDelivery: number | null;
    withdrawalPeriodDays: number;
  };
};

export const WITHDRAWAL_PERIOD_DAYS = 14;
