"use server";

import { revalidatePath } from "next/cache";
import { UserType } from "@/prisma-generated/client";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { hashAdminPassword } from "@/core/auth/admin/password";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { createAdminUserSchema } from "@/features/admin/settings/schemas/create-admin-user.schema";

type ActionResult = { status: "success" | "error"; message: string };

export async function createAdminUserAction(formData: FormData): Promise<ActionResult> {
  await requireAdminCapability("admin.settings.team.write");

  const raw = {
    email: formData.get("email"),
    displayName: formData.get("displayName"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = createAdminUserSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return {
      status: "error",
      message: firstError?.message ?? "Données invalides.",
    };
  }

  const { email, displayName, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email }, select: { id: true } });

  if (existing) {
    return { status: "error", message: "Un utilisateur avec cet email existe déjà." };
  }

  const [adminRole, internalSuperAdminRole] = await Promise.all([
    db.role.findUnique({ where: { code: "admin" }, select: { id: true } }),
    db.role.findUnique({ where: { code: "internal_super_admin" }, select: { id: true } }),
  ]);

  if (!adminRole || !internalSuperAdminRole) {
    return { status: "error", message: "Rôles système introuvables. Contactez un administrateur technique." };
  }

  const storeId = await getCurrentStoreId();

  if (!storeId) {
    return { status: "error", message: "Boutique introuvable." };
  }

  const secretHash = await hashAdminPassword(password);
  const now = new Date();

  try {
    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          storeId,
          email,
          displayName,
          type: UserType.STORE,
          status: "ACTIVE",
          invitedAt: now,
          activatedAt: now,
        },
        select: { id: true },
      });

      await tx.userCredential.create({
        data: {
          userId: user.id,
          type: "PASSWORD",
          identifier: email,
          secretHash,
          isPrimary: true,
          isActive: true,
        },
      });

      await tx.userRole.createMany({
        data: [
          { userId: user.id, roleId: adminRole.id },
          { userId: user.id, roleId: internalSuperAdminRole.id },
        ],
      });
    });
  } catch {
    return { status: "error", message: "Erreur lors de la création. Réessayez." };
  }

  revalidatePath("/admin/settings/team");
  return { status: "success", message: "Utilisateur créé avec succès." };
}
