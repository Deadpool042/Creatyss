"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import {
  adminPageBodySchema,
  type AdminPageBodyFormState,
} from "../schemas/admin-page-body.schema";

import { PUBLIC_LEGAL_PATHS } from "../constants/public-legal-paths";

/**
 * Met à jour uniquement le corps d'une page système.
 * title/code/slug/status ne sont jamais modifiés ici.
 * Les pages éditoriales (non système) ne sont pas éditables dans ce lot.
 */
export async function updateAdminPageBodyAction(
  pageId: string,
  _prevState: AdminPageBodyFormState,
  formData: FormData
): Promise<AdminPageBodyFormState> {
  await requireAdminCapability("admin.content.pages.write");

  const parsed = adminPageBodySchema.safeParse({
    body: formData.get("body") ?? "",
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Texte invalide.";
    return { status: "error", message, fieldError: message };
  }

  try {
    const page = await db.page.findUnique({
      where: { id: pageId },
      select: { id: true, code: true, isSystemPage: true },
    });

    if (page === null) {
      return { status: "error", message: "Page introuvable." };
    }

    if (!page.isSystemPage) {
      return {
        status: "error",
        message: "L'édition des pages éditoriales n'est pas encore disponible.",
      };
    }

    await db.page.update({
      where: { id: page.id },
      data: { body: parsed.data.body || null },
    });

    revalidatePath("/admin/content/pages");
    revalidatePath(`/admin/content/pages/${page.id}`);

    const publicPath = PUBLIC_LEGAL_PATHS[page.code];
    if (publicPath !== undefined) {
      revalidatePath(publicPath);
    }

    return { status: "success", message: "Page enregistrée." };
  } catch {
    return { status: "error", message: "Erreur lors de la sauvegarde. Réessayez." };
  }
}
