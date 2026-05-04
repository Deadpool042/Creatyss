import { BoutiqueFiltersContent } from "@/features/storefront/catalog/boutique-page/components/filters/boutique-filters-content";
import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueSidebarProps = {
  model: BoutiquePageViewModel;
};

export function BoutiqueSidebar({ model }: BoutiqueSidebarProps) {
  return (
    <aside className="hidden pl-2 wide:block wide:self-stretch ">
      <div className="wide:sticky wide:top-32 wide:z-20 wide:max-h-[calc(100dvh-10rem)] wide:overflow-y-auto wide:overscroll-contain">
        <div className="grid gap-5 pr-1">
          <BoutiqueFiltersContent model={model} className="h-fit" />
        </div>
      </div>
    </aside>
  );
}
