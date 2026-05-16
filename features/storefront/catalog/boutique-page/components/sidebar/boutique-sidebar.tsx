import { BoutiqueFiltersContent } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-filters-content";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueSidebarProps = {
  model: BoutiquePageViewModel;
};

export function BoutiqueSidebar({ model }: BoutiqueSidebarProps) {
  return (
    <aside data-testid="boutique-sidebar-shell" className="hidden wide:block w-full">
      <div
        data-motion-surface="sidebar-panel"
        className="wide:sticky wide:top-20 wide:z-20 border-r border-surface-border-subtle px-3 py-2 grid content-start overflow-x-visible "
      >
        <BoutiqueFiltersContent model={model} className="grid gap-2" variant="sidebar" />
      </div>
    </aside>
  );
}
