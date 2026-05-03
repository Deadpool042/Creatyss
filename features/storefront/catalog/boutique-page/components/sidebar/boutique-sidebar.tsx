import { BoutiqueFiltersContent } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-filters-content";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueSidebarProps = {
  model: BoutiquePageViewModel;
};

export function BoutiqueSidebar({ model }: BoutiqueSidebarProps) {
  return (
    <aside className="hidden wide:grid wide:content-start wide:gap-4 wide:sticky wide:top-24 wide:self-start">
      <div className="rounded-xl border border-surface-border-subtle/70 bg-surface-panel/22 p-4 wide:max-h-[calc(100dvh-7rem)] wide:overflow-y-auto wide:overscroll-contain">
        <BoutiqueFiltersContent model={model} />
      </div>
    </aside>
  );
}
