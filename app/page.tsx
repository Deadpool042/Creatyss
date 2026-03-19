import { notFound } from "next/navigation";
import { getPublishedHomepageContent, listRecentPublishedProducts } from "@/db/repositories/catalog/catalog.repository";
import { getUploadsPublicPath } from "@/lib/uploads";
import {
  HomepageHeroSection,
  HomepageAboutSection,
  HomepageCollectionsSection,
  HomepageEventsSection,
  HomepageFeaturedProductsSection,
  HomepageGuaranteesSection,
  HomepageJournalSection,
  HomepageNewArrivalsSection,
  HomepageNewsletterSection,
  HomepageSavoirFaireSection,
} from "@/features/homepage";

export const revalidate = 60;

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
        alt: "Visuel de présentation de Creatyss",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creatyss - Sacs faits main et artisanat d'art",
    description:
      "Découvrez Creatyss, une boutique de sacs faits main alliant élégance, durabilité et savoir-faire artisanal. Explorez nos créations uniques, inspirées par la nature et conçues pour durer.",
    images: [
      {
        url: "https://creatyss.com/twitter-image.jpg",
        alt: "Visuel de présentation de Creatyss",
      },
    ],
  },
};

export default async function HomePage() {
  const [homepage, recentProducts] = await Promise.all([
    getPublishedHomepageContent(),
    listRecentPublishedProducts(4),
  ]);

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
        <HomepageCollectionsSection
          categories={homepage.featuredCategories}
          uploadsPublicPath={uploadsPublicPath}
        />

        <HomepageSavoirFaireSection
          editorialText={homepage.editorialText}
          editorialTitle={homepage.editorialTitle}
        />

        <HomepageFeaturedProductsSection
          products={homepage.featuredProducts}
          uploadsPublicPath={uploadsPublicPath}
        />

        <HomepageNewArrivalsSection
          products={recentProducts}
          uploadsPublicPath={uploadsPublicPath}
        />

        <HomepageAboutSection />

        <div className="grid gap-8 min-[900px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <HomepageEventsSection />
          <HomepageJournalSection featuredPost={homepage.featuredBlogPosts[0] ?? null} />
        </div>
      </div>
      <HomepageNewsletterSection />
    </div>
  );
}
