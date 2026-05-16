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

export const metadata: Metadata = {
  title: "Creatyss — Artisan créateur",
  description:
    "Découvrez les créations artisanales Creatyss : pièces uniques, collections exclusives et savoir-faire d'exception.",
};

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
    <>
      <HomepageHeroSection
        heroTitle={data?.hero?.title ?? null}
        heroText={data?.hero?.text ?? null}
        heroImagePath={heroImagePath}
      />

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
        editorialTitle={data?.editorial?.title ?? null}
        editorialText={data?.editorial?.text ?? null}
      />

      <HomepageGuaranteesSection />

      <HomepageJournalSection featuredPost={data?.featuredPost ?? null} />

      <HomepageAboutSection />

      <HomepageNewsletterSection />
    </>
  );
}
