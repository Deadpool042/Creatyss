"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { createWebhookEndpointSchema } from "@/features/admin/settings/webhooks/schemas/create-webhook-endpoint.schema";

export type CreateWebhookEndpointResult = { ok: false; error: string };

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export async function createWebhookEndpointAction(
  formData: FormData
): Promise<CreateWebhookEndpointResult> {
  await requireAuthenticatedAdmin();

  if (!(await meetsFeatureLevel("platform.webhooks", "manage"))) {
    return { ok: false, error: "Niveau webhooks insuffisant pour créer un endpoint." };
  }

  const raw = {
    name: formData.get("name"),
    targetUrl: formData.get("targetUrl"),
    eventType: formData.get("eventType"),
  };

  const parsed = createWebhookEndpointSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { ok: false, error: firstError?.message ?? "Données invalides." };
  }

  const storeId = await getCurrentStoreId();

  if (!storeId) {
    return { ok: false, error: "Boutique introuvable." };
  }

  // Secret brut stocké en clair (V1 — simplification documentée, pas un vrai hash)
  const secret = `whs_${randomBytes(24).toString("hex")}`;
  const secretPrefix = secret.slice(0, 12);
  const secretHash = secret;
  const code = `${slugify(parsed.data.name)}-${randomBytes(3).toString("hex")}`;

  try {
    await db.webhookEndpoint.create({
      data: {
        storeId,
        code,
        name: parsed.data.name,
        targetUrl: parsed.data.targetUrl,
        eventType: parsed.data.eventType,
        secretHash,
        secretPrefix,
        status: "DRAFT",
        isEnabled: false,
      },
    });
  } catch (err) {
    const prismaCode = (err as { code?: string }).code;
    if (prismaCode === "P2002") {
      return {
        ok: false,
        error:
          "Un endpoint avec ce code existe déjà pour cette boutique. Changez le nom et réessayez.",
      };
    }
    return { ok: false, error: "Erreur lors de la création. Réessayez." };
  }

  // Le secret est passé une seule fois via searchParams pour affichage immédiat.
  // Il n'est jamais affiché à nouveau après navigation.
  redirect(`/admin/settings/webhooks?endpoint_created=1&secret=${encodeURIComponent(secret)}`);
}
