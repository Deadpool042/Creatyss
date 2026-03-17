import Image from "next/image";
import Link from "next/link";

type FeaturedProductImage = {
  filePath: string;
  altText: string | null;
};

type FeaturedProduct = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  primaryImage: FeaturedProductImage | null;
};

type HomepageFeaturedProductsSectionProps = {
  products: FeaturedProduct[];
  uploadsPublicPath: string;
};

function buildProductImageSrc(
  uploadsPublicPath: string,
  image: FeaturedProductImage | null
): string | null {
  if (image === null) {
    return null;
  }

  return `${uploadsPublicPath}/${image.filePath.replace(/^\/+/, "")}`;
}

export function HomepageFeaturedProductsSection({
  products,
  uploadsPublicPath
}: HomepageFeaturedProductsSectionProps) {
  const displayedProducts = products.slice(0, 4);

  return (
    <section aria-labelledby="homepage-featured-products-title">
      <div className="flex flex-col gap-12">
        {/* Section header — eyebrow + titre serif + btn-outline comme index.html */}
        <div className="flex flex-col gap-4 min-[900px]:flex-row min-[900px]:items-end min-[900px]:justify-between">
          <div>
            <p className="mb-3.5 text-[0.62rem] font-medium uppercase tracking-[0.32em] text-brand">
              À la une
            </p>
            <h2
              className="font-serif text-3xl font-normal leading-[1.15] tracking-tight text-foreground min-[900px]:text-[2.9rem]"
              id="homepage-featured-products-title">
              Sélection du moment
            </h2>
          </div>

          {/* btn-outline : border box, padding, hover border-foreground */}
          <Link
            className="inline-flex items-center gap-2.5 self-start border border-border px-6 py-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-foreground transition-colors hover:border-foreground min-[900px]:self-auto"
            href="/boutique">
            Voir tous les sacs
            <span
              aria-hidden="true"
              className="font-serif text-sm">
              →
            </span>
          </Link>
        </div>

        {/* Grille 4 colonnes — gap 24px comme index.html */}
        <div className="grid gap-6 min-[700px]:grid-cols-2 min-[1100px]:grid-cols-4">
          {displayedProducts.map(product => {
            const imageSrc = buildProductImageSrc(
              uploadsPublicPath,
              product.primaryImage
            );

            return (
              <article
                className="group"
                key={product.id}>
                <Link
                  className="block"
                  href={`/boutique/${product.slug}`}>
                  {/* Image — rounded cohérent avec les cards collections */}
                  <div className="relative aspect-3/4 overflow-hidden rounded-(--radius) bg-surface-subtle">
                    {imageSrc ? (
                      <Image
                        alt={
                          product.primaryImage?.altText?.trim() || product.name
                        }
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        fill
                        sizes="(min-width: 1100px) 25vw, (min-width: 700px) 50vw, 100vw"
                        src={imageSrc}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[linear-gradient(145deg,#c8b89e_0%,#a8906e_45%,#6e5840_100%)]" />
                    )}

                    {/* Badge sobre — fond toujours sombre, lettre-espacé 0.15em */}
                    <span className="absolute left-3 top-3 bg-band-bg px-2.5 py-1 text-[0.55rem] font-medium uppercase tracking-[0.15em] text-white/75">
                      Pièce unique
                    </span>
                  </div>

                  {/* Info produit — nom serif 18px + détail léger */}
                  <div className="mt-[18px]">
                    <h3 className="font-serif text-[1.1rem] font-normal leading-snug text-foreground transition-colors group-hover:text-brand">
                      {product.name}
                    </h3>

                    {product.shortDescription && (
                      <p className="mt-1.5 text-[0.69rem] font-light tracking-[0.08em] text-muted-foreground">
                        {product.shortDescription}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        {/* Footer CTA — btn-dark centré comme index.html */}
        <div className="flex justify-center">
          <Link
            className="inline-flex items-center gap-2.5 bg-foreground px-8 py-4 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-background transition-opacity hover:opacity-80"
            href="/boutique">
            Voir toute la boutique
            <span
              aria-hidden="true"
              className="font-serif text-sm">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
