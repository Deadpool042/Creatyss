import Image from "next/image";
import Link from "next/link";
import PlaceholderImage, { PLACEHOLDER_FILENAME } from "@/components/shared/placeholderImage";

type NewArrivalImage = {
  filePath: string;
  altText: string | null;
};

type NewArrivalProduct = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  primaryImage: NewArrivalImage | null;
};

type HomepageNewArrivalsSectionProps = {
  products: NewArrivalProduct[];
  uploadsPublicPath: string;
};

function buildImageSrc(uploadsPublicPath: string, image: NewArrivalImage | null): string | null {
  if (image === null) return null;
  return `${uploadsPublicPath}/${image.filePath.replace(/^\/+/, "")}`;
}

export function HomepageNewArrivalsSection({
  products,
  uploadsPublicPath,
}: HomepageNewArrivalsSectionProps) {
  const displayed = products.slice(0, 4);

  if (displayed.length === 0) return null;

  return (
    <section aria-labelledby="homepage-new-arrivals-title">
      {/* Header — même logique que les autres sections refondues */}
      <div className="mb-10 flex flex-col gap-4 min-[900px]:flex-row min-[900px]:items-end min-[900px]:justify-between">
        <div>
          <p className="mb-3.5 text-[0.62rem] font-medium uppercase tracking-[0.32em] text-brand">
            Vient d'arriver
          </p>
          <h2
            className="font-serif text-3xl font-normal leading-[1.15] tracking-tight text-foreground min-[900px]:text-[2.9rem]"
            id="homepage-new-arrivals-title"
          >
            Nouveautés
          </h2>
        </div>

        {/* btn-ghost — border-b seul, cohérent avec les autres sections */}
        <Link
          className="inline-flex items-center gap-2.5 self-start border-b border-border pb-0.5 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-foreground transition-colors hover:border-foreground min-[900px]:self-auto"
          href="/boutique"
        >
          Tout voir
          <span aria-hidden="true" className="font-serif text-sm">
            →
          </span>
        </Link>
      </div>

      {/* Track — scroll horizontal sur mobile/tablette, flex distribué sur desktop
          Chaque carte est flex-none avec une largeur viewport-relative sur mobile,
          puis flex-1 sur desktop pour distribuer les 3-4 cartes équitablement. */}
      <div className="grid grid-cols-2 gap-5 min-[900px]:grid-cols-4">
        {displayed.map((product) => {
          const imageSrc = buildImageSrc(uploadsPublicPath, product.primaryImage);

          return (
            <article className="group" key={product.id}>
              <Link className="block" href={`/boutique/${product.slug}`}>
                {/* Image — aspect-[2/3] plus allongé que la sélection (3/4)
                    rounded cohérent avec les cards collections + featured
                    hover : scale 1.05 légèrement plus vif que la sélection (1.04) */}
                <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-surface-subtle transition-shadow duration-500 group-hover:shadow-card">
                  {imageSrc && product.primaryImage?.filePath !== PLACEHOLDER_FILENAME ? (
                    <Image
                      alt={product.primaryImage?.altText?.trim() || product.name}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      fill
                      sizes="(min-width: 900px) 25vw, (min-width: 640px) 46vw, 76vw"
                      src={imageSrc}
                    />
                  ) : (
                    <PlaceholderImage alt={product.name} />
                  )}

                  {/* Tag "Nouveau" — terracotta (bg-brand), plus vif que le badge sombre de la sélection */}
                  <span className="absolute left-3 top-3 bg-brand px-2.5 py-1 text-[0.55rem] font-medium uppercase tracking-[0.18em] text-primary-foreground rounded-lg">
                    Nouveau
                  </span>
                </div>

                {/* Info — même hiérarchie que featured, légèrement moins dense */}
                <div className="mt-4">
                  <h3 className="font-serif text-[1.05rem] font-normal leading-snug text-foreground transition-colors group-hover:text-brand">
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
    </section>
  );
}
