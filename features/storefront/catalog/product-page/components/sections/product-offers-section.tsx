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
  getOfferAvailabilityMessage,
  getVariantDefaultBadgeLabel,
  type ProductPublicSectionPresentation,
} from "@/entities/product/product-public-presentation";
import type {
  OfferVariant,
  OfferVariantOptionValue,
} from "@/features/storefront/catalog/types/product-offer-variant.types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type { OfferVariant, OfferVariantOptionValue };

type ProductOffersSectionProps = {
  id?: string | undefined;
  productType: "simple" | "variable";
  variants: OfferVariant[];
  presentation: ProductPublicSectionPresentation;
  renderVariantCta?: ((variant: OfferVariant) => React.ReactNode) | undefined;
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
      ? "Retrouvez ici chaque déclinaison avec son état, puis confirmez votre choix pour l'ajout au panier."
      : null;
  const roleHint =
    productType === "variable" ? "Validation d'achat" : presentation.eyebrow;
  const resolvedTitle =
    productType === "variable" ? "Confirmer une déclinaison" : presentation.title;

  return (
    <section
      id={id}
      className="w-full rounded-xl border border-shell-border/80 bg-linear-to-b from-surface-panel-soft/92 to-surface-subtle/68 p-5 shadow-soft [@media(max-height:480px)]:p-4 min-[700px]:p-8"
    >
      <div className="mb-6 grid gap-2.5 min-[700px]:mb-7">
        <p className="text-eyebrow text-brand">{roleHint}</p>
        <h2 className="m-0 text-title-section">{resolvedTitle}</h2>
        {actionHint ? (
          <p className="max-w-2xl text-secondary-copy reading-relaxed text-text-muted-strong">
            {actionHint}
          </p>
        ) : null}
      </div>

      {isSimpleProduct ? (
        singleVariant ? (
          <SimpleOfferCard variant={singleVariant} presentation={presentation} />
        ) : (
          <OfferEmptyState presentation={presentation} />
        )
      ) : variants.length > 0 ? (
        <>
          {summaryContent ? <div className="mb-6 min-[700px]:mb-7">{summaryContent}</div> : null}
          <div className="grid gap-4 min-[700px]:gap-5 grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]">
            {variants.map((variant) => (
              <VariantOfferCard key={variant.id} variant={variant} renderCta={renderVariantCta} />
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

  const optionLabel = variant.optionValues.map((item) => item.valueLabel).join(" · ");
  if (optionLabel.length > 0) {
    parts.push(optionLabel);
  } else if (variant.colorName) {
    parts.push(variant.colorHex ? `${variant.colorName} · ${variant.colorHex}` : variant.colorName);
  } else if (variant.colorHex) {
    parts.push(variant.colorHex);
  }

  const text = parts.join(" · ").trim();
  return text.length > 0 ? text : null;
}

function SimpleOfferCard({
  variant,
  presentation,
}: {
  variant: OfferVariant;
  presentation: ProductPublicSectionPresentation;
}) {
  const metaText = getVariantMetaText(variant);

  return (
    <article className="grid gap-4 rounded-xl border border-surface-border-subtle/80 bg-surface-panel/55 p-5 shadow-inset-soft min-[700px]:gap-4.5 min-[700px]:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid min-w-0 gap-1">
          <h3 className="m-0 text-title-compact">{getSimpleOfferCardTitle()}</h3>
          <p className="m-0 text-secondary-copy reading-compact text-text-muted-strong">
            {variant.name}
          </p>
        </div>
        <Badge variant="outline">
          <span className={variant.isAvailable ? "text-feedback-success-foreground" : "text-destructive"}>
            {getOfferAvailabilityMessage({
              productType: "simple",
              isAvailable: variant.isAvailable,
            })}
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

      <p className="m-0 border-t border-surface-border-subtle/70 pt-3 text-secondary-copy reading-compact text-text-muted-strong">
        {presentation.description}
      </p>
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
    <article className="grid gap-4 rounded-xl border border-surface-border-subtle/80 bg-surface-panel/55 p-5 shadow-inset-soft min-[700px]:gap-4.5 min-[700px]:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid min-w-0 gap-1">
          <p className="text-meta-label text-text-muted-soft">Déclinaison</p>
          <h3 className="m-0 text-title-compact">{variant.name}</h3>
          {metaText ? (
            <p className="m-0 text-micro-copy reading-compact text-text-muted-soft">{metaText}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {defaultBadgeLabel ? <Badge variant="secondary">{defaultBadgeLabel}</Badge> : null}
          <Badge variant="outline">
            <span className={variant.isAvailable ? "text-feedback-success-foreground" : "text-destructive"}>
              {getOfferAvailabilityMessage({
                productType: "variable",
                isAvailable: variant.isAvailable,
              })}
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

      {renderCta ? (
        <div className="border-t border-surface-border-subtle/70 pt-3.5">{renderCta(variant)}</div>
      ) : null}
    </article>
  );
}

function OfferEmptyState({ presentation }: { presentation: ProductPublicSectionPresentation }) {
  return (
    <div className="grid gap-4 rounded-xl border border-surface-border-subtle/80 bg-surface-panel/55 p-6 shadow-inset-soft">
      <p className="text-eyebrow text-brand">{presentation.emptyEyebrow}</p>
      <h3 className="text-title-compact">{presentation.emptyTitle}</h3>
      <p className="leading-relaxed text-muted-foreground">{presentation.emptyDescription}</p>
    </div>
  );
}
