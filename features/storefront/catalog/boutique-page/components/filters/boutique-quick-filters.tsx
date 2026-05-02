import Link from "next/link";

import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueQuickFiltersProps = {
  filters: BoutiquePageViewModel["quickFilters"];
};

export function BoutiqueQuickFilters({ filters }: BoutiqueQuickFiltersProps) {
  return (
    <div className="mt-3 grid gap-1.5 px-2 md:max-[1199px]:mt-2 md:max-[1199px]:gap-1 md:max-[1199px]:px-1">
      <p className="m-0 text-[10px] uppercase tracking-wide text-text-muted-strong/80">
        Accès rapide
      </p>
      <div className="flex flex-wrap gap-2 md:max-[1199px]:gap-1.5">
        {filters.map((filter) => (
          <Link
            key={filter.id}
            href={filter.href}
            aria-current={filter.isActive ? "page" : undefined}
            title={filter.isActive ? `${filter.label} (actif)` : filter.label}
            className={[
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors md:max-[1199px]:px-2.5 md:max-[1199px]:py-0.5 md:max-[1199px]:text-[11px]",
              filter.isActive
                ? "border-brand/40 bg-surface-panel/62 text-foreground"
                : "border-transparent text-text-muted-strong hover:border-control-border hover:bg-surface-panel/38 hover:text-foreground",
            ].join(" ")}
          >
            {filter.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
