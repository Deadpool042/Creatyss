"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { ADMIN_MARKETING_INTENTS_PATH } from "@/features/admin/marketing/shared/admin-marketing-routes";
import { projectPendingEditorialDomainEvents } from "@/features/marketing/editorial-intents/project-pending-editorial-domain-events.service";
import { projectPendingCommerceDomainEvents } from "@/features/marketing/commerce-intents/project-pending-commerce-domain-events.service";

export type RefreshMarketingIntentsResult = Awaited<
  ReturnType<typeof projectPendingEditorialDomainEvents>
>;

function sumSummaries(
  a: RefreshMarketingIntentsResult,
  b: RefreshMarketingIntentsResult
): RefreshMarketingIntentsResult {
  return {
    scanned: a.scanned + b.scanned,
    created: a.created + b.created,
    merged: a.merged + b.merged,
    deduplicated: a.deduplicated + b.deduplicated,
    ignored: a.ignored + b.ignored,
    skipped: a.skipped + b.skipped,
    failed: a.failed + b.failed,
  };
}

/**
 * Rattrapage manuel agrégé : rejoue les deux pipelines de projection
 * (`editorial-marketing-intents` et `commerce-intents`, parallèles et
 * indépendants) depuis un unique point d'entrée admin, et agrège leurs
 * compteurs. Chaque scope garde son propre consumerCode et sa propre
 * policy ; seul ce déclenchement est mutualisé.
 */
export async function refreshMarketingIntentsAction(): Promise<RefreshMarketingIntentsResult> {
  await requireAuthenticatedAdmin();

  const [editorial, commerce] = await Promise.all([
    projectPendingEditorialDomainEvents(),
    projectPendingCommerceDomainEvents(),
  ]);

  revalidatePath(ADMIN_MARKETING_INTENTS_PATH);

  return sumSummaries(editorial, commerce);
}
