/**
 * Bloc hero partagé — fiche produit.
 *
 * Utilisé par le storefront (app/boutique/[slug]/page.tsx)
 * et la preview admin (app/admin/.../products/[slug]/preview/page.tsx).
 *
 * Lot : PAGE-SHARED-1 / PRODUCT-HERO-WOW-1 / PRODUCT-HERO-PROMO-AND-WOW-2 / PRODUCT-HERO-WOW-POLISH-3
 *
 * Structure de l'aside :
 *   1. Zone éditoriale (shortDescription) — fond transparent, séparée par border-b si présente
 *   2. Zone d'achat (prix + dispo + CTA) — bg-surface-panel-soft, flex-1, CTA ancré en bas (mt-auto)
 */
import Image from "next/image";

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
  isSimpleProduct: boolean;
  isAvailable: boolean;
  shortDescription?: string | null;
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
   * CTA rendu dans la zone d'achat, ancré en bas via mt-auto.
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
  isSimpleProduct,
  isAvailable,
  shortDescription,
  primaryImage,
  heroVariant,
  singleVariantSku,
  imageClassName = "object-contain",
  cta,
  asideExtra,
}: ProductHeroSectionProps) {
  return (
    <section className="w-full overflow-hidden rounded-xl border border-shell-border bg-shell-surface shadow-soft">
      {/* Grid 2 colonnes dès 700px (landscape phones inclus) */}
      <div className="grid min-[700px]:grid-cols-2">
        {/* ---------------------------------------------------------------- */}
        {/* Image principale                                                  */}
        {/* ---------------------------------------------------------------- */}
        <div className="border-b border-surface-border bg-media-surface min-[700px]:border-b-0 min-[700px]:border-r">
          {primaryImage ? (
            <div className="aspect-square w-full p-1.5 min-[700px]:p-2 min-[900px]:p-4">
              <div className="relative h-full w-full">
                <Image
                  alt={primaryImage.alt ?? productName}
                  className={imageClassName}
                  fill
                  loading="lazy"
                  sizes="(min-width: 700px) 50vw, 100vw"
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

        {/* ---------------------------------------------------------------- */}
        {/* Aside — zone éditoriale + zone d'achat                           */}
        {/* ---------------------------------------------------------------- */}
        <aside className="flex flex-col">
          {/* Zone éditoriale — shortDescription si présente.
              Séparée de la zone d'achat par une border-b. */}
          {shortDescription ? (
            <div className="border-b border-surface-border p-4 min-[700px]:p-6 min-[900px]:p-8">
              <div
                className="prose prose-sm dark:prose-invert max-w-prose text-hero-ink-soft [&_p]:my-0.5 [&_p]:leading-snug [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: shortDescription }}
              />
            </div>
          ) : null}

          {/* Zone d'achat — fond légèrement teinté, flex-1 pour occuper
              toute la hauteur restante de l'aside (côté image). */}
          <div className="flex flex-1 flex-col bg-surface-panel-soft p-4 min-[700px]:p-6 min-[900px]:p-8">

            {/* Prix — bloc statutaire.
                Lecture : ancien prix (barré + labellisé) → "À partir de" (si variable) → prix courant. */}
            {heroVariant ? (
              <div className="mb-3 min-[900px]:mb-4 border-b border-surface-border pb-3 min-[900px]:pb-4">
                {heroVariant.compareAtPrice ? (
                  <div className="mb-2 flex items-baseline gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Ancien prix
                    </span>
                    {/* text-lg + font-light = plus élégant comme prix barré */}
                    <span className="text-base font-light text-muted-foreground line-through min-[900px]:text-lg">
                      {heroVariant.compareAtPrice}
                    </span>
                  </div>
                ) : null}
                {!isSimpleProduct ? (
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    À partir de
                  </p>
                ) : null}
                <p className="text-3xl font-bold leading-none tracking-tight min-[700px]:text-4xl">
                  {heroVariant.price || "—"}
                </p>
              </div>
            ) : null}

            {/* Disponibilité + SKU — left-aligned, plus premium que justify-between */}
            <div className="mb-3 min-[900px]:mb-4 grid gap-2">
              <div className="flex items-center gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
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
                <div className="flex items-center gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Référence
                  </p>
                  <p className="font-mono text-sm text-muted-foreground">{singleVariantSku}</p>
                </div>
              ) : null}
            </div>

            {/* CTA — mt-auto ancre le bouton en bas de la zone d'achat
                lorsque la colonne image est plus haute que le contenu de l'aside. */}
            {cta ? (
              <div className="mt-auto border-t border-surface-border pt-4 min-[900px]:pt-5">
                {cta}
              </div>
            ) : null}

            {asideExtra ?? null}
          </div>
        </aside>
      </div>
    </section>
  );
}
