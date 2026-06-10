"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { createApiClientSchema } from "@/features/admin/settings/schemas/create-api-client.schema";

type ActionResult = { status: "success" | "error"; message: string; secret?: string };

export async function createApiClientAction(formData: FormData): Promise<ActionResult> {
  await requireAdminCapability("admin.settings.api-clients.write");

  const raw = {
    name: formData.get("name"),
    code: formData.get("code"),
    description: formData.get("description") || undefined,
  };

  const parsed = createApiClientSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { status: "error", message: firstError?.message ?? "Données invalides." };
  }

  const { name, code, description } = parsed.data;

  const storeId = await getCurrentStoreId();

  if (!storeId) {
    return { status: "error", message: "Boutique introuvable." };
  }

  const existingCode = await db.apiClient.findUnique({
    where: { storeId_code: { storeId, code } },
    select: { id: true },
  });

  if (existingCode) {
    return { status: "error", message: "Ce code est déjà utilisé par un autre client." };
  }

  // clientId : identifiant public stable
  const clientId = "apiclient_" + randomBytes(12).toString("hex");

  // secret brut + format affiché
  const rawSecret = randomBytes(32).toString("base64url");
  const secretPrefix = rawSecret.slice(0, 8);
  const displaySecret = `csk_${secretPrefix}_${rawSecret}`;
  const secretHash = createHash("sha256").update(displaySecret).digest("hex");

  const now = new Date();

  try {
    await db.$transaction(async (tx) => {
      const client = await tx.apiClient.create({
        data: {
          storeId,
          clientId,
          code,
          name,
          description: description ?? null,
          status: "ACTIVE",
          activatedAt: now,
        },
        select: { id: true },
      });

      await tx.apiClientSecret.create({
        data: {
          apiClientId: client.id,
          secretHash,
          secretPrefix,
          status: "ACTIVE",
        },
      });
    });
  } catch {
    return { status: "error", message: "Erreur lors de la création. Réessayez." };
  }

  revalidatePath("/admin/settings/api-clients");
  return { status: "success", message: "Client API créé.", secret: displaySecret };
}
