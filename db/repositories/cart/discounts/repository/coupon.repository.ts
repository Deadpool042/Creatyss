import type { CouponApplicationResult } from "@db-cart/discounts/types/coupon.types";

export async function applyCouponCode(code: string): Promise<CouponApplicationResult> {
  const normalizedCode = code.trim().toUpperCase();

  if (normalizedCode.length === 0) {
    return {
      code: normalizedCode,
      applied: false,
      reason: "Coupon invalide.",
    };
  }

  return {
    code: normalizedCode,
    applied: false,
    reason: "Le moteur coupon n'est pas encore implémenté.",
  };
}
