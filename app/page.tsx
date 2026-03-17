import { notFound } from "next/navigation";
import { getPublishedHomepageContent } from "@/db/catalog";
import { getUploadsPublicPath } from "@/lib/uploads";
import { HomepageHeroSection } from "@/features/homepage/components/homepage-hero-section";

import { HomepageFeaturedProductsSection } from "@/features/homepage/components/homepage-featured-products-section";
import { HomepageEventsSection } from "@/features/homepage/components/homepage-events-section";
import { HomepageJournalSection } from "@/features/homepage/components/homepage-journal-section";
import { HomepageCollectionsSection } from "@/features/homepage/components/homepage-collections-section";
import { HomepageSavoirFaireSection } from "@/features/homepage/components/homepage-savoir-faire";
import { HomepageAboutSection } from "@/features/homepage/components/homepage-about-section";
import { HomepageGuaranteesSection } from "@/features/homepage/components/homepage-guarantees-section";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Creatyss - Sacs faits main et artisanat d'art",
  description:
    "Découvrez Creatyss, une boutique de sacs faits main alliant élégance, durabilité et savoir-faire artisanal. Explorez nos créations uniques, inspirées par la nature et conçues pour durer.",
  openGraph: {
    title: "Creatyss - Sacs faits main et artisanat d'art",
    description:
      "Découvrez Creatyss, une boutique de sacs faits main alliant élégance, durabilité et savoir-faire artisanal. Explorez nos créations uniques, inspirées par la nature et conçues pour durer.",
    url: "https://creatyss.com",
    siteName: "Creatyss",
    images: [
      {
        url: "https://creatyss.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Visuel de présentation de Creatyss"
      }
    ],
    locale: "fr_FR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Creatyss - Sacs faits main et artisanat d'art",
    description:
      "Découvrez Creatyss, une boutique de sacs faits main alliant élégance, durabilité et savoir-faire artisanal. Explorez nos créations uniques, inspirées par la nature et conçues pour durer.",
    images: [
      {
        url: "https://creatyss.com/twitter-image.jpg",
        alt: "Visuel de présentation de Creatyss"
      }
    ]
  }
};

export default async function HomePage() {
  const homepage = await getPublishedHomepageContent();

  if (homepage === null) {
    notFound();
  }

  const uploadsPublicPath = getUploadsPublicPath();
  const heroImagePath = homepage.heroImagePath
    ? `${uploadsPublicPath}/${homepage.heroImagePath.replace(/^\/+/, "")}`
    : null;

  return (
    <div className="grid">
      <HomepageHeroSection
        heroImagePath={heroImagePath}
        heroText={homepage.heroText}
        heroTitle={homepage.heroTitle}
      />

      <HomepageGuaranteesSection />
      <div className=" grid gap-16 my-16">
        <HomepageCollectionsSection />

        <HomepageSavoirFaireSection
          editorialText={homepage.editorialText}
          editorialTitle={homepage.editorialTitle}
        />

        <HomepageFeaturedProductsSection
          products={homepage.featuredProducts}
          uploadsPublicPath={uploadsPublicPath}
        />

        <HomepageAboutSection />

        <div className="grid gap-8 min-[900px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <HomepageEventsSection />
          <HomepageJournalSection
            featuredPost={homepage.featuredBlogPosts[0] ?? null}
          />
        </div>
      </div>
    </div>
  );
}
