import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getPublishedHomepageContent } from "@/db/catalog";
import { getUploadsPublicPath } from "@/lib/uploads";
import { Hero } from "@/components/layout/hero";
import { SurfaceSection } from "@/components/layout/surfaceSection";
import Image from "next/image";

export const dynamic = "force-dynamic";

// Ajoue des metadata pour le SEO et les réseaux sociaux
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

const blogDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long"
});

export default async function HomePage() {
  const homepage = await getPublishedHomepageContent();

  if (homepage === null) {
    notFound();
  }

  const uploadsPublicPath = getUploadsPublicPath();
  const heroImagePath = homepage.heroImagePath
    ? `${uploadsPublicPath}/${homepage.heroImagePath.replace(/^\/+/, "")}`
    : null;

  const featuredPost = homepage.featuredBlogPosts[0] ?? null;

  return (
    <div className="grid gap-10">
      <Hero
        eyebrow="Boutique publique"
        layout="split"
        title={homepage.heroTitle ?? "Creatyss"}
        description={homepage.heroText ? <p>{homepage.heroText}</p> : undefined}
        actions={
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              asChild
              size="lg">
              <Link href="/boutique">Voir la boutique</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline">
              <Link href="/blog">Lire le blog</Link>
            </Button>
          </div>
        }
        media={
          heroImagePath ? (
            <div className="flex min-h-72 items-center justify-center overflow-hidden rounded-lg bg-media-surface p-4 min-[900px]:min-h-88">
              <Image
                alt={homepage.heroTitle ?? "Creatyss"}
                className="block max-h-full max-w-full object-contain"
                src={heroImagePath}
                width={1200}
                height={800}
              />
            </div>
          ) : undefined
        }
        mediaFallback={
          <div className="grid min-h-72 place-items-center overflow-hidden rounded-lg bg-media-surface p-6 text-center text-media-foreground min-[900px]:min-h-88">
            Visuel principal indisponible
          </div>
        }
      />

      <SurfaceSection
        eyebrow="Éditorial"
        title={homepage.editorialTitle ?? "L'atelier Creatyss"}>
        <p className="max-w-3xl leading-relaxed text-muted-foreground">
          {homepage.editorialText ??
            "Creatyss imagine et réalise des sacs faits main dans une démarche artisanale, attentive aux matières, aux détails et au temps nécessaire pour bien faire. Chaque création est pensée pour durer, avec une attention particulière portée à l'élégance, à l'usage et à la singularité de chaque pièce."}
        </p>
      </SurfaceSection>

      {homepage.featuredProducts.length > 0 ? (
        <SurfaceSection
          eyebrow="Sélection"
          title="Produits mis en avant"
          headerActions={
            <Link
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              href="/boutique">
              Toute la boutique
            </Link>
          }>
          <div className="grid gap-5 min-[700px]:grid-cols-3">
            {homepage.featuredProducts.slice(0, 3).map(product => (
              <article
                className="grid gap-4 rounded-lg border border-surface-border bg-surface-panel-soft p-6 shadow-card"
                key={product.id}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Produit
                </p>
                <h3>
                  <Link
                    className="transition-colors hover:text-brand"
                    href={`/boutique/${product.slug}`}>
                    {product.name}
                  </Link>
                </h3>
                <p className="m-0 leading-relaxed">
                  {product.shortDescription ??
                    product.description ??
                    "Découvrir ce modèle en détail."}
                </p>
              </article>
            ))}
          </div>
        </SurfaceSection>
      ) : null}

      <div className="grid gap-8 min-[900px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <SurfaceSection
          eyebrow="Événements"
          title="Retrouvez Creatyss lors de marchés et événements artisanaux">
          <div className="grid gap-5">
            <p className="leading-relaxed text-muted-foreground">
              Tout au long de l'année, Creatyss participe à des rendez-vous
              locaux pour présenter ses créations, rencontrer le public et
              partager l'univers de l'atelier. Une belle occasion de découvrir
              les pièces de près et d'échanger autour du fait main.
            </p>

            <div className="rounded-lg border border-surface-border bg-surface-panel-soft p-6 shadow-card">
              <p className="text-sm font-semibold text-brand">
                Prochain rendez-vous
              </p>
              <h3 className="mt-2">Marché artisanal de printemps</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Samedi 12 avril 2026 · Place du centre-ville · 10h à 18h
              </p>
              <p className="mt-3 leading-relaxed">
                Venez découvrir les créations Creatyss, échanger autour des
                pièces exposées et voir les détails de fabrication de plus près.
              </p>
            </div>
          </div>
        </SurfaceSection>

        <SurfaceSection
          eyebrow="Journal"
          title="Dans les coulisses de l'atelier"
          headerActions={
            <Link
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              href="/blog">
              Tous les articles
            </Link>
          }>
          {featuredPost ? (
            <article className="grid gap-4 rounded-lg border border-surface-border bg-surface-panel-soft p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Article
              </p>
              <h3>
                <Link
                  className="transition-colors hover:text-brand"
                  href={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h3>
              {featuredPost.publishedAt ? (
                <p className="text-sm text-muted-foreground">
                  {blogDateFormatter.format(new Date(featuredPost.publishedAt))}
                </p>
              ) : null}
              <p className="m-0 leading-relaxed">
                {featuredPost.excerpt ?? "Lire l'article complet."}
              </p>
            </article>
          ) : (
            <p className="leading-relaxed text-muted-foreground">
              Le journal de l'atelier sera bientôt enrichi de nouveaux contenus
              : inspirations, nouveautés et temps forts autour des créations
              Creatyss.
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              asChild
              variant="outline">
              <Link href="https://www.facebook.com/creatyss">Facebook</Link>
            </Button>
            <Button
              asChild
              variant="outline">
              <Link href="https://www.instagram.com/creatyss">Instagram</Link>
            </Button>
          </div>
        </SurfaceSection>
      </div>
    </div>
  );
}
