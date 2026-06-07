import type { Metadata } from "next";

import { getUploadsPublicPath } from "@/core/uploads";
import {
  getStorefrontHomepage,
  HomepageAboutSection,
  HomepageCollectionsSection,
  HomepageEditorialSection,
  HomepageFeaturedProductsSection,
  HomepageGuaranteesSection,
  HomepageHeroSection,
  HomepageJournalSection,
  HomepageNewsletterSection,
  HomepageSavoirFaireSection,
} from "@/features/homepage";
import { getAdminSeoSettings } from "@/features/admin/settings/queries/get-seo-settings.query";
import { getSeoRobotsFlags } from "@/entities/seo";

const FALLBACK_TITLE = "Creatyss — Artisan créateur";
const FALLBACK_DESCRIPTION =
  "Découvrez les créations artisanales Creatyss : pièces uniques, collections exclusives et savoir-faire d'exception.";

export async function generateMetadata(): Promise<Metadata> {
  let seo: Awaited<ReturnType<typeof getAdminSeoSettings>> = null;
  try {
    seo = await getAdminSeoSettings();
  } catch {
    // DB non disponible — fallback aux valeurs statiques
  }

  const robots = getSeoRobotsFlags(seo?.indexingMode);

  return {
    title: seo?.metaTitle ?? FALLBACK_TITLE,
    description: seo?.metaDescription ?? FALLBACK_DESCRIPTION,
    keywords: seo?.metaKeywords ?? undefined,
    ...(robots !== undefined && { robots }),
    openGraph: {
      title: seo?.openGraphTitle ?? seo?.metaTitle ?? FALLBACK_TITLE,
      description: seo?.openGraphDescription ?? seo?.metaDescription ?? FALLBACK_DESCRIPTION,
    },
    twitter: {
      title: seo?.twitterTitle ?? seo?.openGraphTitle ?? seo?.metaTitle ?? FALLBACK_TITLE,
      description:
        seo?.twitterDescription ??
        seo?.openGraphDescription ??
        seo?.metaDescription ??
        FALLBACK_DESCRIPTION,
    },
  };
}

export default async function HomePage() {
  const [data, uploadsPublicPath] = await Promise.all([
    getStorefrontHomepage(),
    Promise.resolve(getUploadsPublicPath()),
  ]);

  const heroImagePath =
    data?.hero?.imageStorageKey != null
      ? `${uploadsPublicPath}/${data.hero.imageStorageKey}`
      : null;

  const featuredProducts = data?.featuredProducts ?? [];
  const featuredCategories = data?.featuredCategories ?? [];

  return (
    <div className="px-4 md:px-6 xl:px-12">
      <HomepageHeroSection
        heroTitle={data?.hero?.title ?? null}
        heroText={data?.hero?.text ?? null}
        heroImagePath={heroImagePath}
      />

      <div className="flex flex-col gap-20 py-20 md:gap-24 md:py-24">
        {featuredProducts.length > 0 && (
          <HomepageFeaturedProductsSection
            products={featuredProducts}
            uploadsPublicPath={uploadsPublicPath}
          />
        )}

        {featuredCategories.length > 0 && (
          <HomepageCollectionsSection
            categories={featuredCategories}
            uploadsPublicPath={uploadsPublicPath}
          />
        )}

        <HomepageEditorialSection
          editorialTitle={data?.editorial?.title ?? null}
          editorialText={data?.editorial?.text ?? null}
        />

        <HomepageSavoirFaireSection
          editorialTitle={null}
          editorialText={null}
        />

        <HomepageGuaranteesSection />

        <HomepageJournalSection featuredPost={data?.featuredPost ?? null} />

        <HomepageAboutSection />

        <HomepageNewsletterSection />
      </div>
    </div>
  );
}
