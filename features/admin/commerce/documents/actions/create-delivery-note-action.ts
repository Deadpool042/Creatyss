"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { isDocumentsFeatureActive } from "@/features/admin/commerce/documents/queries/is-documents-feature-active.query";
import {
  createDeliveryNote,
  CreateDeliveryNoteError,
} from "@/features/admin/commerce/documents/services/create-delivery-note.service";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

type CreateDeliveryNoteActionResult =
  | { success: true }
  | { success: false; error: string };

export async function createDeliveryNoteAction(
  orderId: string
): Promise<CreateDeliveryNoteActionResult> {
  await requireAuthenticatedAdmin();

  if (typeof orderId !== "string" || orderId.trim().length === 0) {
    return { success: false, error: "Identifiant de commande invalide." };
  }

  const featureActive = await isDocumentsFeatureActive();
  if (!featureActive) {
    return { success: false, error: "La fonctionnalité documents n'est pas activée." };
  }

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return { success: false, error: "Boutique introuvable." };
  }

  try {
    await createDeliveryNote({ orderId: orderId.trim(), storeId });
    revalidatePath(`/admin/commerce/orders/${orderId.trim()}/documents`);
    revalidatePath(`/admin/commerce/orders/${orderId.trim()}`);
    return { success: true };
  } catch (error) {
    if (error instanceof CreateDeliveryNoteError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur inattendue. Réessayez." };
  }
}
