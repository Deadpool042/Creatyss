import type { DiscountStatus, DiscountType } from "@/prisma-generated/client";

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
