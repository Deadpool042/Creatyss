"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";

type ActionResult = { status: "success" | "error"; message: string };

export async function suspendAdminUserAction(formData: FormData): Promise<ActionResult> {
  await requireAdminCapability("admin.settings.team.suspend");
  const currentAdmin = await requireAuthenticatedAdmin();

  const userId = formData.get("userId");

  if (typeof userId !== "string" || userId.trim() === "") {
    return { status: "error", message: "Identifiant utilisateur manquant." };
  }

  if (userId === currentAdmin.id) {
    return { status: "error", message: "Vous ne pouvez pas suspendre votre propre compte." };
  }

  const target = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, status: true },
  });

  if (!target) {
    return { status: "error", message: "Utilisateur introuvable." };
  }

  if (target.status !== "ACTIVE") {
    return { status: "error", message: "Action impossible sur ce compte." };
  }

  const activeCount = await db.user.count({
    where: { status: "ACTIVE", archivedAt: null },
  });

  if (activeCount <= 1) {
    return { status: "error", message: "Impossible de suspendre le dernier administrateur actif." };
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: { status: "SUSPENDED", suspendedAt: new Date() },
    });
  } catch {
    return { status: "error", message: "Erreur serveur. Réessayez." };
  }

  revalidatePath("/admin/settings/team");
  return { status: "success", message: "Compte suspendu." };
}
