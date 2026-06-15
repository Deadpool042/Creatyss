"use server";

import { revalidatePath } from "next/cache";

import type { ReturnRequestStatus } from "@/prisma-generated/client";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { isReturnsFeatureActive } from "@/features/admin/commerce/returns/queries/is-returns-feature-active.query";
import {
  advanceReturnStatus,
  AdvanceReturnError,
} from "@/features/admin/commerce/returns/services/advance-return-status.service";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

type ActionResult = { success: true } | { success: false; error: string };

const ALLOWED_TARGETS: ReadonlyArray<ReturnRequestStatus> = [
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "RECEIVED",
  "REFUNDED",
  "CLOSED",
  "CANCELLED",
];

export async function advanceReturnAction(
  returnRequestId: string,
  orderId: string,
  nextStatus: ReturnRequestStatus
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  if (typeof returnRequestId !== "string" || returnRequestId.trim().length === 0) {
    return { success: false, error: "Identifiant de retour invalide." };
  }

  if (!ALLOWED_TARGETS.includes(nextStatus)) {
    return { success: false, error: "Transition non autorisée." };
  }

  if (!(await isReturnsFeatureActive())) {
    return { success: false, error: "Les retours ne sont pas activés." };
  }

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return { success: false, error: "Boutique introuvable." };
  }

  try {
    await advanceReturnStatus({ returnRequestId: returnRequestId.trim(), storeId, nextStatus });
    revalidatePath(`/admin/commerce/orders/${orderId.trim()}`);
    return { success: true };
  } catch (error) {
    if (error instanceof AdvanceReturnError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur inattendue. Réessayez." };
  }
}
