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
          <p className="m-0 text-[10px] uppercase tracking-[0.18em] text-brand/90">
            Collection Creatyss
          </p>

          <div className="grid gap-1">
            <h1 className="m-0">Boutique</h1>
            <p className="m-0 text-xs text-text-muted-strong">{productCountLabel}</p>
          </div>
        </div>
      </div>

      <div className="relative isolate hidden overflow-hidden sm:grid sm:gap-2.5 md:gap-2 laptop:gap-2 desktop:gap-1.5 desktop:px-0 desktop:py-0">
        <div className="relative p-2 z-10 flex flex-wrap items-start justify-between gap-2 md:gap-2 laptop:gap-2 desktop:items-center desktop:gap-2">
          <div className="grid gap-1 py-1 sm:pl-0 laptop:gap-1 desktop:gap-0.5">
            <p className="m-0 text-[10px] uppercase tracking-[0.18em] text-brand/90">
              Collection Creatyss
            </p>
            <h1 className="m-0">Boutique</h1>

            <p className="m-0 hidden max-w-[54ch] text-sm text-text-muted-strong sm:block desktop:text-[13px] desktop:leading-relaxed">
              Des pièces uniques faites main, pensées pour durer et sublimer vos looks du quotidien.
            </p>

            <p className="m-0 text-xs text-text-muted-strong desktop:text-[11px] desktop:tracking-[0.01em]">
              {productCountLabel}
            </p>
          </div>
        </div>
      </div>

      <BoutiqueListingActionsBar model={model} />
    </>
  );
}
