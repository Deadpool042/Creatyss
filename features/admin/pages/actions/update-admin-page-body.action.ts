"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import {
  adminPageBodySchema,
  type AdminPageBodyFormState,
} from "../schemas/admin-page-body.schema";

import { PUBLIC_LEGAL_PATHS } from "../constants/public-legal-paths";
import { recordPageUpdatedDomainEvent } from "../services/record-page-domain-events";

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
    const page = await db.$transaction(async (tx) => {
      const existing = await tx.page.findUnique({
        where: { id: pageId },
        select: {
          id: true,
          storeId: true,
          code: true,
          title: true,
          slug: true,
          status: true,
          publishedAt: true,
          isSystemPage: true,
          shortDescription: true,
          body: true,
          updatedAt: true,
        },
      });

      if (existing === null) {
        return null;
      }

      if (!existing.isSystemPage) {
        return "editorial_page" as const;
      }

      const updated = await tx.page.update({
        where: { id: existing.id },
        data: { body: parsed.data.body || null },
        select: {
          id: true,
          storeId: true,
          code: true,
          title: true,
          slug: true,
          status: true,
          publishedAt: true,
          isSystemPage: true,
          shortDescription: true,
          body: true,
          updatedAt: true,
        },
      });

      await recordPageUpdatedDomainEvent({
        executor: tx,
        previous: existing,
        next: updated,
      });

      return updated;
    });

    if (page === null) {
      return { status: "error", message: "Page introuvable." };
    }

    if (page === "editorial_page") {
      return {
        status: "error",
        message: "L'édition des pages éditoriales n'est pas encore disponible.",
      };
    }

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
