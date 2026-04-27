import Link from "next/link";

import { CustomButton } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addToCartAction } from "@/features/cart";
import type { OfferVariant } from "@/features/storefront/catalog/components/product-offers-section";

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

export function buildStorefrontProductPageRendering(
  input: BuildStorefrontProductPageRenderingInput
): StorefrontProductPageRendering {
  const { productSlug, isSimpleProduct, singleOffer, variantSummary } = input;

  const heroCta =
    singleOffer && singleOffer.isAvailable ? (
      <form action={addToCartAction} className="flex flex-wrap items-center gap-3">
        <input type="hidden" name="productSlug" value={productSlug} />
        <input type="hidden" name="variantId" value={singleOffer.id} />

        <Label htmlFor="hero-quantity" className="sr-only">Quantité</Label>
        <Input
          id="hero-quantity"
          name="quantity"
          type="number"
          min={1}
          step={1}
          defaultValue={1}
          className="h-11 w-20 rounded-xl px-3"
        />

        <CustomButton type="submit" className="flex-1 sm:flex-none">Ajouter au panier</CustomButton>
      </form>
    ) : !isSimpleProduct ? (
      <CustomButton asChild>
        <Link href="#offers">Choisir une déclinaison</Link>
      </CustomButton>
    ) : null;

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
      <div className="grid gap-2">
        <p className="text-micro-copy reading-compact text-text-muted-strong">
          Ajout au panier
        </p>
        <form action={addToCartAction} className="flex flex-wrap items-end gap-2">
          <input type="hidden" name="productSlug" value={productSlug} />
          <input type="hidden" name="variantId" value={variant.id} />

          <div className="grid gap-1">
            <Label htmlFor={`quantity-${variant.id}`} className="sr-only">
              Quantité
            </Label>
            <Input
              id={`quantity-${variant.id}`}
              name="quantity"
              type="number"
              min={1}
              step={1}
              defaultValue={1}
              className="h-9 w-20"
            />
          </div>

          <CustomButton type="submit" size="sm">
            Ajouter au panier
          </CustomButton>
        </form>
      </div>
    );
  };

  return {
    heroCta,
    offersSummaryContent,
    renderVariantCta,
  };
}
