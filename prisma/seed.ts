import {
  DEV_ADMINS,
  ensureAdminRole,
  ensureDefaultStore,
  upsertAdminUser,
} from "../scripts/helpers/admin-bootstrap";
import { createScriptPrismaClient } from "../scripts/helpers/prisma-client";
import { seedAdminNavigationAccess } from "./seed/admin-navigation-access.seed";
import { seedAiFeatureFlag } from "./seed/ai-feature-flag.seed";
import { seedCoreCrossCuttingFlags } from "./seed/core-cross-cutting-flags.seed";
import { seedAnalyticsFeatureFlag } from "./seed/analytics-feature-flag.seed";
import { seedAutomationsFeatureFlag } from "./seed/automations-feature-flag.seed";
import { seedBlogPosts } from "./seed/blog-posts.seed";
import { seedChannelsFeatureFlag } from "./seed/channels-feature-flag.seed";
import { seedDiscountsFeatureFlag } from "./seed/discounts-feature-flag.seed";
import { seedDocumentsFeatureFlag } from "./seed/documents-feature-flag.seed";
import { seedFulfillmentFeatureFlag } from "./seed/fulfillment-feature-flag.seed";
import { seedFeatureFlagsCatalog } from "./seed/feature-flags-catalog.seed";
import { seedIntegrationsFeatureFlag } from "./seed/integrations-feature-flag.seed";
import { seedLegalPages } from "./seed/legal-pages.seed";
import { seedLocalizationFeatureFlag } from "./seed/localization-feature-flag.seed";
import { seedLocalizationLocales } from "./seed/localization-locales.seed";
import { seedNewsletterFeatureFlag } from "./seed/newsletter-feature-flag.seed";
import { seedNotificationsFeatureFlag } from "./seed/notifications-feature-flag.seed";
import { seedReturnsFeatureFlag } from "./seed/returns-feature-flag.seed";
import { seedSearchFeatureFlag } from "./seed/search-feature-flag.seed";
import { seedTaxationFeatureFlag } from "./seed/taxation-feature-flag.seed";
import { seedTaxRules } from "./seed/tax-rules.seed";
import { seedWebhooksFeatureFlag } from "./seed/webhooks-feature-flag.seed";

const prisma = createScriptPrismaClient();

async function main(): Promise<void> {
  const store = await ensureDefaultStore(prisma);
  const role = await ensureAdminRole(prisma);

  for (const admin of DEV_ADMINS) {
    await upsertAdminUser(prisma, admin, store.id, role.id);
  }

  await seedAdminNavigationAccess(prisma);
  await seedBlogPosts(prisma, store.id);
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
  await seedTaxRules(prisma);
  await seedWebhooksFeatureFlag(prisma);
  await seedLocalizationFeatureFlag(prisma);
  await seedLocalizationLocales(prisma);
  await seedLegalPages(prisma, store.id);

  const pagesCount = await prisma.page.count({ where: { storeId: store.id } });
  console.info(`Seed OK — store ${store.id} (${store.code}), pages en base : ${pagesCount}`);
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
