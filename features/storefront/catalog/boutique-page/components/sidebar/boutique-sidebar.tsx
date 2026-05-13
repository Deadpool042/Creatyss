import { BoutiqueFiltersContent } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-filters-content";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueSidebarProps = {
  model: BoutiquePageViewModel;
};

export function BoutiqueSidebar({ model }: BoutiqueSidebarProps) {
  return (
    <aside
      data-testid="boutique-sidebar-shell"
      className="hidden wide:block wide:self-stretch"
    >
      <div className="wide:sticky wide:top-[9rem] wide:z-20 wide:max-h-[calc(100dvh-9rem)] wide:overflow-hidden wide:content-start">
        <div
          data-motion-surface="sidebar-panel"
          data-scroll-area="sidebar-filters"
          className="grid min-h-0 content-start rounded-lg border border-surface-border-subtle bg-background-secondary p-3.5 wide:max-h-[calc(100dvh-9rem)] wide:overflow-y-auto wide:overscroll-contain wide:pr-[0.55rem]"
        >
          <BoutiqueFiltersContent
            model={model}
            className="grid gap-2"
            variant="sidebar"
          />
        </div>
      </div>
    </aside>
  );
}
