import "server-only";

import type { DbExecutor } from "@/core/db/types";
import type { DiscountType } from "@/prisma-generated/client";

export type ResolvedOrderDiscount = {
  discountId: string;
  code: string;
  name: string;
  amountCents: number;
  isAutomatic: boolean;
};

type ResolveDiscountBaseInput = {
  executor: DbExecutor;
  storeId: string;
  subtotalCents: number;
  currencyCode: string;
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
  percentageValue: { toNumber(): number } | null;
  fixedAmountValue: { toNumber(): number } | null;
  currencyCode: string | null;
  maxRedemptions: number | null;
  isAutomatic: boolean;
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

  if (discount.type === "FIXED_AMOUNT" && discount.currencyCode !== null) {
    if (discount.currencyCode !== input.currencyCode) {
      return null;
    }
  }

  let amountCents = 0;

  if (discount.type === "PERCENTAGE") {
    const percentageValue = discount.percentageValue?.toNumber() ?? 0;
    amountCents = Math.round((input.subtotalCents * percentageValue) / 100);
  } else if (discount.type === "FIXED_AMOUNT") {
    amountCents = Math.round((discount.fixedAmountValue?.toNumber() ?? 0) * 100);
  } else {
    return null;
  }

  const boundedAmountCents = Math.max(0, Math.min(input.subtotalCents, amountCents));

  if (boundedAmountCents <= 0) {
    return null;
  }

  return {
    discountId: discount.id,
    code: discount.code,
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
      ...(where.code ? { code: where.code } : {}),
      archivedAt: null,
      status: "ACTIVE",
      scopeType: "ORDER",
      isAutomatic: where.isAutomatic,
      type: {
        in: ["PERCENTAGE", "FIXED_AMOUNT"],
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
      percentageValue: true,
      fixedAmountValue: true,
      currencyCode: true,
      maxRedemptions: true,
      isAutomatic: true,
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
    });
  }

  if (input.allowAutomatic === true) {
    return resolveAutomaticOrderDiscount(input);
  }

  return null;
}
