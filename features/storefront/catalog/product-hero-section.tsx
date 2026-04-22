/**
 * Bloc hero partagé — fiche produit.
 *
 * Utilisé par le storefront (app/boutique/[slug]/page.tsx)
 * et la preview admin (app/admin/.../products/[slug]/preview/page.tsx).
 */
import Image from "next/image";

import { getProductAvailabilityLabel } from "@/entities/product/product-public-presentation";

type HeroVariant = {
  price: string;
  compareAtPrice: string | null;
};

type ProductHeroSectionProps = {
  productName: string;
  isSimpleProduct: boolean;
  isAvailable: boolean;
  primaryImage?: { src: string; alt: string | null } | null;
  heroVariant?: HeroVariant | null;
  singleVariantSku?: string | null;
  cta?: React.ReactNode | undefined;
  asideExtra?: React.ReactNode | undefined;
};

export function ProductHeroSection({
  productName,
  isSimpleProduct,
  isAvailable,
  primaryImage,
  heroVariant,
  singleVariantSku,
  cta,
  asideExtra,
}: ProductHeroSectionProps) {
  return (
    <section className="w-full overflow-hidden rounded-xl border border-shell-border bg-shell-surface shadow-card">
      <div className="grid min-[900px]:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] min-[1300px]:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
        <div className="border-b border-surface-border bg-media-surface min-[900px]:border-r min-[900px]:border-b-0 ">
          {primaryImage ? (
            <div className="flex items-center justify-center p-6 min-[700px]:p-8 min-[900px]:p-8 min-[1200px]:p-10">
              <Image
                alt={primaryImage.alt ?? productName}
                className="h-auto max-h-96 w-auto max-w-full object-contain rounded-3xl shadow-raised min-[700px]:max-h-116 min-[1200px]:max-h-136 [@media(max-height:520px)]:max-h-80"
                width={1200}
                height={1200}
                loading="lazy"
                sizes="(min-width: 1300px) 42vw, (min-width: 900px) 48vw, (min-width: 700px) 90vw, 92vw"
                src={primaryImage.src}
              />
            </div>
          ) : (
            <div className="p-6 min-[700px]:p-8 min-[900px]:p-8 min-[1200px]:p-10">
              <div className="grid aspect-4/3 w-full place-items-center rounded-3xl border border-dashed border-surface-border text-center text-sm text-media-foreground min-[900px]:aspect-5/4">
                Aucune image.
              </div>
            </div>
          )}
        </div>

        <aside className="flex flex-col bg-surface-panel-soft p-4 min-[700px]:p-5 min-[900px]:p-6 min-[1200px]:p-7">
          <div className="flex flex-1 flex-col">
            {heroVariant ? (
              <div className="border-b border-surface-border pb-4 min-[900px]:pb-5">
                {heroVariant.compareAtPrice ? (
                  <div className="mb-2 flex items-baseline gap-2">
                    <span className="text-eyebrow text-muted-foreground">
                      Ancien prix
                    </span>
                    <span className="text-sm font-medium line-through text-muted-foreground min-[900px]:text-base">
                      {heroVariant.compareAtPrice}
                    </span>
                  </div>
                ) : null}

                {!isSimpleProduct ? (
                  <p className="mb-1 text-eyebrow text-muted-foreground">
                    À partir de
                  </p>
                ) : null}

                <p className="text-4xl font-bold leading-none tracking-tight min-[1200px]:text-5xl">
                  {heroVariant.price || "—"}
                </p>
              </div>
            ) : null}

            <div className="grid gap-2 border-b border-surface-border py-4 min-[900px]:py-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="text-eyebrow text-muted-foreground">
                  Disponibilité
                </p>
                <span
                  className={`flex items-center gap-1.5 text-sm font-medium ${
                    isAvailable
                      ? "text-feedback-success-foreground"
                      : "text-feedback-error-foreground"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${
                      isAvailable ? "bg-feedback-success" : "bg-feedback-error"
                    }`}
                  />
                  {getProductAvailabilityLabel(isAvailable)}
                </span>
              </div>

              {singleVariantSku ? (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-eyebrow text-muted-foreground">
                    Référence
                  </p>
                  <p className="font-mono text-sm text-muted-foreground">{singleVariantSku}</p>
                </div>
              ) : null}
            </div>

            {cta ? <div className="mt-auto pt-5 min-[900px]:pt-6">{cta}</div> : null}

            {asideExtra ? <div className="pt-4 min-[900px]:pt-5">{asideExtra}</div> : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
