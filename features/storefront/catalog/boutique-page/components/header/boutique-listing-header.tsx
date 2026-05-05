import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";
import { BoutiqueListingActionsBar } from "./boutique-listing-actions-bar";

type BoutiqueListingHeaderProps = {
  model: BoutiquePageViewModel;
  productCountLabel: string;
};

export function BoutiqueListingHeader({ model, productCountLabel }: BoutiqueListingHeaderProps) {
  return (
    <>
      <div className="relative isolate hidden overflow-hidden sm:grid sm:gap-2 desktop:px-0 desktop:py-0">
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-2 p-2 desktop:items-center wide:px-3 wide:py-3 ultrawide:px-4 ultrawide:py-4">
          <div className="grid max-w-3xl gap-1 py-1">
            <p className="m-0 text-xs font-medium uppercase tracking-wide text-brand/90">
              Collection Creatyss
            </p>
            <h1 className="m-0">Boutique</h1>

            <p className="m-0 hidden text-sm leading-relaxed text-text-muted-strong sm:block">
              Des pièces uniques faites main, pensées pour durer et sublimer vos looks du quotidien.
            </p>

            <p className="m-0 text-sm text-text-muted-strong">{productCountLabel}</p>
          </div>
        </div>
      </div>

      <BoutiqueListingActionsBar model={model} />
    </>
  );
}
