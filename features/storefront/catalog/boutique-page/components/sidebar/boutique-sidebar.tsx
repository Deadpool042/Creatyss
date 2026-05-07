import { BoutiqueFiltersContent } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-filters-content";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueSidebarProps = {
  model: BoutiquePageViewModel;
};

export function BoutiqueSidebar({ model }: BoutiqueSidebarProps) {
  return (
    <aside className="boutique-sidebar-shell">
      <div className="boutique-sidebar-sticky">
        <div className="boutique-sidebar-panel">
          <BoutiqueFiltersContent
            model={model}
            className="boutique-sidebar-filters h-fit"
            variant="sidebar"
          />
        </div>
      </div>
    </aside>
  );
}
