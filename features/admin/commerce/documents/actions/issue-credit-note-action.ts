"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { isDocumentsFeatureActive } from "@/features/admin/commerce/documents/queries/is-documents-feature-active.query";
import {
  issueCreditNote,
  IssueCreditNoteError,
} from "@/features/admin/commerce/documents/services/issue-credit-note.service";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

type IssueCreditNoteActionResult = { success: true } | { success: false; error: string };

export async function issueCreditNoteAction(orderId: string): Promise<IssueCreditNoteActionResult> {
  await requireAuthenticatedAdmin();

  if (typeof orderId !== "string" || orderId.trim().length === 0) {
    return { success: false, error: "Identifiant de commande invalide." };
  }

  const featureActive = await isDocumentsFeatureActive();
  if (!featureActive) {
    return { success: false, error: "La fonctionnalité documents n'est pas activée." };
  }

  if (!(await meetsFeatureLevel("commerce.documents", "fiscal"))) {
    return { success: false, error: "L'émission d'avoir n'est pas activée pour ce niveau." };
  }

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return { success: false, error: "Boutique introuvable." };
  }

  try {
    await issueCreditNote({ orderId: orderId.trim(), storeId });
    revalidatePath(`/admin/commerce/orders/${orderId.trim()}/documents`);
    revalidatePath(`/admin/commerce/orders/${orderId.trim()}`);
    return { success: true };
  } catch (error) {
    if (error instanceof IssueCreditNoteError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur inattendue. Réessayez." };
  }
}
