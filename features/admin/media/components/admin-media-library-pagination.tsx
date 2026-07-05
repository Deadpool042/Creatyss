import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { buildMediaLibraryHref } from "./admin-media-library-helpers";

function getPaginationItems(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) items.push("ellipsis");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < totalPages - 1) items.push("ellipsis");
  items.push(totalPages);

  return items;
}

type AdminMediaLibraryPaginationProps = Readonly<{
  currentPage: number;
  totalPages: number;
  selectedAssetId?: string;
  status?: string;
  error?: string;
}>;

export function AdminMediaLibraryPagination({
  currentPage,
  totalPages,
  selectedAssetId,
  status,
  error,
}: AdminMediaLibraryPaginationProps) {
  const paginationItems = getPaginationItems(currentPage, totalPages);
  const previousHref =
    currentPage > 1
      ? buildMediaLibraryHref({
          page: currentPage - 1,
          ...(selectedAssetId ? { assetId: selectedAssetId } : {}),
          ...(error ? { error } : {}),
          ...(status ? { status } : {}),
        })
      : undefined;
  const nextHref =
    currentPage < totalPages
      ? buildMediaLibraryHref({
          page: currentPage + 1,
          ...(selectedAssetId ? { assetId: selectedAssetId } : {}),
          ...(error ? { error } : {}),
          ...(status ? { status } : {}),
        })
      : undefined;

  return (
    <div className="rounded-2xl border border-surface-border/60 bg-card px-4 py-3 shadow-card">
      <Pagination className="justify-between">
        <PaginationContent>
          <PaginationItem>
            {previousHref ? (
              <PaginationPrevious href={previousHref} text="Précédent" />
            ) : (
              <span className="inline-flex h-8 items-center px-3 text-xs text-muted-foreground">
                Début
              </span>
            )}
          </PaginationItem>
        </PaginationContent>

        <PaginationContent>
          {paginationItems.map((item, index) => (
            <PaginationItem key={`${item}-${index}`}>
              {item === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={buildMediaLibraryHref({
                    page: item,
                    ...(selectedAssetId ? { assetId: selectedAssetId } : {}),
                    ...(error ? { error } : {}),
                    ...(status ? { status } : {}),
                  })}
                  isActive={item === currentPage}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </PaginationContent>

        <PaginationContent>
          <PaginationItem>
            {nextHref ? (
              <PaginationNext href={nextHref} text="Suivant" />
            ) : (
              <span className="inline-flex h-8 items-center px-3 text-xs text-muted-foreground">
                Fin
              </span>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
