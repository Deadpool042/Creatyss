"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { isDocumentsFeatureActive } from "@/features/admin/commerce/documents/queries/is-documents-feature-active.query";
import {
  createOrderConfirmation,
  CreateOrderConfirmationError,
} from "@/features/admin/commerce/documents/services/create-order-confirmation.service";

type CreateOrderConfirmationActionResult =
  | { success: true }
  | { success: false; error: string };

export async function createOrderConfirmationAction(
  orderId: string
): Promise<CreateOrderConfirmationActionResult> {
  await requireAuthenticatedAdmin();

  if (typeof orderId !== "string" || orderId.trim().length === 0) {
    return { success: false, error: "Identifiant de commande invalide." };
  }

  const featureActive = await isDocumentsFeatureActive();
  if (!featureActive) {
    return { success: false, error: "La fonctionnalité documents n'est pas activée." };
  }

  const store = await db.store.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (store === null) {
    return { success: false, error: "Boutique introuvable." };
  }

  try {
    await createOrderConfirmation({ orderId: orderId.trim(), storeId: store.id });
    revalidatePath(`/admin/commerce/orders/${orderId.trim()}/documents`);
    revalidatePath(`/admin/commerce/orders/${orderId.trim()}`);
    return { success: true };
  } catch (error) {
    if (error instanceof CreateOrderConfirmationError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur inattendue. Réessayez." };
  }
}
