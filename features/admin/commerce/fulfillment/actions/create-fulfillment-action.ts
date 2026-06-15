"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { isFulfillmentFeatureActive } from "@/features/admin/commerce/fulfillment/queries/is-fulfillment-feature-active.query";
import {
  createFulfillment,
  CreateFulfillmentError,
} from "@/features/admin/commerce/fulfillment/services/create-fulfillment.service";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

type ActionResult = { success: true } | { success: false; error: string };

export async function createFulfillmentAction(orderId: string): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  if (typeof orderId !== "string" || orderId.trim().length === 0) {
    return { success: false, error: "Identifiant de commande invalide." };
  }

  if (!(await isFulfillmentFeatureActive())) {
    return { success: false, error: "La préparation logistique n'est pas activée." };
  }

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return { success: false, error: "Boutique introuvable." };
  }

  try {
    await createFulfillment({ orderId: orderId.trim(), storeId });
    revalidatePath(`/admin/commerce/orders/${orderId.trim()}`);
    return { success: true };
  } catch (error) {
    if (error instanceof CreateFulfillmentError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur inattendue. Réessayez." };
  }
}
