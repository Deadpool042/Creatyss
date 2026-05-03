// features/storefront/catalog/boutique-page/components/products/boutique-pagination.tsx
import Link from "next/link";

import type { BoutiquePageViewModel } from "@/features/storefront/catalog/boutique-page/types";

type BoutiquePaginationProps = {
  pagination: BoutiquePageViewModel["pagination"];
};

export function BoutiquePagination({ pagination }: BoutiquePaginationProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Pagination"
      className="grid justify-items-center gap-2 pb-12 pt-4 min-[700px]:pb-6"
    >
      <ul className="flex flex-wrap items-center justify-center gap-1.5">
        <li>
          {pagination.previousHref ? (
            <Link
              href={pagination.previousHref}
              rel="prev"
              aria-label="Page précédente"
              className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-control-border bg-control-surface px-3 text-xs text-text-muted-strong transition-colors hover:border-control-border-strong hover:text-foreground"
            >
              Précédent
            </Link>
          ) : (
            <span
              aria-hidden="true"
              className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-control-border/40 bg-control-surface/40 px-3 text-xs text-text-muted-strong/50"
            >
              Précédent
            </span>
          )}
        </li>

        {pagination.items.map((item) => {
          if (item.kind === "ellipsis") {
            return (
              <li
                key={item.key}
                aria-hidden="true"
                className="inline-flex h-9 min-w-9 items-center justify-center px-2 text-xs text-text-muted-strong"
              >
                …
              </li>
            );
          }

          return (
            <li key={`page-${item.pageNumber}`}>
              {item.isCurrent ? (
                <span
                  aria-current="page"
                  aria-label={`Page ${item.pageNumber}, page courante`}
                  className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-brand bg-brand px-3 text-xs font-medium text-brand-foreground"
                >
                  {item.pageNumber}
                </span>
              ) : (
                <Link
                  href={item.href}
                  aria-label={`Page ${item.pageNumber}`}
                  className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-control-border bg-control-surface px-3 text-xs text-text-muted-strong transition-colors hover:border-control-border-strong hover:text-foreground"
                >
                  {item.pageNumber}
                </Link>
              )}
            </li>
          );
        })}

        <li>
          {pagination.nextHref ? (
            <Link
              href={pagination.nextHref}
              rel="next"
              aria-label="Page suivante"
              className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-control-border bg-control-surface px-3 text-xs text-text-muted-strong transition-colors hover:border-control-border-strong hover:text-foreground"
            >
              Suivant
            </Link>
          ) : (
            <span
              aria-hidden="true"
              className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-control-border/40 bg-control-surface/40 px-3 text-xs text-text-muted-strong/50"
            >
              Suivant
            </span>
          )}
        </li>
      </ul>

      <p className="m-0 text-[11px] text-text-muted-strong">
        Page {pagination.currentPage} sur {pagination.totalPages}
      </p>
    </nav>
  );
}
