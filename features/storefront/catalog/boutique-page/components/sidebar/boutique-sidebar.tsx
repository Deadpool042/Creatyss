import { BoutiqueFiltersContent } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-filters-content";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueSidebarProps = {
  model: BoutiquePageViewModel;
};

export function BoutiqueSidebar({ model }: BoutiqueSidebarProps) {
  return (
    <aside className="hidden wide:grid wide:h-full wide:min-h-0 wide:content-start wide:gap-4 wide:overflow-hidden">
      <div className="min-h-0 rounded-xl border border-surface-border-subtle/70 bg-surface-panel/22 p-4 wide:h-full wide:overflow-y-auto wide:overscroll-contain">
        <BoutiqueFiltersContent model={model} />
      </div>
    </aside>
  );
}
