"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import type { AdminPageBodyFormState } from "../schemas/admin-page-body.schema";

/**
 * Publie (ACTIVE) ou dépublie (DRAFT) une page éditoriale.
 * Garde-fous à la publication :
 * - body vide → refus ;
 * - body contenant [TODO → refus.
 * Pages système : refusées explicitement (utiliser toggleAdminPageStatusAction).
 */
export async function toggleAdminEditorialPageStatusAction(
  pageId: string,
  _prevState: AdminPageBodyFormState,
  _formData: FormData
): Promise<AdminPageBodyFormState> {
  await requireAdminCapability("admin.content.pages.write");

  try {
    const page = await db.page.findUnique({
      where: { id: pageId },
      select: { id: true, status: true, isSystemPage: true, body: true },
    });

    if (page === null) {
      return { status: "error", message: "Page introuvable." };
    }

    if (page.isSystemPage) {
      return { status: "error", message: "Les pages système utilisent un autre mécanisme de publication." };
    }

    const body = page.body?.trim() ?? "";
    const isPublishing = page.status !== "ACTIVE";

    if (isPublishing && body === "") {
      return { status: "error", message: "Impossible de publier une page sans contenu." };
    }

    if (isPublishing && body.includes("[TODO")) {
      return {
        status: "error",
        message: "Le texte contient encore des marqueurs [TODO …] : traitez-les avant de publier.",
      };
    }

    await db.page.update({
      where: { id: page.id },
      data: isPublishing
        ? { status: "ACTIVE", publishedAt: new Date() }
        : { status: "DRAFT" },
    });

    revalidatePath("/admin/content/pages");
    revalidatePath(`/admin/content/pages/${page.id}`);

    return {
      status: "success",
      message: isPublishing ? "Page publiée." : "Page dépubliée.",
    };
  } catch {
    return { status: "error", message: "Erreur lors du changement de statut. Réessayez." };
  }
}
