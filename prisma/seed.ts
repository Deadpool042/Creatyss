import {
  DEV_ADMINS,
  ensureAdminRole,
  ensureDefaultStore,
  upsertAdminUser,
} from "../scripts/helpers/admin-bootstrap";
import { createScriptPrismaClient } from "../scripts/helpers/prisma-client";
import { seedAdminNavigationAccess } from "./seed/admin-navigation-access.seed";
import { seedBlogPosts } from "./seed/blog-posts.seed";
import { seedFeatureFlagsCatalog } from "./seed/feature-flags-catalog.seed";
import { seedLegalPages } from "./seed/legal-pages.seed";
import { seedLocalizationFeatureFlag } from "./seed/localization-feature-flag.seed";
import { seedLocalizationLocales } from "./seed/localization-locales.seed";

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
