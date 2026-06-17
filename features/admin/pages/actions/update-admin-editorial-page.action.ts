"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  adminEditorialPageSchema,
  type AdminEditorialPageFormState,
} from "../schemas/admin-editorial-page.schema";

/**
 * Met à jour les champs éditables d'une page éditoriale (non système) :
 * title, slug, shortDescription, body.
 * Vérifie l'unicité du slug dans le store avant de sauvegarder.
 * Pages système : refusées explicitement.
 */
export async function updateAdminEditorialPageAction(
  pageId: string,
  _prevState: AdminEditorialPageFormState,
  formData: FormData
): Promise<AdminEditorialPageFormState> {
  await requireAdminCapability("admin.content.pages.write");

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return { status: "error", message: "Aucun store actif trouvé." };
  }

  const parsed = adminEditorialPageSchema.safeParse({
    title: formData.get("title") ?? "",
    slug: formData.get("slug") ?? "",
    excerpt: formData.get("excerpt") ?? "",
    body: formData.get("body") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<"title" | "slug" | "excerpt" | "body", string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as "title" | "slug" | "excerpt" | "body";
      if (key && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return {
      status: "error",
      message: "Formulaire invalide.",
      fieldErrors,
    };
  }

  try {
    const page = await db.page.findUnique({
      where: { id: pageId },
      select: { id: true, isSystemPage: true, slug: true, storeId: true },
    });

    if (page === null) {
      return { status: "error", message: "Page introuvable." };
    }

    if (page.isSystemPage) {
      return { status: "error", message: "Les pages système ne sont pas éditables ici." };
    }

    if (page.storeId !== storeId) {
      return { status: "error", message: "Cette page n'appartient pas au store courant." };
    }

    const { title, slug, excerpt, body } = parsed.data;

    // Vérifier l'unicité du slug si modifié
    if (slug !== page.slug) {
      const existing = await db.page.findFirst({
        where: { storeId, slug, NOT: { id: pageId } },
        select: { id: true },
      });
      if (existing !== null) {
        return {
          status: "error",
          message: "Ce slug est déjà utilisé par une autre page.",
          fieldErrors: { slug: "Slug déjà utilisé." },
        };
      }
    }

    await db.page.update({
      where: { id: page.id },
      data: {
        title,
        slug,
        shortDescription: excerpt === undefined || excerpt === "" ? null : excerpt,
        body: body === undefined || body === "" ? null : body,
      },
    });

    revalidatePath("/admin/content/pages");
    revalidatePath(`/admin/content/pages/${page.id}`);

    return { status: "success", message: "Page enregistrée." };
  } catch {
    return { status: "error", message: "Erreur lors de la sauvegarde. Réessayez." };
  }
}
