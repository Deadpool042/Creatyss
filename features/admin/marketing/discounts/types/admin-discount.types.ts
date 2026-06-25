import type { DiscountCodeStatus, DiscountStatus, DiscountType } from "@/prisma-generated/client";

/**
 * Résumé d'un `Discount` pour la liste admin (niveau `simple`,
 * cf. `docs/lots/2026-06-13-commerce-discounts-cadrage.md`).
 *
 * Niveau `simple` : types PERCENTAGE / FIXED_AMOUNT, scope ORDER uniquement.
 * `FREE_SHIPPING` et les scopes PRODUCT/PRODUCT_VARIANT/CATEGORY (niveau
 * `rules`) ne sont pas créés par ce lot, mais peuvent exister en base —
 * d'où un type `DiscountType` complet pour la lecture.
 */
export type AdminDiscountSummary = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: DiscountStatus;
  type: DiscountType;
  isAutomatic: boolean;
  priority: number;
  percentageValue: number | null;
  fixedAmountValue: number | null;
  currencyCode: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  maxRedemptions: number | null;
  maxRedemptionsPerCode: number | null;
  maxRedemptionsPerUser: number | null;
  redemptionsCount: number;
  codesCount: number;
  createdAt: Date;
};

/**
 * Code secondaire (`DiscountCode`) d'un `Discount` — visible dans la page
 * détail si `rulesLevelMet`.
 */
export type AdminDiscountCode = {
  id: string;
  code: string;
  status: DiscountCodeStatus;
  maxRedemptions: number | null;
  redeemedCount: number;
  startsAt: Date | null;
  endsAt: Date | null;
  createdAt: Date;
};

/**
 * Remise parente enrichie pour la page détail.
 */
export type AdminDiscountDetail = AdminDiscountSummary & {
  scopeType: string;
  description: string | null;
  codes: AdminDiscountCode[];
};

/**
 * Une ligne de l'historique paginé des rédemptions.
 */
export type AdminDiscountRedemption = {
  id: string;
  discountId: string;
  discountCodeId: string | null;
  discountCode: string | null;
  orderId: string | null;
  orderNumber: string | null;
  customerId: string | null;
  customerEmail: string | null;
  customerDisplayName: string | null;
  redeemedAt: Date;
  amountApplied: number | null;
  currencyCode: string | null;
};

/**
 * Résultat paginé des rédemptions.
 */
export type AdminDiscountRedemptionPage = {
  items: AdminDiscountRedemption[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
