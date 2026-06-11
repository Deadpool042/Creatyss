"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { PUBLIC_LEGAL_PATHS } from "../constants/public-legal-paths";
import type { AdminPageBodyFormState } from "../schemas/admin-page-body.schema";

/**
 * Publie (ACTIVE) ou dépublie (DRAFT) une page système.
 * Garde-fous à la publication :
 * - body vide → refus (la route publique répondrait 404 de toute façon) ;
 * - body contenant un marqueur [TODO → refus (cohérent avec le seed : un TODO ne se publie pas).
 * Ne touche jamais title/code/slug/body. Pages éditoriales hors périmètre.
 */
export async function toggleAdminPageStatusAction(
  pageId: string,
  _prevState: AdminPageBodyFormState,
  _formData: FormData
): Promise<AdminPageBodyFormState> {
  await requireAdminCapability("admin.content.pages.write");

  try {
    const page = await db.page.findUnique({
      where: { id: pageId },
      select: { id: true, code: true, status: true, isSystemPage: true, body: true },
    });

    if (page === null) {
      return { status: "error", message: "Page introuvable." };
    }

    if (!page.isSystemPage) {
      return {
        status: "error",
        message: "La publication des pages éditoriales n'est pas disponible.",
      };
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

    const publicPath = PUBLIC_LEGAL_PATHS[page.code];
    if (publicPath !== undefined) {
      revalidatePath(publicPath);
    }

    return {
      status: "success",
      message: isPublishing ? "Page publiée." : "Page dépubliée.",
    };
  } catch {
    return { status: "error", message: "Erreur lors du changement de statut. Réessayez." };
  }
}
