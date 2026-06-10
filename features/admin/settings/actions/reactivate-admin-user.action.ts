"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";

type ActionResult = { status: "success" | "error"; message: string };

export async function reactivateAdminUserAction(formData: FormData): Promise<ActionResult> {
  await requireAdminCapability("admin.settings.team.suspend");
  const currentAdmin = await requireAuthenticatedAdmin();

  const userId = formData.get("userId");

  if (typeof userId !== "string" || userId.trim() === "") {
    return { status: "error", message: "Identifiant utilisateur manquant." };
  }

  if (userId === currentAdmin.id) {
    return { status: "error", message: "Action impossible sur votre propre compte." };
  }

  const target = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, status: true, activatedAt: true },
  });

  if (!target) {
    return { status: "error", message: "Utilisateur introuvable." };
  }

  if (target.status !== "SUSPENDED") {
    return { status: "error", message: "Action impossible sur ce compte." };
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: {
        status: "ACTIVE",
        suspendedAt: null,
        activatedAt: target.activatedAt ?? new Date(),
      },
    });
  } catch {
    return { status: "error", message: "Erreur serveur. Réessayez." };
  }

  revalidatePath("/admin/settings/team");
  return { status: "success", message: "Compte réactivé." };
}
