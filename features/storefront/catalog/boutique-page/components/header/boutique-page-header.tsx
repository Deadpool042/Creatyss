import { BoutiqueDiscoveryHeader } from "@/features/storefront/catalog/boutique-page/components/header/boutique-discovery-header";
import { BoutiqueListingHeader } from "@/features/storefront/catalog/boutique-page/components/header/boutique-listing-header";
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
    <section className="grid gap-4  sm:gap-3 md:gap-4 md:pb-4 laptop:gap-3 laptop:pb-4 desktop:gap-3 desktop:pb-3">
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
    </section>
  );
}
