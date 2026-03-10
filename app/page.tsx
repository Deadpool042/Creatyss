import Link from "next/link";
import { notFound } from "next/navigation";
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
          <p className="eyebrow">Boutique publique</p>
          <h1>{homepage.heroTitle ?? "Creatyss"}</h1>

          {homepage.heroText ? (
            <p className="lead">{homepage.heroText}</p>
          ) : null}

          <div className="button-row">
            <Link className="link" href="/boutique">
              Voir la boutique
            </Link>
            <Link className="link link-subtle" href="/blog">
              Lire le blog
            </Link>
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
            Visuel hero indisponible
          </div>
        )}
      </section>

      {homepage.editorialTitle || homepage.editorialText ? (
        <section className="section">
          <div className="section-copy">
            <p className="eyebrow">Editorial</p>
            <h2>{homepage.editorialTitle ?? "L'atelier Creatyss"}</h2>
            {homepage.editorialText ? (
              <p className="lead">{homepage.editorialText}</p>
            ) : null}
          </div>
        </section>
      ) : null}

      {homepage.featuredProducts.length > 0 ? (
        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Selection</p>
              <h2>Produits mis en avant</h2>
            </div>

            <Link className="link link-subtle" href="/boutique">
              Toute la boutique
            </Link>
          </div>

          <div className="card-grid">
            {homepage.featuredProducts.map((product) => (
              <article className="store-card" key={product.id}>
                <p className="card-kicker">Produit</p>
                <h3>
                  <Link href={`/boutique/${product.slug}`}>{product.name}</Link>
                </h3>
                <p className="card-copy">
                  {product.shortDescription ??
                    product.description ??
                    "Decouvrir ce modele en detail."}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {homepage.featuredCategories.length > 0 ? (
        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Univers</p>
              <h2>Categories mises en avant</h2>
            </div>
          </div>

          <div className="card-grid">
            {homepage.featuredCategories.map((category) => (
              <article className="store-card" key={category.id}>
                <p className="card-kicker">Categorie</p>
                <h3>{category.name}</h3>
                <p className="card-copy">
                  {category.description ?? "Selection visible sur la homepage."}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {homepage.featuredBlogPosts.length > 0 ? (
        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Journal</p>
              <h2>Articles mis en avant</h2>
            </div>

            <Link className="link link-subtle" href="/blog">
              Tous les articles
            </Link>
          </div>

          <div className="card-grid">
            {homepage.featuredBlogPosts.map((post) => (
              <article className="store-card" key={post.id}>
                <p className="card-kicker">Article</p>
                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                {post.publishedAt ? (
                  <p className="card-meta">
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
