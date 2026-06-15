"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { isReturnsFeatureActive } from "@/features/admin/commerce/returns/queries/is-returns-feature-active.query";
import {
  createReturnRequest,
  CreateReturnRequestError,
} from "@/features/admin/commerce/returns/services/create-return-request.service";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

type ActionResult = { success: true } | { success: false; error: string };

export async function createReturnAction(orderId: string): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  if (typeof orderId !== "string" || orderId.trim().length === 0) {
    return { success: false, error: "Identifiant de commande invalide." };
  }

  if (!(await isReturnsFeatureActive())) {
    return { success: false, error: "Les retours ne sont pas activés." };
  }

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return { success: false, error: "Boutique introuvable." };
  }

  try {
    await createReturnRequest({ orderId: orderId.trim(), storeId });
    revalidatePath(`/admin/commerce/orders/${orderId.trim()}`);
    return { success: true };
  } catch (error) {
    if (error instanceof CreateReturnRequestError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur inattendue. Réessayez." };
  }
}
