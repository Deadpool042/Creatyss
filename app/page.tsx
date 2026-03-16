import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getPublishedHomepageContent } from "@/db/catalog";
import { getUploadsPublicPath } from "@/lib/uploads";

export const dynamic = "force-dynamic";

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

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">
            Boutique publique
          </p>
          <h1>{homepage.heroTitle ?? "Creatyss"}</h1>

          {homepage.heroText ? (
            <p className="mt-1 leading-relaxed text-muted-foreground">
              {homepage.heroText}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/boutique">Voir la boutique</Link>
            </Button>
            <Button
              asChild
              variant="outline">
              <Link href="/blog">Lire le blog</Link>
            </Button>
          </div>
        </div>

        {heroImagePath ? (
          <div className="hero-media">
            <img
              alt={homepage.heroTitle ?? "Creatyss"}
              className="media-image"
              src={heroImagePath}
            />
          </div>
        ) : (
          <div className="hero-media media-placeholder">
            Visuel principal indisponible
          </div>
        )}
      </section>

      {homepage.editorialTitle || homepage.editorialText ? (
        <section className="section">
          <div className="grid gap-2">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">
              Éditorial
            </p>
            <h2 className="m-0">{homepage.editorialTitle ?? "L'atelier Creatyss"}</h2>
            {homepage.editorialText ? (
              <p className="mt-1 leading-relaxed text-muted-foreground">
                {homepage.editorialText}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {homepage.featuredProducts.length > 0 ? (
        <section className="section">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="grid gap-1">
              <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">
                Sélection
              </p>
              <h2 className="m-0">Produits mis en avant</h2>
            </div>

            <Link
              className="shrink-0 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              href="/boutique">
              Toute la boutique
            </Link>
          </div>

          <div className="grid gap-4 min-[700px]:grid-cols-3">
            {homepage.featuredProducts.map((product) => (
              <article
                className="store-card"
                key={product.id}>
                <p className="text-[0.95rem] text-foreground/68">Produit</p>
                <h3>
                  <Link href={`/boutique/${product.slug}`}>{product.name}</Link>
                </h3>
                <p className="card-copy">
                  {product.shortDescription ??
                    product.description ??
                    "Découvrir ce modèle en détail."}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {homepage.featuredCategories.length > 0 ? (
        <section className="section">
          <div className="mb-6 grid gap-1">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">
              Univers
            </p>
            <h2 className="m-0">Catégories mises en avant</h2>
          </div>

          <div className="grid gap-4 min-[700px]:grid-cols-3">
            {homepage.featuredCategories.map((category) => (
              <article
                className="store-card"
                key={category.id}>
                <p className="text-[0.95rem] text-foreground/68">Catégorie</p>
                <h3>{category.name}</h3>
                <p className="card-copy">
                  {category.description ?? "Sélection visible sur la page d'accueil."}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {homepage.featuredBlogPosts.length > 0 ? (
        <section className="section">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div className="grid gap-1">
              <p className="text-sm font-bold uppercase tracking-[0.08em] text-brand">
                Journal
              </p>
              <h2 className="m-0">Articles mis en avant</h2>
            </div>

            <Link
              className="shrink-0 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              href="/blog">
              Tous les articles
            </Link>
          </div>

          <div className="grid gap-4 min-[700px]:grid-cols-3">
            {homepage.featuredBlogPosts.map((post) => (
              <article
                className="store-card"
                key={post.id}>
                <p className="text-[0.95rem] text-foreground/68">Article</p>
                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                {post.publishedAt ? (
                  <p className="text-[0.95rem] text-foreground/68">
                    {blogDateFormatter.format(new Date(post.publishedAt))}
                  </p>
                ) : null}
                <p className="card-copy">
                  {post.excerpt ?? "Lire l'article complet."}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
