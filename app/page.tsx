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
  HomepageNewArrivalsSection,
  HomepageNewsletterSection,
  HomepageSavoirFaireSection,
} from "@/features/homepage";
import { listPublishedProducts } from "@/features/storefront/catalog/queries/list-published-products";
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

  const uploadsPublicPath = getUploadsPublicPath().replace(/\/$/, "");
  const openGraphImageUrl =
    seo?.openGraphImageFilePath != null
      ? `${uploadsPublicPath}/${seo.openGraphImageFilePath}`
      : null;
  const twitterImageUrl =
    seo?.twitterImageFilePath != null
      ? `${uploadsPublicPath}/${seo.twitterImageFilePath}`
      : openGraphImageUrl;

  return {
    title: seo?.metaTitle ?? FALLBACK_TITLE,
    description: seo?.metaDescription ?? FALLBACK_DESCRIPTION,
    keywords: seo?.metaKeywords ?? undefined,
    ...(robots !== undefined && { robots }),
    openGraph: {
      title: seo?.openGraphTitle ?? seo?.metaTitle ?? FALLBACK_TITLE,
      description: seo?.openGraphDescription ?? seo?.metaDescription ?? FALLBACK_DESCRIPTION,
      ...(openGraphImageUrl !== null && { images: [openGraphImageUrl] }),
    },
    twitter: {
      title: seo?.twitterTitle ?? seo?.openGraphTitle ?? seo?.metaTitle ?? FALLBACK_TITLE,
      description:
        seo?.twitterDescription ??
        seo?.openGraphDescription ??
        seo?.metaDescription ??
        FALLBACK_DESCRIPTION,
      ...(twitterImageUrl !== null && { images: [twitterImageUrl] }),
    },
  };
}

export default async function HomePage() {
  const [data, uploadsPublicPath, rawNewArrivals] = await Promise.all([
    getStorefrontHomepage(),
    Promise.resolve(getUploadsPublicPath()),
    listPublishedProducts({
      searchQuery: null,
      categorySlugs: [],
      availabilityStatus: null,
      minPriceCents: null,
      maxPriceCents: null,
      sort: "newest",
    }),
  ]);

  const heroImagePath =
    data?.hero?.imageStorageKey != null
      ? `${uploadsPublicPath}/${data.hero.imageStorageKey}`
      : null;

  const featuredProducts = data?.featuredProducts ?? [];
  const featuredCategories = data?.featuredCategories ?? [];

  const featuredProductIds = new Set(featuredProducts.map((p) => p.id));
  const newArrivals = rawNewArrivals.filter((p) => !featuredProductIds.has(p.id)).slice(0, 4);

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

        {newArrivals.length > 0 && (
          <HomepageNewArrivalsSection
            products={newArrivals}
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
          savoirFaireTitle={data?.savoirFaire?.title}
          savoirFaireBody={data?.savoirFaire?.body}
          savoirFaireImagePath={data?.savoirFaire?.imageStorageKey}
          uploadsPublicPath={uploadsPublicPath}
        />

        <HomepageGuaranteesSection guaranteesBody={data?.guarantees?.body} />

        <HomepageJournalSection
          featuredPost={data?.featuredPost ?? null}
          instagramUrl={data?.instagramUrl ?? null}
          facebookUrl={data?.facebookUrl ?? null}
        />

        <HomepageAboutSection
          aboutTitle={data?.about?.title}
          aboutSubtitle={data?.about?.subtitle}
          aboutBody={data?.about?.body}
          aboutCtaLabel={data?.about?.ctaLabel}
          aboutCtaHref={data?.about?.ctaHref}
        />

        <HomepageNewsletterSection
          newsletterTitle={data?.newsletter?.title}
          newsletterSubtitle={data?.newsletter?.subtitle}
        />
      </div>
    </div>
  );
}
