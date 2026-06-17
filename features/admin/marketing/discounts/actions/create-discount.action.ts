"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { createDiscountSchema } from "@/features/admin/marketing/discounts/schemas/create-discount.schema";
import { ADMIN_DISCOUNTS_PATH } from "@/features/admin/marketing/discounts/shared/admin-discounts-routes";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

function parseDiscountCodesInput(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") {
    return [];
  }

  return Array.from(
    new Set(
      raw
        .split(/\r?\n|,/)
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
        .map((value) => value.toUpperCase())
    )
  );
}

/**
 * Crée un `Discount` admin :
 * - ORDER / PERCENTAGE / FIXED_AMOUNT : niveau `simple`
 * - PRODUCT / PRODUCT_VARIANT / CATEGORY + FREE_SHIPPING : niveau `rules`
 * - automatique (isAutomatic) : niveau `automation`
 */
export async function createDiscountAction(formData: FormData): Promise<void> {
  await requireAuthenticatedAdmin();

  const typeRaw = String(formData.get("type") ?? "").trim();
  const percentageRaw = String(formData.get("percentageValue") ?? "").trim();
  const fixedAmountRaw = String(formData.get("fixedAmountValue") ?? "").trim();
  const descriptionRaw = String(formData.get("description") ?? "").trim();
  const priorityRaw = String(formData.get("priority") ?? "").trim();
  const startsAtRaw = String(formData.get("startsAt") ?? "").trim();
  const endsAtRaw = String(formData.get("endsAt") ?? "").trim();
  const maxRedemptionsRaw = String(formData.get("maxRedemptions") ?? "").trim();
  const maxRedemptionsPerCodeRaw = String(formData.get("maxRedemptionsPerCode") ?? "").trim();
  const maxRedemptionsPerUserRaw = String(formData.get("maxRedemptionsPerUser") ?? "").trim();
  const parsedDiscountCodes = parseDiscountCodesInput(formData.get("discountCodes"));
  const automaticRequested = formData.get("isAutomatic") === "on";
  const rulesEnabled = await meetsFeatureLevel("commerce.discounts", "rules");
  const automationEnabled = await meetsFeatureLevel("commerce.discounts", "automation");

  if (automaticRequested && !automationEnabled) {
    redirect(`${ADMIN_DISCOUNTS_PATH}?discount_error=automation_unavailable`);
  }

  const scopeTypeRaw = String(formData.get("scopeType") ?? "").trim();
  const resolvedScopeType =
    scopeTypeRaw === "PRODUCT"
      ? "PRODUCT"
      : scopeTypeRaw === "PRODUCT_VARIANT"
        ? "PRODUCT_VARIANT"
      : scopeTypeRaw === "CATEGORY"
        ? "CATEGORY"
        : "ORDER";

  if (!rulesEnabled && resolvedScopeType !== "ORDER") {
    redirect(`${ADMIN_DISCOUNTS_PATH}?discount_error=rules_unavailable`);
  }

  const resolvedType =
    typeRaw === "FREE_SHIPPING"
      ? "FREE_SHIPPING"
      : typeRaw === "FIXED_AMOUNT"
        ? "FIXED_AMOUNT"
        : "PERCENTAGE";

  if (!rulesEnabled && resolvedType === "FREE_SHIPPING") {
    redirect(`${ADMIN_DISCOUNTS_PATH}?discount_error=rules_unavailable`);
  }

  const parsed = createDiscountSchema.safeParse({
    code: String(formData.get("code") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: descriptionRaw.length > 0 ? descriptionRaw : null,
    scopeType: resolvedScopeType,
    type: resolvedType,
    isAutomatic: automationEnabled && automaticRequested,
    priority: priorityRaw.length > 0 ? Number(priorityRaw) : 0,
    percentageValue: percentageRaw.length > 0 ? Number(percentageRaw) : null,
    fixedAmountValue: fixedAmountRaw.length > 0 ? Number(fixedAmountRaw) : null,
    startsAt: startsAtRaw.length > 0 ? new Date(startsAtRaw) : null,
    endsAt: endsAtRaw.length > 0 ? new Date(endsAtRaw) : null,
    maxRedemptions: maxRedemptionsRaw.length > 0 ? Number(maxRedemptionsRaw) : null,
    maxRedemptionsPerCode:
      maxRedemptionsPerCodeRaw.length > 0 ? Number(maxRedemptionsPerCodeRaw) : null,
    maxRedemptionsPerUser:
      maxRedemptionsPerUserRaw.length > 0 ? Number(maxRedemptionsPerUserRaw) : null,
    discountCodes: parsedDiscountCodes,
    productIds: formData.getAll("productIds").map(String),
    variantIds: formData.getAll("variantIds").map(String),
    categoryIds: formData.getAll("categoryIds").map(String),
  });

  if (!parsed.success) {
    redirect(`${ADMIN_DISCOUNTS_PATH}?discount_error=invalid_input`);
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    redirect(`${ADMIN_DISCOUNTS_PATH}?discount_error=missing_store`);
  }

  const data = parsed.data;
  const targetRelations = {
    ...(data.scopeType === "PRODUCT"
      ? {
          productTargets: {
            createMany: {
              data: data.productIds.map((productId) => ({ productId })),
            },
          },
        }
      : {}),
    ...(data.scopeType === "PRODUCT_VARIANT"
      ? {
          variantTargets: {
            createMany: {
              data: data.variantIds.map((variantId) => ({ variantId })),
            },
          },
        }
      : {}),
    ...(data.scopeType === "CATEGORY"
      ? {
          categoryTargets: {
            createMany: {
              data: data.categoryIds.map((categoryId) => ({ categoryId })),
            },
          },
        }
      : {}),
    ...(data.discountCodes.length > 0
      ? {
          codes: {
            createMany: {
              data: data.discountCodes.map((code) => ({ code })),
            },
          },
        }
      : {}),
  };

  try {
    if (data.type === "PERCENTAGE") {
      await db.discount.create({
        data: {
          storeId,
          code: data.code.toUpperCase(),
          name: data.name,
          description: data.description,
          scopeType: data.scopeType,
          isAutomatic: data.isAutomatic,
          priority: data.priority,
          type: "PERCENTAGE",
          percentageValue: data.percentageValue,
          startsAt: data.startsAt,
          endsAt: data.endsAt,
          maxRedemptions: data.maxRedemptions,
          maxRedemptionsPerCode: data.maxRedemptionsPerCode,
          maxRedemptionsPerUser: data.maxRedemptionsPerUser,
          ...targetRelations,
        },
      });
    } else if (data.type === "FREE_SHIPPING") {
      await db.discount.create({
        data: {
          storeId,
          code: data.code.toUpperCase(),
          name: data.name,
          description: data.description,
          scopeType: data.scopeType,
          isAutomatic: data.isAutomatic,
          priority: data.priority,
          type: "FREE_SHIPPING",
          startsAt: data.startsAt,
          endsAt: data.endsAt,
          maxRedemptions: data.maxRedemptions,
          maxRedemptionsPerCode: data.maxRedemptionsPerCode,
          maxRedemptionsPerUser: data.maxRedemptionsPerUser,
          ...targetRelations,
        },
      });
    } else {
      const store = await db.store.findUnique({
        where: { id: storeId },
        select: { defaultCurrency: true },
      });

      await db.discount.create({
        data: {
          storeId,
          code: data.code.toUpperCase(),
          name: data.name,
          description: data.description,
          scopeType: data.scopeType,
          isAutomatic: data.isAutomatic,
          priority: data.priority,
          type: "FIXED_AMOUNT",
          fixedAmountValue: data.fixedAmountValue,
          currencyCode: store?.defaultCurrency ?? "EUR",
          startsAt: data.startsAt,
          endsAt: data.endsAt,
          maxRedemptions: data.maxRedemptions,
          maxRedemptionsPerCode: data.maxRedemptionsPerCode,
          maxRedemptionsPerUser: data.maxRedemptionsPerUser,
          ...targetRelations,
        },
      });
    }
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      redirect(`${ADMIN_DISCOUNTS_PATH}?discount_error=duplicate_code`);
    }

    console.error(error);
    redirect(`${ADMIN_DISCOUNTS_PATH}?discount_error=create_failed`);
  }

  revalidatePath(ADMIN_DISCOUNTS_PATH);
  redirect(`${ADMIN_DISCOUNTS_PATH}?discount_created=1`);
}
