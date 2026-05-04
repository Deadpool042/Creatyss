import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";
import { BoutiqueListingActionsBar } from "./boutique-listing-actions-bar";

type BoutiqueListingHeaderProps = {
  model: BoutiquePageViewModel;
  productCountLabel: string;
  isDiscoveryMode: boolean;
};

export function BoutiqueListingHeader({
  model,
  productCountLabel,
  isDiscoveryMode,
}: BoutiqueListingHeaderProps) {
  return (
    <>
      <div className={isDiscoveryMode ? "hidden" : "grid gap-3 sm:hidden"}>
        <div className="grid gap-1.5 px-2 py-1.5">
          <p className="m-0 text-[0.68rem] uppercase tracking-[0.18em] text-brand/90">
            Collection Creatyss
          </p>

          <div className="grid gap-1">
            <h1 className="m-0">Boutique</h1>
            <p className="m-0 text-xs text-text-muted-strong">{productCountLabel}</p>
          </div>
        </div>
      </div>

      <div className="relative isolate hidden overflow-hidden sm:grid sm:gap-2.5 md:gap-2 laptop:gap-2 desktop:gap-1.5 wide:gap-2 ultrawide:gap-2.5 2k:gap-3 desktop:px-0 desktop:py-0">
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-2 p-2 md:gap-2 laptop:gap-2 desktop:items-center desktop:gap-2 wide:px-3 wide:py-2.5 ultrawide:px-4 ultrawide:py-3 2k:px-5 2k:py-3.5 4k:px-6 4k:py-4">
          <div className="grid gap-1 py-1 sm:pl-0 laptop:gap-1 desktop:gap-0.5 wide:gap-1 ultrawide:gap-1.5 2k:max-w-[60ch] 4k:max-w-[64ch]">
            <p className="m-0 text-[0.68rem] uppercase tracking-[0.18em] text-brand/90">
              Collection Creatyss
            </p>
            <h1 className="m-0">Boutique</h1>

            <p className="m-0 hidden max-w-[54ch] text-sm text-text-muted-strong sm:block desktop:leading-relaxed wide:max-w-[58ch] ultrawide:max-w-[60ch] 2k:leading-relaxed 2k:max-w-[62ch] 4k:max-w-[66ch]">
              Des pièces uniques faites main, pensées pour durer et sublimer vos looks du quotidien.
            </p>

            <p className="m-0 text-xs text-text-muted-strong">
              {productCountLabel}
            </p>
          </div>
        </div>
      </div>

      <BoutiqueListingActionsBar model={model} />
    </>
  );
}
