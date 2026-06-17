import "server-only";

import type { DbExecutor } from "@/core/db/types";
import type { DiscountType } from "@/prisma-generated/client";

export type ResolvedOrderDiscount = {
  discountId: string;
  discountCodeId?: string;
  code: string;
  name: string;
  amountCents: number;
  isAutomatic: boolean;
  /** Vrai si la remise est de type FREE_SHIPPING.
   * Dans ce cas, amountCents = shippingCents au moment du calcul autoritatif,
   * et le checkout doit afficher "Livraison offerte" plutôt qu'un montant. */
  isShippingDiscount?: boolean;
};

type ResolveDiscountBaseInput = {
  executor: DbExecutor;
  storeId: string;
  customerId?: string | null;
  subtotalCents: number;
  currencyCode: string;
  /** Montant de livraison en centimes. Requis pour les remises FREE_SHIPPING. */
  shippingCents?: number;
  lines?: readonly {
    productId: string;
    variantId: string;
    quantity: number;
    unitPriceCents: number;
    categoryIds: readonly string[];
  }[];
};

type ResolveOrderDiscountInput = ResolveDiscountBaseInput & {
  code: string;
};

type ResolveApplicableOrderDiscountInput = ResolveDiscountBaseInput & {
  code?: string | null;
  allowAutomatic?: boolean;
};

type DiscountCandidate = {
  id: string;
  code: string;
  name: string;
  type: DiscountType;
  scopeType: "ORDER" | "PRODUCT" | "PRODUCT_VARIANT" | "CATEGORY";
  percentageValue: { toNumber(): number } | null;
  fixedAmountValue: { toNumber(): number } | null;
  currencyCode: string | null;
  maxRedemptions: number | null;
  maxRedemptionsPerCode: number | null;
  maxRedemptionsPerUser: number | null;
  isAutomatic: boolean;
  codes: readonly {
    id: string;
    code: string;
    maxRedemptions: number | null;
  }[];
  productTargets: readonly { productId: string }[];
  variantTargets: readonly { variantId: string }[];
  categoryTargets: readonly { categoryId: string }[];
};

export function normalizeDiscountCode(code: string): string {
  return code.trim().toUpperCase();
}

async function mapResolvedOrderDiscount(
  executor: DbExecutor,
  discount: DiscountCandidate | null,
  input: ResolveDiscountBaseInput
): Promise<ResolvedOrderDiscount | null> {
  if (discount === null || input.subtotalCents <= 0) {
    return null;
  }

  const matchedDiscountCode = discount.codes[0] ?? null;

  if (discount.maxRedemptions !== null) {
    const redemptionCount = await executor.discountRedemption.count({
      where: {
        discountId: discount.id,
      },
    });

    if (redemptionCount >= discount.maxRedemptions) {
      return null;
    }
  }

  if (discount.maxRedemptionsPerUser !== null) {
    if (typeof input.customerId !== "string" || input.customerId.trim().length === 0) {
      return null;
    }

    const customerRedemptionCount = await executor.discountRedemption.count({
      where: {
        discountId: discount.id,
        customerId: input.customerId,
      },
    });

    if (customerRedemptionCount >= discount.maxRedemptionsPerUser) {
      return null;
    }
  }

  if (discount.isAutomatic === false && discount.maxRedemptionsPerCode !== null) {
    const primaryCodeRedemptionCount = await executor.discountRedemption.count({
      where: {
        discountId: discount.id,
        discountCodeId: null,
      },
    });

    if (matchedDiscountCode === null && primaryCodeRedemptionCount >= discount.maxRedemptionsPerCode) {
      return null;
    }

    if (matchedDiscountCode !== null) {
      const perCodeRedemptionCount = await executor.discountRedemption.count({
        where: {
          discountCodeId: matchedDiscountCode.id,
        },
      });

      if (perCodeRedemptionCount >= discount.maxRedemptionsPerCode) {
        return null;
      }
    }
  }

  if (matchedDiscountCode !== null && matchedDiscountCode.maxRedemptions !== null) {
    const codeRedemptionCount = await executor.discountRedemption.count({
      where: {
        discountCodeId: matchedDiscountCode.id,
      },
    });

    if (codeRedemptionCount >= matchedDiscountCode.maxRedemptions) {
      return null;
    }
  }

  if (discount.type === "FIXED_AMOUNT" && discount.currencyCode !== null) {
    if (discount.currencyCode !== input.currencyCode) {
      return null;
    }
  }

  const eligibleSubtotalCents = (() => {
    if (discount.scopeType === "ORDER") {
      return input.subtotalCents;
    }

    if (!input.lines || input.lines.length === 0) {
      return 0;
    }

    if (discount.scopeType === "PRODUCT") {
      const productIds = new Set(discount.productTargets.map((target) => target.productId));
      return input.lines.reduce((sum, line) => {
        return productIds.has(line.productId)
          ? sum + line.unitPriceCents * line.quantity
          : sum;
      }, 0);
    }

    if (discount.scopeType === "PRODUCT_VARIANT") {
      const variantIds = new Set(discount.variantTargets.map((target) => target.variantId));
      return input.lines.reduce((sum, line) => {
        return variantIds.has(line.variantId)
          ? sum + line.unitPriceCents * line.quantity
          : sum;
      }, 0);
    }

    if (discount.scopeType === "CATEGORY") {
      const categoryIds = new Set(discount.categoryTargets.map((target) => target.categoryId));
      return input.lines.reduce((sum, line) => {
        return line.categoryIds.some((categoryId) => categoryIds.has(categoryId))
          ? sum + line.unitPriceCents * line.quantity
          : sum;
      }, 0);
    }

    return 0;
  })();

  if (eligibleSubtotalCents <= 0) {
    return null;
  }

  // FREE_SHIPPING : annule le coût de livraison.
  if (discount.type === "FREE_SHIPPING") {
    if (discount.scopeType !== "ORDER") {
      return null;
    }
    const shippingCents = input.shippingCents ?? 0;
    return {
      discountId: discount.id,
      ...(matchedDiscountCode ? { discountCodeId: matchedDiscountCode.id } : {}),
      code: matchedDiscountCode?.code ?? discount.code,
      name: discount.name,
      amountCents: shippingCents,
      isAutomatic: discount.isAutomatic,
      isShippingDiscount: true,
    };
  }

  let amountCents = 0;

  if (discount.type === "PERCENTAGE") {
    const percentageValue = discount.percentageValue?.toNumber() ?? 0;
    amountCents = Math.round((eligibleSubtotalCents * percentageValue) / 100);
  } else if (discount.type === "FIXED_AMOUNT") {
    amountCents = Math.round((discount.fixedAmountValue?.toNumber() ?? 0) * 100);
  } else {
    return null;
  }

  const boundedAmountCents = Math.max(0, Math.min(eligibleSubtotalCents, amountCents));

  if (boundedAmountCents <= 0) {
    return null;
  }

  return {
    discountId: discount.id,
    ...(matchedDiscountCode ? { discountCodeId: matchedDiscountCode.id } : {}),
    code: matchedDiscountCode?.code ?? discount.code,
    name: discount.name,
    amountCents: boundedAmountCents,
    isAutomatic: discount.isAutomatic,
  };
}

async function findDiscountCandidate(
  executor: DbExecutor,
  input: ResolveDiscountBaseInput,
  where: {
    code?: string;
    isAutomatic: boolean;
  }
): Promise<DiscountCandidate | null> {
  const now = new Date();

  return executor.discount.findFirst({
    where: {
      storeId: input.storeId,
      ...(where.code
        ? {
            OR: [
              { code: where.code },
              {
                codes: {
                  some: {
                    code: where.code,
                    archivedAt: null,
                    status: "ACTIVE",
                    OR: [{ startsAt: null }, { startsAt: { lte: now } }],
                    AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
                  },
                },
              },
            ],
          }
        : {}),
      archivedAt: null,
      status: "ACTIVE",
      scopeType: {
        in: ["ORDER", "PRODUCT", "PRODUCT_VARIANT", "CATEGORY"],
      },
      isAutomatic: where.isAutomatic,
      type: {
        in: ["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"],
      },
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
      AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
    },
    orderBy: where.isAutomatic
      ? [{ priority: "desc" }, { createdAt: "desc" }, { id: "desc" }]
      : [{ createdAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
      code: true,
      name: true,
      type: true,
      scopeType: true,
      percentageValue: true,
      fixedAmountValue: true,
      currencyCode: true,
      maxRedemptions: true,
      maxRedemptionsPerCode: true,
      maxRedemptionsPerUser: true,
      isAutomatic: true,
      codes: where.code
        ? {
            where: {
              code: where.code,
              archivedAt: null,
              status: "ACTIVE",
              OR: [{ startsAt: null }, { startsAt: { lte: now } }],
              AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
            },
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            take: 1,
            select: {
              id: true,
              code: true,
              maxRedemptions: true,
            },
          }
        : {
            take: 0,
            select: {
              id: true,
              code: true,
              maxRedemptions: true,
            },
          },
      productTargets: {
        select: {
          productId: true,
        },
      },
      variantTargets: {
        select: {
          variantId: true,
        },
      },
      categoryTargets: {
        select: {
          categoryId: true,
        },
      },
    },
  });
}

export async function resolveOrderDiscount(
  input: ResolveOrderDiscountInput
): Promise<ResolvedOrderDiscount | null> {
  const normalizedCode = normalizeDiscountCode(input.code);

  if (normalizedCode.length === 0 || input.subtotalCents <= 0) {
    return null;
  }

  const discount = await findDiscountCandidate(input.executor, input, {
    code: normalizedCode,
    isAutomatic: false,
  });

  return mapResolvedOrderDiscount(input.executor, discount, input);
}

export async function resolveAutomaticOrderDiscount(
  input: ResolveDiscountBaseInput
): Promise<ResolvedOrderDiscount | null> {
  const discount = await findDiscountCandidate(input.executor, input, {
    isAutomatic: true,
  });

  return mapResolvedOrderDiscount(input.executor, discount, input);
}

export async function resolveApplicableOrderDiscount(
  input: ResolveApplicableOrderDiscountInput
): Promise<ResolvedOrderDiscount | null> {
  const normalizedCode =
    typeof input.code === "string" ? normalizeDiscountCode(input.code) : "";

  if (normalizedCode.length > 0) {
    return resolveOrderDiscount({
      executor: input.executor,
      storeId: input.storeId,
      code: normalizedCode,
      subtotalCents: input.subtotalCents,
      currencyCode: input.currencyCode,
      ...(input.lines ? { lines: input.lines } : {}),
      ...(input.shippingCents !== undefined ? { shippingCents: input.shippingCents } : {}),
    });
  }

  if (input.allowAutomatic === true) {
    return resolveAutomaticOrderDiscount(input);
  }

  return null;
}
