"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";

type ActionResult = { status: "success" | "error"; message: string };

export async function revokeApiClientAction(formData: FormData): Promise<ActionResult> {
  await requireAdminCapability("admin.settings.api-clients.revoke");

  const clientId = formData.get("clientId");

  if (typeof clientId !== "string" || clientId.trim() === "") {
    return { status: "error", message: "Identifiant client manquant." };
  }

  const client = await db.apiClient.findUnique({
    where: { clientId },
    select: { id: true, status: true },
  });

  if (!client) {
    return { status: "error", message: "Client API introuvable." };
  }

  if (client.status !== "ACTIVE") {
    const labels: Record<string, string> = {
      DRAFT: "brouillon",
      INACTIVE: "inactif",
      REVOKED: "déjà révoqué",
      ARCHIVED: "archivé",
    };
    const label = labels[client.status] ?? client.status.toLowerCase();
    return { status: "error", message: `Ce client est ${label} et ne peut pas être révoqué.` };
  }

  const now = new Date();

  try {
    await db.$transaction([
      db.apiClient.update({
        where: { id: client.id },
        data: { status: "REVOKED", revokedAt: now },
      }),
      db.apiClientSecret.updateMany({
        where: { apiClientId: client.id, status: "ACTIVE" },
        data: { status: "REVOKED", revokedAt: now },
      }),
    ]);
  } catch {
    return { status: "error", message: "Erreur lors de la révocation. Réessayez." };
  }

  revalidatePath("/admin/settings/api-clients");
  return { status: "success", message: "Client API révoqué." };
}
