import { BoutiqueDiscoveryHeader } from "@/features/storefront/catalog/boutique-page/components/header/boutique-discovery-header";
import { BoutiqueListingHeader } from "@/features/storefront/catalog/boutique-page/components/header/boutique-listing-header";
import { BoutiqueListingActionsBar } from "@/features/storefront/catalog/boutique-page/components/header/boutique-listing-actions-bar";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiquePageHeaderProps = {
  model: BoutiquePageViewModel;
  productCountLabel: string;
  isDiscoveryMode: boolean;
  heroImage: BoutiquePageViewModel["heroImage"];
};

export function BoutiquePageHeader({
  model,
  productCountLabel,
  isDiscoveryMode,
  heroImage,
}: BoutiquePageHeaderProps) {
  return (
    <section className="grid gap-4 sm:gap-3 md:gap-4 md:pb-4 laptop:gap-3 laptop:pb-4 desktop:gap-3 desktop:pb-3 wide:gap-3.5 wide:pb-3.5 ultrawide:gap-4 ultrawide:pb-4 2k:gap-4.5 2k:pb-4.5 4k:gap-5 4k:pb-5 max-[767px]:landscape:gap-2 max-[767px]:landscape:pb-0">
      <div className="max-[767px]:landscape:hidden">
        {isDiscoveryMode ? (
          <>
            <BoutiqueDiscoveryHeader productCountLabel={productCountLabel} heroImage={heroImage} />
            <BoutiqueListingHeader
              model={model}
              productCountLabel={productCountLabel}
              isDiscoveryMode={isDiscoveryMode}
            />
          </>
        ) : (
          <BoutiqueListingHeader
            model={model}
            productCountLabel={productCountLabel}
            isDiscoveryMode={isDiscoveryMode}
          />
        )}
      </div>

      <div className="hidden max-[767px]:landscape:grid max-[767px]:landscape:gap-1.5">
        <div className="grid gap-0.5 px-2">
          <p className="m-0 text-[10px] uppercase tracking-[0.16em] text-brand/90">
            Collection Creatyss
          </p>
          <div className="flex items-baseline justify-between gap-2">
            <h1 className="m-0 text-[1.2rem] leading-tight">Boutique</h1>
            <p className="m-0 text-xs text-text-muted-strong">{productCountLabel}</p>
          </div>
        </div>

        <BoutiqueListingActionsBar model={model} />
      </div>
    </section>
  );
}
