import Link from "next/link";

import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueCategoryNavProps = {
  categories: BoutiquePageViewModel["categories"];
  resetHref: string;
  selectedCategorySlug: string;
};

export function BoutiqueCategoryNav({
  categories,
  resetHref,
  selectedCategorySlug,
}: BoutiqueCategoryNavProps) {
  return (
    <div className="grid gap-1.5">
      <Link
        href={resetHref}
        aria-current={selectedCategorySlug === "" ? "page" : undefined}
        className={[
          "rounded-md border px-2 py-1.5 text-sm transition-colors",
          selectedCategorySlug === ""
            ? "border-brand/40 bg-surface-panel/62 text-foreground"
            : "border-transparent text-text-muted-strong hover:border-control-border hover:bg-surface-panel/38 hover:text-foreground",
        ].join(" ")}
      >
        Tous les produits
      </Link>

      {categories.map((category) => (
        <Link
          key={category.id}
          href={category.href}
          aria-current={category.isActive ? "page" : undefined}
          className={[
            "rounded-md border px-2 py-1.5 text-sm transition-colors",
            category.isActive
              ? "border-brand/40 bg-surface-panel/62 text-foreground"
              : "border-transparent text-text-muted-strong hover:border-control-border hover:bg-surface-panel/38 hover:text-foreground",
          ].join(" ")}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
