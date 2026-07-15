"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { ADMIN_MARKETING_INTENTS_PATH } from "@/features/admin/marketing/shared/admin-marketing-routes";
import { projectPendingEditorialDomainEvents } from "@/features/marketing/editorial-intents/project-pending-editorial-domain-events.service";

export type RefreshMarketingIntentsResult = Awaited<
  ReturnType<typeof projectPendingEditorialDomainEvents>
>;

export async function refreshMarketingIntentsAction(): Promise<RefreshMarketingIntentsResult> {
  await requireAuthenticatedAdmin();

  const result = await projectPendingEditorialDomainEvents();

  revalidatePath(ADMIN_MARKETING_INTENTS_PATH);

  return result;
}
