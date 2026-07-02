"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { isDocumentsFeatureActive } from "@/features/admin/commerce/documents/queries/is-documents-feature-active.query";
import {
  issueInvoice,
  IssueInvoiceError,
} from "@/features/admin/commerce/documents/services/issue-invoice.service";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

type IssueInvoiceActionResult = { success: true } | { success: false; error: string };

export async function issueInvoiceAction(orderId: string): Promise<IssueInvoiceActionResult> {
  await requireAuthenticatedAdmin();

  if (typeof orderId !== "string" || orderId.trim().length === 0) {
    return { success: false, error: "Identifiant de commande invalide." };
  }

  const featureActive = await isDocumentsFeatureActive();
  if (!featureActive) {
    return { success: false, error: "La fonctionnalité documents n'est pas activée." };
  }

  if (!(await meetsFeatureLevel("commerce.documents", "fiscal"))) {
    return { success: false, error: "L'émission de facture n'est pas activée pour ce niveau." };
  }

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return { success: false, error: "Boutique introuvable." };
  }

  try {
    await issueInvoice({ orderId: orderId.trim(), storeId });
    revalidatePath(`/admin/commerce/orders/${orderId.trim()}/documents`);
    revalidatePath(`/admin/commerce/orders/${orderId.trim()}`);
    return { success: true };
  } catch (error) {
    if (error instanceof IssueInvoiceError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur inattendue. Réessayez." };
  }
}
