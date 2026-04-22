/**
 * Section offres/déclinaisons partagée — fiche produit.
 *
 * Utilisée par le storefront (app/boutique/[slug]/page.tsx)
 * et la preview admin (app/admin/.../products/[slug]/preview/page.tsx).
 *
 * Le CTA par variant (bouton panier réel vs bouton disabled) est injecté via
 * la prop `renderVariantCta` pour que ce composant reste sans logique d'action.
 *
 * Lot : PAGE-SHARED-1
 */
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import {
  getSimpleOfferCardTitle,
  getVariantAvailabilityLabel,
  getVariantDefaultBadgeLabel,
  type ProductPublicSectionPresentation,
} from "@/entities/product/product-public-presentation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Représentation normalisée d'un variant pour la section offres.
 * Les pages sont responsables de la résolution des URLs d'image avant de passer
 * ce type au composant.
 */
export type OfferVariant = {
  id: string;
  name: string;
  /** Prix formaté — peut être chaîne vide si non renseigné. */
  price: string;
  compareAtPrice: string | null;
  isAvailable: boolean;
  isDefault: boolean;
  sku: string | null;
  colorName: string | null;
  colorHex: string | null;
  displayImage: { src: string; alt: string } | null;
};

type ProductOffersSectionProps = {
  productType: "simple" | "variable";
  variants: OfferVariant[];
  presentation: ProductPublicSectionPresentation;
  /**
   * Render prop injectant la zone CTA dans chaque carte variant (produits variables),
   * placée après le bloc prix.
   * Storefront : message de disponibilité + form addToCart.
   * Admin : bouton disabled.
   * Si absent, aucun CTA n'est rendu.
   */
  renderVariantCta?: ((variant: OfferVariant) => React.ReactNode) | undefined;
  /**
   * Contenu optionnel rendu avant la grille de variants (produits variables uniquement).
   * Utilisé par l'admin pour afficher les badges de résumé (nombre / disponibles).
   */
  summaryContent?: React.ReactNode | undefined;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductOffersSection({
  productType,
  variants,
  presentation,
  renderVariantCta,
  summaryContent,
}: ProductOffersSectionProps) {
  const isSimpleProduct = productType === "simple";
  const singleVariant = isSimpleProduct && variants.length === 1 ? variants[0] : null;

  return (
    <section className="w-full rounded-xl border border-shell-border bg-shell-surface p-8 shadow-soft min-[700px]:p-10">
      <div className="mb-8 grid gap-2">
        <p className="text-sm font-bold uppercase tracking-widest text-brand">
          {presentation.eyebrow}
        </p>
        <h2 className="m-0">{presentation.title}</h2>
      </div>

      {isSimpleProduct ? (
        singleVariant ? (
          <SimpleOfferCard variant={singleVariant} />
        ) : (
          <OfferEmptyState presentation={presentation} />
        )
      ) : variants.length > 0 ? (
        <>
          {summaryContent ?? null}
          <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]">
            {variants.map((variant) => (
              <VariantOfferCard key={variant.id} renderCta={renderVariantCta} variant={variant} />
            ))}
          </div>
        </>
      ) : (
        <OfferEmptyState presentation={presentation} />
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sub-components (module-private)
// ---------------------------------------------------------------------------

function SimpleOfferCard({ variant }: { variant: OfferVariant }) {
  return (
    <article className="grid gap-5 rounded-lg border border-surface-border bg-surface-panel-soft p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <h3>{getSimpleOfferCardTitle()}</h3>
          <p className="text-sm text-muted-foreground">{variant.name}</p>
        </div>
        <Badge variant="outline">
          <span className={variant.isAvailable ? "text-emerald-700" : "text-destructive"}>
            {getVariantAvailabilityLabel(variant.isAvailable)}
          </span>
        </Badge>
      </div>

      {(variant.sku ?? variant.colorName ?? variant.colorHex) ? (
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
          {variant.sku ? (
            <div className="grid gap-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                SKU
              </p>
              <p className="leading-relaxed">{variant.sku}</p>
            </div>
          ) : null}
          {(variant.colorName ?? variant.colorHex) ? (
            <div className="grid gap-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Couleur
              </p>
              <p className="leading-relaxed">
                {variant.colorName}
                {variant.colorHex ? ` · ${variant.colorHex}` : ""}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {variant.displayImage ? (
        <figure className="overflow-hidden rounded-lg bg-media-surface min-h-40">
          <Image
            alt={variant.displayImage.alt}
            className="block w-full object-cover"
            loading="lazy"
            src={variant.displayImage.src}
            width={600}
            height={450}
          />
        </figure>
      ) : null}
    </article>
  );
}

function VariantOfferCard({
  variant,
  renderCta,
}: {
  variant: OfferVariant;
  renderCta?: ((variant: OfferVariant) => React.ReactNode) | undefined;
}) {
  const defaultBadgeLabel = getVariantDefaultBadgeLabel(variant.isDefault);

  return (
    <article className="grid gap-5 rounded-lg border border-surface-border bg-surface-panel-soft p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <h3 className="text-base font-semibold">{variant.name}</h3>
          {(variant.colorName ?? variant.colorHex) ? (
            <p className="text-sm text-muted-foreground">
              {variant.colorName}
              {variant.colorHex ? ` · ${variant.colorHex}` : ""}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {defaultBadgeLabel ? <Badge variant="secondary">{defaultBadgeLabel}</Badge> : null}
          <Badge variant="outline">
            <span className={variant.isAvailable ? "text-emerald-700" : "text-destructive"}>
              {getVariantAvailabilityLabel(variant.isAvailable)}
            </span>
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-1">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Prix</p>
          <p className="text-2xl font-bold leading-tight">{variant.price || "—"}</p>
          {variant.compareAtPrice ? (
            <p className="text-sm text-muted-foreground">
              Prix avant réduction : {variant.compareAtPrice}
            </p>
          ) : null}
        </div>
        {renderCta ? renderCta(variant) : null}
      </div>

      {(variant.sku ?? variant.colorName ?? variant.colorHex) ? (
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]">
          {variant.sku ? (
            <div className="grid gap-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                SKU
              </p>
              <p className="leading-relaxed">{variant.sku}</p>
            </div>
          ) : null}
          {(variant.colorName ?? variant.colorHex) ? (
            <div className="grid gap-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Couleur
              </p>
              <p className="leading-relaxed">
                {variant.colorName}
                {variant.colorHex ? ` · ${variant.colorHex}` : ""}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

      {variant.displayImage ? (
        <figure className="overflow-hidden rounded-lg bg-media-surface min-h-40">
          <Image
            alt={variant.displayImage.alt}
            className="block w-full object-cover"
            loading="lazy"
            src={variant.displayImage.src}
            width={600}
            height={450}
          />
        </figure>
      ) : (
        <div className="grid place-items-center min-h-56 rounded-lg bg-media-surface p-4 text-center text-media-foreground">
          Aucun visuel pour cette déclinaison.
        </div>
      )}
    </article>
  );
}

function OfferEmptyState({ presentation }: { presentation: ProductPublicSectionPresentation }) {
  return (
    <div className="grid gap-4 rounded-lg border border-surface-border bg-surface-panel-soft p-6">
      <p className="text-sm font-bold uppercase tracking-widest text-brand">
        {presentation.emptyEyebrow}
      </p>
      <h2>{presentation.emptyTitle}</h2>
      <p className="leading-relaxed text-muted-foreground">{presentation.emptyDescription}</p>
    </div>
  );
}
