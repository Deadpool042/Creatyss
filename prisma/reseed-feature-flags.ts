/**
 * Reseed ciblé des FeatureFlag (allowedLevels/defaultLevel/status) — sans
 * données de démo (seedCustomers, seedBlogPosts). Safe à rejouer sur tout
 * environnement, y compris production, après toute PR qui modifie les
 * niveaux d'une feature graduée (cf. docs/audit/2026-07-03-audit-feature-levels.md).
 *
 * `prisma/seed.ts` reste le seed complet pour le développement local.
 */
import { createScriptPrismaClient } from "../scripts/helpers/prisma-client";
import { seedAdminNavigationAccess } from "./seed/admin-navigation-access.seed";
import { seedAiFeatureFlag } from "./seed/ai-feature-flag.seed";
import { seedAnalyticsFeatureFlag } from "./seed/analytics-feature-flag.seed";
import { seedAutomationsFeatureFlag } from "./seed/automations-feature-flag.seed";
import { seedChannelsFeatureFlag } from "./seed/channels-feature-flag.seed";
import { seedCoreCrossCuttingFlags } from "./seed/core-cross-cutting-flags.seed";
import { seedDiscountsFeatureFlag } from "./seed/discounts-feature-flag.seed";
import { seedDocumentsFeatureFlag } from "./seed/documents-feature-flag.seed";
import { seedFeatureFlagsCatalog } from "./seed/feature-flags-catalog.seed";
import { seedFulfillmentFeatureFlag } from "./seed/fulfillment-feature-flag.seed";
import { seedIntegrationsFeatureFlag } from "./seed/integrations-feature-flag.seed";
import { seedLocalizationFeatureFlag } from "./seed/localization-feature-flag.seed";
import { seedNewsletterFeatureFlag } from "./seed/newsletter-feature-flag.seed";
import { seedNotificationsFeatureFlag } from "./seed/notifications-feature-flag.seed";
import { seedReturnsFeatureFlag } from "./seed/returns-feature-flag.seed";
import { seedSearchFeatureFlag } from "./seed/search-feature-flag.seed";
import { seedTaxationFeatureFlag } from "./seed/taxation-feature-flag.seed";
import { seedWebhooksFeatureFlag } from "./seed/webhooks-feature-flag.seed";

const prisma = createScriptPrismaClient();

async function main(): Promise<void> {
  await seedAdminNavigationAccess(prisma);
  await seedFeatureFlagsCatalog(prisma);
  await seedCoreCrossCuttingFlags(prisma);
  await seedAiFeatureFlag(prisma);
  await seedAnalyticsFeatureFlag(prisma);
  await seedAutomationsFeatureFlag(prisma);
  await seedChannelsFeatureFlag(prisma);
  await seedDiscountsFeatureFlag(prisma);
  await seedDocumentsFeatureFlag(prisma);
  await seedFulfillmentFeatureFlag(prisma);
  await seedIntegrationsFeatureFlag(prisma);
  await seedReturnsFeatureFlag(prisma);
  await seedNewsletterFeatureFlag(prisma);
  await seedNotificationsFeatureFlag(prisma);
  await seedSearchFeatureFlag(prisma);
  await seedTaxationFeatureFlag(prisma);
  await seedWebhooksFeatureFlag(prisma);
  await seedLocalizationFeatureFlag(prisma);

  console.info("Reseed feature flags OK — aucune donnée de démo touchée.");
}

main()
  .catch((error: unknown) => {
    console.error("Reseed feature flags failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
