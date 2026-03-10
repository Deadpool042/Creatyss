import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedProductBySlug } from "@/db/catalog";
import { getUploadsPublicPath } from "@/lib/uploads";

export const dynamic = "force-dynamic";

type ProductPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

type ProductMetadataSource = NonNullable<
  Awaited<ReturnType<typeof getPublishedProductBySlug>>
>;

function getAvailabilityLabel(isAvailable: boolean): string {
  return isAvailable ? "Disponible" : "Temporairement indisponible";
}

function getProductMetadataDescription(product: ProductMetadataSource): string {
  return (
    product.seoDescription ??
    product.shortDescription ??
    product.description ??
    "Produit Creatyss."
  );
}

export async function generateMetadata({
  params
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (product === null) {
    return {
      title: "Produit Creatyss",
      description: "Produit Creatyss."
    };
  }

  return {
    title: product.seoTitle ?? product.name,
    description: getProductMetadataDescription(product)
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (product === null) {
    notFound();
  }

  const uploadsPublicPath = getUploadsPublicPath();

  return (
    <div className="page">
      <section className="section">
        <div className="page-header">
          <div>
            <p className="eyebrow">Produit</p>
            <h1>{product.name}</h1>
            {product.shortDescription ? (
              <p className="lead">{product.shortDescription}</p>
            ) : null}
          </div>
        </div>

        <div className="product-layout">
          <div className="product-gallery">
            <h2>Galerie principale</h2>

            {product.images.length > 0 ? (
              <div className="image-grid">
                {product.images.map((image) => (
                  <figure className="product-media" key={image.id}>
                    <img
                      alt={image.altText ?? product.name}
                      loading="lazy"
                      src={`${uploadsPublicPath}/${image.filePath.replace(/^\/+/, "")}`}
                    />
                  </figure>
                ))}
              </div>
            ) : (
              <div className="media-placeholder">Aucun visuel principal.</div>
            )}
          </div>

          <aside className="product-panel">
            <div className="stack">
              <p className="meta-label">Slug</p>
              <p className="card-copy">{product.slug}</p>
            </div>

            {product.description ? (
              <div className="stack">
                <p className="meta-label">Description</p>
                <p className="product-copy">{product.description}</p>
              </div>
            ) : null}

            <div className="stack">
              <p className="meta-label">Variantes publiees</p>
              <p className="card-copy">{product.variants.length}</p>
            </div>

            <div className="stack">
              <p className="meta-label">Disponibilite produit</p>
              <p className="card-copy">
                {getAvailabilityLabel(product.isAvailable)}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Variantes</p>
            <h2>Variantes publiees</h2>
          </div>
        </div>

        {product.variants.length > 0 ? (
          <div className="variant-list">
            {product.variants.map((variant) => (
              <article className="variant-card" key={variant.id}>
                <div className="stack">
                  <h3>{variant.name}</h3>
                  <p className="variant-meta">
                    {variant.colorName}
                    {variant.colorHex ? ` · ${variant.colorHex}` : ""}
                  </p>
                </div>

                <div className="stack">
                  <p className="meta-label">SKU</p>
                  <p className="card-copy">{variant.sku}</p>
                </div>

                <div className="stack">
                  <p className="meta-label">Prix</p>
                  <p className="card-copy">{variant.price}</p>
                  {variant.compareAtPrice ? (
                    <p className="card-meta">Compare a {variant.compareAtPrice}</p>
                  ) : null}
                </div>

                <div className="stack">
                  <p className="meta-label">Disponibilite de la variante</p>
                  <p className="card-copy">
                    {getAvailabilityLabel(variant.isAvailable)}
                  </p>
                </div>

                {variant.images.length > 0 ? (
                  <div className="variant-images">
                    {variant.images.map((image) => (
                      <figure className="variant-media" key={image.id}>
                        <img
                          alt={image.altText ?? variant.name}
                          loading="lazy"
                          src={`${uploadsPublicPath}/${image.filePath.replace(/^\/+/, "")}`}
                        />
                      </figure>
                    ))}
                  </div>
                ) : (
                  <div className="media-placeholder">
                    Aucun visuel pour cette variante.
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Aucune variante</p>
            <h2>Ce produit n&apos;a pas de variante publique</h2>
            <p className="card-copy">
              Les variantes publiees apparaitront ici lorsqu&apos;elles seront
              disponibles.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
