"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export type ToggleWebhookEndpointResult = { ok: true } | { ok: false; error: string };

export async function toggleWebhookEndpointAction(
  endpointId: string
): Promise<ToggleWebhookEndpointResult> {
  await requireAuthenticatedAdmin();

  if (!(await meetsFeatureLevel("platform.webhooks", "manage"))) {
    return { ok: false, error: "Niveau webhooks insuffisant pour modifier un endpoint." };
  }

  const storeId = await getCurrentStoreId();
  if (!storeId) {
    return { ok: false, error: "Boutique introuvable." };
  }

  const endpoint = await db.webhookEndpoint.findFirst({
    where: {
      id: endpointId,
      OR: [{ storeId }, { storeId: null }],
      archivedAt: null,
    },
    select: { id: true, status: true },
  });

  if (!endpoint) {
    return { ok: false, error: "Endpoint introuvable." };
  }

  if (endpoint.status === "ARCHIVED" || endpoint.status === "FAILED") {
    return {
      ok: false,
      error: `L'endpoint ne peut pas être activé/désactivé dans son état actuel (${endpoint.status}).`,
    };
  }

  const isActivating = endpoint.status !== "ACTIVE";

  await db.webhookEndpoint.update({
    where: { id: endpoint.id },
    data: {
      status: isActivating ? "ACTIVE" : "INACTIVE",
      isEnabled: isActivating,
    },
  });

  revalidatePath("/admin/settings/webhooks");

  return { ok: true };
}
