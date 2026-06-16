import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE } from "@/features/automations/shared/automation-job.constants";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

export type AdminNewsletterAutomationSnapshot = {
  newsletterAutomationLevelMet: boolean;
  automationsFeatureActive: boolean;
  activeAutomationCount: number;
  pendingJobCount: number;
  readyJobCount: number;
  failedJobCount: number;
};

export async function getAdminNewsletterAutomationSnapshot(): Promise<AdminNewsletterAutomationSnapshot> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return {
      newsletterAutomationLevelMet: false,
      automationsFeatureActive: false,
      activeAutomationCount: 0,
      pendingJobCount: 0,
      readyJobCount: 0,
      failedJobCount: 0,
    };
  }

  const [newsletterAutomationLevelMet, automationsFeatureActive, activeAutomationCount, pendingJobCount, readyJobCount, failedJobCount] =
    await Promise.all([
      meetsFeatureLevel("engagement.newsletter", "automation", { storeId }),
      queryFeatureFlagActive("engagement.automations", { storeId }),
      db.automation.count({
        where: {
          storeId,
          status: "ACTIVE",
          triggerType: "NEWSLETTER_SUBSCRIBED",
          archivedAt: null,
        },
      }),
      db.job.count({
        where: {
          storeId,
          typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
          status: "PENDING",
          archivedAt: null,
        },
      }),
      db.job.count({
        where: {
          storeId,
          typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
          status: "PENDING",
          archivedAt: null,
          scheduledAt: { lte: new Date() },
        },
      }),
      db.job.count({
        where: {
          storeId,
          typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE,
          status: "FAILED",
          archivedAt: null,
        },
      }),
    ]);

  return {
    newsletterAutomationLevelMet,
    automationsFeatureActive,
    activeAutomationCount,
    pendingJobCount,
    readyJobCount,
    failedJobCount,
  };
}
