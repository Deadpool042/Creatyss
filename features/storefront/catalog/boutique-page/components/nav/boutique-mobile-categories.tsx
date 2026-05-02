import Link from "next/link";

import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiqueMobileCategoriesProps = {
  categories: BoutiquePageViewModel["categories"];
  resetHref: string;
};

function getCategoryMonogram(label: string): string {
  const normalized = label.trim();
  if (normalized.length === 0) {
    return "?";
  }

  const [first] = normalized;
  return (first ?? "?").toUpperCase();
}

export function BoutiqueMobileCategories({ categories, resetHref }: BoutiqueMobileCategoriesProps) {
  const items = categories.slice(0, 6);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-3 min-[560px]:hidden">
      <div className="flex items-center justify-between">
        <p className="m-0 text-sm font-semibold text-foreground">Catégories</p>
        <Link
          href={resetHref}
          className="text-xs font-medium text-text-muted-strong underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Voir tout
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {items.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="grid justify-items-center gap-2 rounded-xl border border-surface-border-subtle/70 bg-surface-panel/32 px-2 py-2.5 transition-colors hover:border-control-border hover:bg-surface-panel/46"
          >
            <span className="grid size-12 place-items-center rounded-full border border-surface-border-subtle/80 bg-surface-panel/60 text-sm font-semibold text-foreground">
              {getCategoryMonogram(category.name)}
            </span>
            <span className="line-clamp-1 text-xs text-text-muted-strong">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
