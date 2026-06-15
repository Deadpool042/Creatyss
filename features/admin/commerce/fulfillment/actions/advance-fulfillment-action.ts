"use server";

import { revalidatePath } from "next/cache";

import type { FulfillmentStatus } from "@/prisma-generated/client";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { isFulfillmentFeatureActive } from "@/features/admin/commerce/fulfillment/queries/is-fulfillment-feature-active.query";
import {
  advanceFulfillmentStatus,
  AdvanceFulfillmentError,
} from "@/features/admin/commerce/fulfillment/services/advance-fulfillment-status.service";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

type ActionResult = { success: true } | { success: false; error: string };

const ALLOWED_TARGETS: ReadonlyArray<FulfillmentStatus> = ["READY", "FULFILLED", "CANCELLED"];

export async function advanceFulfillmentAction(
  fulfillmentId: string,
  orderId: string,
  nextStatus: FulfillmentStatus
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  if (typeof fulfillmentId !== "string" || fulfillmentId.trim().length === 0) {
    return { success: false, error: "Identifiant de préparation invalide." };
  }

  if (!ALLOWED_TARGETS.includes(nextStatus)) {
    return { success: false, error: "Transition non autorisée." };
  }

  if (!(await isFulfillmentFeatureActive())) {
    return { success: false, error: "La préparation logistique n'est pas activée." };
  }

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return { success: false, error: "Boutique introuvable." };
  }

  try {
    await advanceFulfillmentStatus({ fulfillmentId: fulfillmentId.trim(), storeId, nextStatus });
    revalidatePath(`/admin/commerce/orders/${orderId.trim()}`);
    return { success: true };
  } catch (error) {
    if (error instanceof AdvanceFulfillmentError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur inattendue. Réessayez." };
  }
}
