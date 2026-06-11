import "server-only";

import { db } from "@/core/db";

import type { AdminPageDetail } from "../types";

/**
 * Détail d'une page admin par id. Lecture seule, ne crée rien.
 */
export async function getAdminPageDetail(id: string): Promise<AdminPageDetail | null> {
  const page = await db.page.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      code: true,
      slug: true,
      status: true,
      isSystemPage: true,
      shortDescription: true,
      body: true,
      updatedAt: true,
    },
  });

  if (page === null) return null;

  return {
    id: page.id,
    title: page.title,
    code: page.code,
    slug: page.slug,
    status: page.status,
    isSystemPage: page.isSystemPage,
    excerpt: page.shortDescription,
    body: page.body,
    updatedAt: page.updatedAt.toISOString(),
  };
}
