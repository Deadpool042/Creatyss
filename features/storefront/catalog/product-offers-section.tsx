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
  id?: string | undefined;
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
  id,
  productType,
  variants,
  presentation,
  renderVariantCta,
  summaryContent,
}: ProductOffersSectionProps) {
  const isSimpleProduct = productType === "simple";
  const singleVariant = isSimpleProduct && variants.length === 1 ? variants[0] : null;
  const actionHint =
    productType === "variable"
      ? "Choisissez une déclinaison disponible, puis ajoutez-la au panier."
      : null;

  return (
    <section
      id={id}
      className="w-full rounded-xl border border-shell-border bg-surface-panel-soft p-5 shadow-soft [@media(max-height:480px)]:p-4 min-[700px]:p-8"
    >
      <div className="mb-5 grid gap-2 min-[700px]:mb-6">
        <p className="text-eyebrow text-brand">{presentation.eyebrow}</p>
        <h2 className="m-0 text-title-section">{presentation.title}</h2>
        {actionHint ? (
          <p className="max-w-2xl text-secondary-copy reading-relaxed text-text-muted-strong">
            {actionHint}
          </p>
        ) : null}
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

function getVariantMetaText(variant: OfferVariant): string | null {
  const parts: string[] = [];

  if (variant.sku) {
    parts.push(`Ref. ${variant.sku}`);
  }

  if (variant.colorName) {
    parts.push(variant.colorHex ? `${variant.colorName} · ${variant.colorHex}` : variant.colorName);
  } else if (variant.colorHex) {
    parts.push(variant.colorHex);
  }

  const text = parts.join(" · ").trim();
  return text.length > 0 ? text : null;
}

function SimpleOfferCard({ variant }: { variant: OfferVariant }) {
  const metaText = getVariantMetaText(variant);

  return (
    <article className="grid gap-4 rounded-lg border border-surface-border bg-surface-panel-soft p-5 min-[700px]:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid min-w-0 gap-1">
          <h3 className="m-0 text-title-compact">{getSimpleOfferCardTitle()}</h3>
          <p className="m-0 text-secondary-copy reading-compact text-text-muted-strong">
            {variant.name}
          </p>
        </div>
        <Badge variant="outline">
          <span className={variant.isAvailable ? "text-emerald-700" : "text-destructive"}>
            {getVariantAvailabilityLabel(variant.isAvailable)}
          </span>
        </Badge>
      </div>

      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-price-compact">{variant.price || "—"}</span>
        {variant.compareAtPrice ? (
          <span className="text-secondary-copy reading-compact font-medium line-through text-text-muted-strong">
            {variant.compareAtPrice}
          </span>
        ) : null}
      </div>

      {metaText ? (
        <p className="m-0 text-micro-copy reading-compact text-text-muted-soft">{metaText}</p>
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
  const metaText = getVariantMetaText(variant);

  return (
    <article className="grid gap-4 rounded-lg border border-surface-border bg-surface-panel-soft p-5 min-[700px]:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid min-w-0 gap-1">
          <h3 className="m-0 text-title-compact">{variant.name}</h3>
          {metaText ? (
            <p className="m-0 text-micro-copy reading-compact text-text-muted-soft">{metaText}</p>
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

      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-price-compact">{variant.price || "—"}</span>
        {variant.compareAtPrice ? (
          <span className="text-secondary-copy reading-compact font-medium line-through text-text-muted-strong">
            {variant.compareAtPrice}
          </span>
        ) : null}
      </div>

      {renderCta ? <div className="pt-1">{renderCta(variant)}</div> : null}
    </article>
  );
}

function OfferEmptyState({ presentation }: { presentation: ProductPublicSectionPresentation }) {
  return (
    <div className="grid gap-4 rounded-lg border border-surface-border bg-surface-panel-soft p-6">
      <p className="text-eyebrow text-brand">{presentation.emptyEyebrow}</p>
      <h3 className="text-title-compact">{presentation.emptyTitle}</h3>
      <p className="leading-relaxed text-muted-foreground">{presentation.emptyDescription}</p>
    </div>
  );
}
