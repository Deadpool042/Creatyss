import Link from "next/link";

import { CustomButton } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addToCartAction } from "@/features/cart";
import type { OfferVariant } from "@/features/storefront/catalog/types/product-offer-variant.types";

type BuildStorefrontProductPageRenderingInput = {
  productSlug: string;
  isSimpleProduct: boolean;
  singleOffer: OfferVariant | null;
  variantSummary: { total: number; available: number } | null;
};

type StorefrontProductPageRendering = {
  heroCta: React.ReactNode;
  offersSummaryContent: React.ReactNode;
  renderVariantCta: (variant: OfferVariant) => React.ReactNode;
};

function renderBuyNowPresentation(): React.ReactNode {
  return (
    <div className="grid justify-start gap-1">
      <CustomButton
        type="button"
        variant="outline"
        disabled
        aria-disabled="true"
        className="w-auto justify-self-start"
      >
        Achat immédiat
      </CustomButton>

      <p className="text-micro-copy reading-compact text-text-muted-strong">Bientôt disponible</p>
    </div>
  );
}

function renderHeroAddToCartForm(input: {
  productSlug: string;
  variantId: string;
}): React.ReactNode {
  return (
    <form action={addToCartAction} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="productSlug" value={input.productSlug} />
      <input type="hidden" name="variantId" value={input.variantId} />

      <Label htmlFor="hero-quantity" className="sr-only">
        Quantité
      </Label>
      <Input
        id="hero-quantity"
        name="quantity"
        type="number"
        min={1}
        step={1}
        defaultValue={1}
        className="h-10 w-20 rounded-xl px-3"
      />

      <CustomButton type="submit" className="w-auto">
        Ajouter au panier
      </CustomButton>
    </form>
  );
}

function renderVariantAddToCartForm(input: {
  productSlug: string;
  variantId: string;
}): React.ReactNode {
  return (
    <form action={addToCartAction} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="productSlug" value={input.productSlug} />
      <input type="hidden" name="variantId" value={input.variantId} />

      <div className="grid gap-1">
        <Label htmlFor={`quantity-${input.variantId}`} className="sr-only">
          Quantité
        </Label>
        <Input
          id={`quantity-${input.variantId}`}
          name="quantity"
          type="number"
          min={1}
          step={1}
          defaultValue={1}
          className="h-9 w-20"
        />
      </div>

      <CustomButton type="submit" className="w-auto" size="sm">
        Ajouter au panier
      </CustomButton>
    </form>
  );
}

export function buildStorefrontProductPageRendering(
  input: BuildStorefrontProductPageRenderingInput
): StorefrontProductPageRendering {
  const { productSlug, isSimpleProduct, singleOffer, variantSummary } = input;

  const canRenderHeroAddToCart = Boolean(singleOffer?.isAvailable);
  const shouldShowHeroBuyNowPresentation = canRenderHeroAddToCart;
  const shouldRenderVariantSelectionCta = !isSimpleProduct && !canRenderHeroAddToCart;

  let heroCta: React.ReactNode = null;

  if (canRenderHeroAddToCart && singleOffer) {
    heroCta = (
      <div className="grid justify-start gap-3">
        {renderHeroAddToCartForm({
          productSlug,
          variantId: singleOffer.id,
        })}
        {shouldShowHeroBuyNowPresentation ? renderBuyNowPresentation() : null}
      </div>
    );
  } else if (shouldRenderVariantSelectionCta) {
    heroCta = (
      <CustomButton asChild>
        <Link href="#offers">Choisir une déclinaison</Link>
      </CustomButton>
    );
  }

  const offersSummaryContent =
    !isSimpleProduct && variantSummary ? (
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-control-border bg-control-surface px-2.5 py-1 text-micro-copy font-medium text-text-muted-strong">
          {variantSummary.total} déclinaison{variantSummary.total > 1 ? "s" : ""}
        </span>
        <span className="rounded-full border border-control-border bg-control-surface px-2.5 py-1 text-micro-copy font-medium text-text-muted-strong">
          {variantSummary.available} disponible{variantSummary.available > 1 ? "s" : ""}
        </span>
      </div>
    ) : undefined;

  const renderVariantCta = (variant: OfferVariant) => {
    if (!variant.isAvailable) {
      return (
        <p className="text-micro-copy reading-compact font-medium text-feedback-error-foreground">
          Indisponible actuellement.
        </p>
      );
    }

    return (
      <div className="grid justify-start gap-2.5">
        <div className="grid gap-2">
          <p className="text-micro-copy reading-compact text-text-muted-strong">Ajout au panier</p>
          {renderVariantAddToCartForm({
            productSlug,
            variantId: variant.id,
          })}
        </div>

        {renderBuyNowPresentation()}
      </div>
    );
  };

  return {
    heroCta,
    offersSummaryContent,
    renderVariantCta,
  };
}
