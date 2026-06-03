"use client";

import { useState } from "react";

import { CustomButton } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addToCartAction } from "@/features/commerce/cart";
import type { OfferVariant } from "@/features/storefront/catalog/types/product-offer-variant.types";

type ProductHeroVariableCartFormProps = {
  productSlug: string;
  selectedVariant: OfferVariant | null;
  disabled?: boolean | undefined;
  layout?: "inline" | "stacked";
  showBuyNowHelper?: boolean;
};

/**
 * Formulaire panier pour les produits variables dans le hero.
 *
 * Client Component : gère l'état de la quantité localement.
 * Reproduit fidèlement la structure de renderCartActionForm (build-storefront-product-page-rendering.tsx).
 */
export function ProductHeroVariableCartForm({
  productSlug,
  selectedVariant,
  disabled = false,
  layout = "inline",
  showBuyNowHelper = true,
}: ProductHeroVariableCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const primaryCtaLabel =
    selectedVariant?.availabilityStatus === "made-to-order" ? "Commander" : "Ajouter au panier";

  if (selectedVariant === null || !selectedVariant.isAvailable) {
    return (
      <p className="text-text-muted-strong">
        Cette déclinaison n&apos;est pas disponible.
      </p>
    );
  }

  const buyNowHelpId = "hero-variable-buy-now-help";
  const isStackedLayout = layout === "stacked";

  return (
    <div className={isStackedLayout ? "grid gap-3" : "grid justify-start gap-3"}>
      <form
        action={addToCartAction}
        className={
          isStackedLayout ? "grid gap-2.5" : "flex flex-wrap items-center gap-3"
        }
      >
        <input type="hidden" name="productSlug" value={productSlug} />
        <input type="hidden" name="variantId" value={selectedVariant.id} />

        <Label htmlFor="hero-variable-quantity" className="sr-only">
          Quantité
        </Label>
        <Input
          id="hero-variable-quantity"
          name="quantity"
          type="number"
          min={1}
          step={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
          className={
            isStackedLayout
              ? "h-10 w-full rounded-xl border-control-border bg-surface-panel/54 px-3 transition-[border-color,background-color,box-shadow,transform] hover:border-control-border-strong hover:bg-surface-panel/68 focus-visible:ring-2 focus-visible:ring-focus-ring/35 active:translate-y-px"
              : "h-10 w-20 rounded-xl border-control-border bg-surface-panel/54 px-3 transition-[border-color,background-color,box-shadow,transform] hover:border-control-border-strong hover:bg-surface-panel/68 focus-visible:ring-2 focus-visible:ring-focus-ring/35 active:translate-y-px"
          }
          disabled={disabled}
        />

        <CustomButton
          type="submit"
          name="intent"
          value="add_to_cart"
          className={
            isStackedLayout
              ? "w-full shadow-control transition-[transform,box-shadow,filter] hover:shadow-control-hover active:translate-y-px active:shadow-control-pressed focus-visible:ring-2 focus-visible:ring-focus-ring/35"
              : "w-auto shadow-control transition-[transform,box-shadow,filter] hover:shadow-control-hover active:translate-y-px active:shadow-control-pressed focus-visible:ring-2 focus-visible:ring-focus-ring/35"
          }
          disabled={disabled}
        >
          {primaryCtaLabel}
        </CustomButton>

        <CustomButton
          type="submit"
          name="intent"
          value="buy_now"
          variant="outline"
          aria-describedby={buyNowHelpId}
          className={
            isStackedLayout
              ? "w-full border-control-border-strong bg-surface-panel/44 shadow-control transition-[background-color,transform,box-shadow] hover:bg-surface-panel/68 hover:shadow-control-hover active:translate-y-px active:shadow-control-pressed focus-visible:ring-2 focus-visible:ring-focus-ring/35"
              : "w-auto border-control-border-strong bg-surface-panel/44 shadow-control transition-[background-color,transform,box-shadow] hover:bg-surface-panel/68 hover:shadow-control-hover active:translate-y-px active:shadow-control-pressed focus-visible:ring-2 focus-visible:ring-focus-ring/35"
          }
          disabled={disabled}
        >
          Achat immédiat
        </CustomButton>

        {showBuyNowHelper ? (
          <p
            id={buyNowHelpId}
            className="basis-full text-xs leading-snug text-text-muted-strong"
          >
            Ajoutez l&apos;article, puis consultez votre panier.
          </p>
        ) : null}
      </form>
    </div>
  );
}
