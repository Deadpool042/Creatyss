import { BoutiqueFiltersContent } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-filters-content";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueSidebarProps = {
  model: BoutiquePageViewModel;
};

export function BoutiqueSidebar({ model }: BoutiqueSidebarProps) {
  return (
    <aside className="hidden wide:grid wide:content-start wide:gap-4 wide:sticky wide:top-24 wide:self-start wide:max-h-[calc(100dvh-7rem)] wide:overflow-y-auto wide:overscroll-contain">
      <div className="grid gap-5 pr-1">
        <BoutiqueFiltersContent model={model} />
      </div>
    </aside>
  );
}
