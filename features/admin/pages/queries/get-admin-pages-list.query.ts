import "server-only";

import { db } from "@/core/db";

import type { AdminPagesListItem } from "../types";

/**
 * Liste toutes les pages du store (système et éditoriales) pour l'admin.
 * Lecture seule : ne crée jamais de page absente.
 * Pages système en tête de liste, puis tri alphabétique.
 */
export async function getAdminPagesList(): Promise<ReadonlyArray<AdminPagesListItem>> {
  const pages = await db.page.findMany({
    orderBy: [{ isSystemPage: "desc" }, { title: "asc" }],
    select: {
      id: true,
      title: true,
      code: true,
      slug: true,
      status: true,
      isSystemPage: true,
      body: true,
      updatedAt: true,
    },
  });

  return pages.map((page) => ({
    id: page.id,
    title: page.title,
    code: page.code,
    slug: page.slug,
    status: page.status,
    isSystemPage: page.isSystemPage,
    bodyIsEmpty: (page.body?.trim() ?? "") === "",
    updatedAt: page.updatedAt.toISOString(),
  }));
}
