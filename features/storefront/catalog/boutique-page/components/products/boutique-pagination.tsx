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
      className="grid justify-items-center gap-2.5 pb-12 pt-5 min-[700px]:pb-6"
    >
      {pagination.nextHref ? (
        <Link
          href={pagination.nextHref}
          rel="next"
          aria-label="Voir plus de créations"
          className="inline-flex min-h-10 min-w-56 items-center justify-center rounded-full border border-brand/55 bg-transparent px-6 text-xs font-semibold uppercase tracking-[0.16em] text-brand no-underline transition-colors hover:border-brand hover:bg-brand/8 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Voir plus de créations
        </Link>
      ) : null}

      <p className="m-0 text-[11px] text-text-muted-strong">
        Page {pagination.currentPage} sur {pagination.totalPages}
      </p>

      <ul
        className="flex flex-wrap items-center justify-center gap-1.5"
        aria-label="Pages boutique"
      >
        {pagination.previousHref ? (
          <li>
            <Link
              href={pagination.previousHref}
              rel="prev"
              aria-label="Page précédente"
              className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-control-border/70 bg-transparent px-3 text-xs text-text-muted-strong no-underline transition-colors hover:border-control-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Précédent
            </Link>
          </li>
        ) : null}

        {pagination.items.map((item) => {
          if (item.kind === "ellipsis") {
            return (
              <li
                key={item.key}
                aria-hidden="true"
                className="inline-flex h-8 min-w-8 items-center justify-center px-2 text-xs text-text-muted-strong"
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
                  className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-brand bg-brand px-3 text-xs font-medium text-brand-foreground"
                >
                  {item.pageNumber}
                </span>
              ) : (
                <Link
                  href={item.href}
                  aria-label={`Page ${item.pageNumber}`}
                  className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-control-border/70 bg-transparent px-3 text-xs text-text-muted-strong no-underline transition-colors hover:border-control-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {item.pageNumber}
                </Link>
              )}
            </li>
          );
        })}

        {pagination.nextHref ? (
          <li>
            <Link
              href={pagination.nextHref}
              rel="next"
              aria-label="Page suivante"
              className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-control-border/70 bg-transparent px-3 text-xs text-text-muted-strong no-underline transition-colors hover:border-control-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Suivant
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
