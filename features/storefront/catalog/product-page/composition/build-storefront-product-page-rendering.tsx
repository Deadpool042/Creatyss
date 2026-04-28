import { CustomButton } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addToCartAction } from "@/features/cart";
import type { OfferVariant } from "@/features/storefront/catalog/types/product-offer-variant.types";

type BuildStorefrontProductPageRenderingInput = {
  productSlug: string;
  isSimpleProduct: boolean;
  singleOffer: OfferVariant | null;
};

type StorefrontProductPageRendering = {
  heroCta: React.ReactNode;
};

type RenderCartActionFormInput = {
  productSlug: string;
  variantId: string;
  quantityInputId: string;
  quantityInputClassName: string;
  formClassName: string;
  primaryButtonSize?: React.ComponentProps<typeof CustomButton>["size"];
  secondaryButtonSize?: React.ComponentProps<typeof CustomButton>["size"];
  helperCopy: string;
};

function renderCartActionForm(input: RenderCartActionFormInput): React.ReactNode {
  const buyNowHelpId = `${input.quantityInputId}-buy-now-help`;

  return (
    <form action={addToCartAction} className={input.formClassName}>
      <input type="hidden" name="productSlug" value={input.productSlug} />
      <input type="hidden" name="variantId" value={input.variantId} />

      <Label htmlFor={input.quantityInputId} className="sr-only">
        Quantité
      </Label>
      <Input
        id={input.quantityInputId}
        name="quantity"
        type="number"
        min={1}
        step={1}
        defaultValue={1}
        className={input.quantityInputClassName}
      />

      <CustomButton
        type="submit"
        name="intent"
        value="add_to_cart"
        size={input.primaryButtonSize}
        className="w-auto"
      >
        Ajouter au panier
      </CustomButton>

      <CustomButton
        type="submit"
        name="intent"
        value="buy_now"
        variant="outline"
        size={input.secondaryButtonSize}
        aria-describedby={buyNowHelpId}
        className="w-auto border-control-border-strong"
      >
        Achat immédiat
      </CustomButton>

      <p
        id={buyNowHelpId}
        className="basis-full text-micro-copy reading-compact text-text-muted-strong"
      >
        {input.helperCopy}
      </p>
    </form>
  );
}

function renderHeroAddToCartForm(input: {
  productSlug: string;
  variantId: string;
}): React.ReactNode {
  return renderCartActionForm({
    productSlug: input.productSlug,
    variantId: input.variantId,
    quantityInputId: "hero-quantity",
    quantityInputClassName: "h-10 w-20 rounded-xl px-3",
    formClassName: "flex flex-wrap items-center gap-3",
    helperCopy: "Ajoutez l'article, puis consultez votre panier.",
  });
}

export function buildStorefrontProductPageRendering(
  input: BuildStorefrontProductPageRenderingInput
): StorefrontProductPageRendering {
  const { productSlug, singleOffer } = input;

  const canRenderHeroAddToCart = Boolean(singleOffer?.isAvailable);

  let heroCta: React.ReactNode = null;

  if (canRenderHeroAddToCart && singleOffer) {
    heroCta = (
      <div className="grid justify-start gap-3">
        {renderHeroAddToCartForm({
          productSlug,
          variantId: singleOffer.id,
        })}
      </div>
    );
  }

  return {
    heroCta,
  };
}
