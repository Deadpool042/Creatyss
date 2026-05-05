import { BoutiqueDiscoveryHeader } from "@/features/storefront/catalog/boutique-page/components/header/boutique-discovery-header";
import { BoutiqueListingHeader } from "@/features/storefront/catalog/boutique-page/components/header/boutique-listing-header";
import { BoutiqueListingActionsBar } from "@/features/storefront/catalog/boutique-page/components/header/boutique-listing-actions-bar";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiquePageHeaderProps = {
  model: BoutiquePageViewModel;
  productCountLabel: string;
  activeCategoryName: string | null;
  heroImage: BoutiquePageViewModel["heroImage"];
};

export function BoutiquePageHeader({
  model,
  productCountLabel,
  activeCategoryName,
  heroImage,
}: BoutiquePageHeaderProps) {
  return (
    <section className="boutique-page-header-shell md:pb-4 desktop:pb-3 wide:pb-4">
      <div className="boutique-mobile-portrait">
        <BoutiqueDiscoveryHeader
          productCountLabel={productCountLabel}
          activeCategoryName={activeCategoryName}
          heroImage={heroImage}
        />
        <BoutiqueListingHeader model={model} productCountLabel={productCountLabel} />
      </div>

      <div className="boutique-mobile-landscape">
        <div className="grid gap-1 px-2">
          <p className="m-0 text-xs font-medium uppercase tracking-wide text-brand/90">
            Collection Creatyss
          </p>
          <div className="flex items-baseline justify-between gap-2">
            <h1 className="m-0 text-2xl leading-tight">Boutique</h1>
            <p className="m-0 text-xs text-text-muted-strong">{productCountLabel}</p>
          </div>
        </div>

        <BoutiqueListingActionsBar model={model} />
      </div>
    </section>
  );
}
