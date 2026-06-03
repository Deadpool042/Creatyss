"use server";

import { z } from "zod";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";

const storeConfigSchema = z.object({
  status: z.enum(["DRAFT", "ACTIVE", "SUSPENDED", "ARCHIVED"]),
  isProduction: z.enum(["true", "false"]).transform((v) => v === "true"),
});

export type StoreConfigFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export async function updateAdminStoreConfigAction(
  _prevState: StoreConfigFormState,
  formData: FormData
): Promise<StoreConfigFormState> {
  await requireAuthenticatedAdmin();

  const parsed = storeConfigSchema.safeParse({
    status: formData.get("status"),
    isProduction: formData.get("isProduction"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Données invalides." };
  }

  try {
    const store = await db.store.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true, status: true } });
    if (!store) return { status: "error", message: "Boutique introuvable." };

    const wasActive = store.status === "ACTIVE";
    const becomesActive = parsed.data.status === "ACTIVE";

    await db.store.update({
      where: { id: store.id },
      data: {
        status: parsed.data.status as never,
        isProduction: parsed.data.isProduction,
        // Enregistrer la date d'activation la première fois
        ...(!wasActive && becomesActive ? { activatedAt: new Date() } : {}),
      },
    });

    const labels: Record<string, string> = {
      DRAFT: "Brouillon",
      ACTIVE: "Active",
      SUSPENDED: "Suspendue",
      ARCHIVED: "Archivée",
    };

    return {
      status: "success",
      message: becomesActive && !wasActive
        ? "Boutique activée — la date d'activation a été enregistrée."
        : `Statut mis à jour : ${labels[parsed.data.status] ?? parsed.data.status}.`,
    };
  } catch {
    return { status: "error", message: "Erreur lors de la sauvegarde. Réessayez." };
  }
}
