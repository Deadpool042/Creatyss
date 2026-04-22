/**
 * Bloc hero partagé — fiche produit.
 *
 * Utilisé par le storefront (app/boutique/[slug]/page.tsx)
 * et la preview admin (app/admin/.../products/[slug]/preview/page.tsx).
 *
 * Lot : PAGE-SHARED-1
 */
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { getProductAvailabilityLabel } from "@/entities/product/product-public-presentation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type HeroVariant = {
  price: string;
  compareAtPrice: string | null;
};

type ProductHeroSectionProps = {
  productName: string;
  shortDescription?: string | null | undefined;
  isSimpleProduct: boolean;
  isAvailable: boolean;
  primaryImage?: { src: string; alt: string | null } | null;
  heroVariant?: HeroVariant | null;
  singleVariantSku?: string | null;
  /**
   * className appliqué à l'élément `<Image>`.
   * Par défaut `"object-contain"` (convention storefront).
   * La preview admin passe ses propres classes pour conserver son rendu actuel.
   */
  imageClassName?: string;
  /**
   * CTA rendu à l'intérieur d'un wrapper `border-t` dans l'aside.
   * Storefront : form addToCart. Admin : bouton disabled.
   * Si absent, le bloc CTA n'est pas rendu.
   */
  cta?: React.ReactNode | undefined;
  /**
   * Contenu optionnel ajouté en bas de l'aside (après le CTA).
   * Utilisé par l'admin pour afficher la "Référence de page".
   */
  asideExtra?: React.ReactNode | undefined;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductHeroSection({
  productName,
  shortDescription,
  isSimpleProduct,
  isAvailable,
  primaryImage,
  heroVariant,
  singleVariantSku,
  imageClassName = "object-contain",
  cta,
  asideExtra,
}: ProductHeroSectionProps) {
  return (
    <section className="w-full overflow-hidden rounded-xl border border-shell-border bg-shell-surface shadow-soft">
      <div className="grid min-[900px]:grid-cols-[minmax(0,1fr)_minmax(22rem,0.85fr)]">
        {/* Image principale — padded pour objet-contain propre */}
        <div className="border-b border-surface-border bg-media-surface min-[900px]:border-b-0 min-[900px]:border-r">
          {primaryImage ? (
            <div className="aspect-square w-full p-6">
              <div className="relative h-full w-full">
                <Image
                  alt={primaryImage.alt ?? productName}
                  className={imageClassName}
                  fill
                  loading="lazy"
                  sizes="(min-width: 900px) 50vw, 100vw"
                  src={primaryImage.src}
                />
              </div>
            </div>
          ) : (
            <div className="grid aspect-square place-items-center text-center text-sm text-media-foreground">
              Aucune image.
            </div>
          )}
        </div>

        {/* Informations produit — badge, titre, prix, disponibilité, SKU, CTA */}
        <aside className="grid content-start gap-6 p-8 min-[700px]:p-10">
          {/* Badge type + h1 + description courte */}
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{isSimpleProduct ? "Simple" : "Variable"}</Badge>
            </div>
            <h1 className="m-0 text-2xl font-bold leading-snug">{productName}</h1>
            {shortDescription ? (
              <div
                className="prose prose-sm max-w-none leading-relaxed text-muted-foreground dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: shortDescription }}
              />
            ) : null}
          </div>

          {/* Prix */}
          {heroVariant ? (
            <div className="grid gap-1 border-b border-surface-border pb-6">
              {!isSimpleProduct ? (
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Dès
                </p>
              ) : null}
              <p className="text-3xl font-bold leading-tight tracking-tight">
                {heroVariant.price || "—"}
              </p>
              {heroVariant.compareAtPrice ? (
                <p className="text-sm text-muted-foreground line-through">
                  {heroVariant.compareAtPrice}
                </p>
              ) : null}
            </div>
          ) : null}

          {/* Disponibilité + SKU + CTA + extra */}
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Disponibilité
              </p>
              <Badge variant="outline">
                <span className={isAvailable ? "text-emerald-700" : "text-destructive"}>
                  {getProductAvailabilityLabel(isAvailable)}
                </span>
              </Badge>
            </div>

            {singleVariantSku ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  SKU
                </p>
                <p className="text-sm">{singleVariantSku}</p>
              </div>
            ) : null}

            {cta ? <div className="border-t border-surface-border pt-4">{cta}</div> : null}

            {asideExtra ?? null}
          </div>
        </aside>
      </div>
    </section>
  );
}
