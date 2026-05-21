"use client";

import { useState, useTransition } from "react";
import { Archive, X } from "lucide-react";
import { toast } from "sonner";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminPaginationBar } from "@/components/admin/tables/admin-pagination-bar";
import { Button } from "@/components/ui/button";
import { CustomLink } from "@/components/shared";
import { cn } from "@/lib/utils";
import { useCategoryFilters } from "@/features/admin/categories/list/hooks/use-category-filters";

import { bulkDeleteCategoriesAction } from "../../actions/bulk-delete-categories-action";
import { useCategoriesTableContext } from "../../context/categories-data-provider";
import { CategoryListToolbar } from "./category-list-toolbar";
import { CategoryTableDesktop } from "./category-table-desktop";
import { CategoryTableMobile } from "./category-table-mobile";

// ---------------------------------------------------------------------------
// CategoryBulkBar — barre sticky en bas du container scroll desktop
// ---------------------------------------------------------------------------

type CategoryBulkBarProps = {
  count: number;
  isPending: boolean;
  onClear: () => void;
  onDelete: () => void;
};

function CategoryBulkBar({ count, isPending, onClear, onDelete }: CategoryBulkBarProps) {
  if (count === 0) return null;

  return (
    <div className="sticky bottom-4 flex justify-center">
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-surface-border",
          "bg-card/95 px-4 py-2.5 shadow-lg backdrop-blur-sm",
          "animate-in fade-in slide-in-from-bottom-2 duration-200"
        )}
      >
        <span className="text-sm font-medium text-foreground">
          {count} sélectionnée{count > 1 ? "s" : ""}
        </span>

        <div className="h-4 w-px bg-surface-border" />

        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-muted-foreground hover:text-foreground"
          disabled={isPending}
          onClick={onDelete}
          aria-label={`Archiver ${count} catégorie${count > 1 ? "s" : ""}`}
        >
          <Archive className="h-3.5 w-3.5" />
          {isPending ? "Archivage…" : `Archiver${count > 1 ? ` (${count})` : ""}`}
        </Button>

        <button
          type="button"
          onClick={onClear}
          disabled={isPending}
          className="ml-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          aria-label="Désélectionner tout"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function CategoryTable() {
  const { categories, totalPages, total } = useCategoriesTableContext();
  const filters = useCategoryFilters();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const isFiltered = !!(
    filters.search ||
    filters.status.length > 0 ||
    filters.featured.length > 0 ||
    filters.categorySlugs.length > 0
  );

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (categories.length > 0 && categories.every((c) => selectedIds.has(c.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(categories.map((c) => c.id)));
    }
  }

  function handleBulkDelete() {
    const ids = [...selectedIds];
    startTransition(async () => {
      const result = await bulkDeleteCategoriesAction(ids);
      if (result.success) {
        toast.success(
          result.count > 1 ? `${result.count} catégories archivées` : "Catégorie archivée"
        );
      } else {
        toast.error("Échec de l'archivage", {
          description: "Une erreur est survenue. Veuillez réessayer.",
        });
      }
      setSelectedIds(new Set());
    });
  }

  if (categories.length === 0) {
    return (
      <>
        <CategoryListToolbar />
        {isFiltered ? (
          <AdminEmptyState
            eyebrow="Aucun résultat"
            title="Aucune catégorie ne correspond"
            description="Essayez de modifier la recherche ou les filtres."
            actionNode={
              <CustomLink
                href="/admin/catalog/categories"
                variant="navUnderline"
                className="text-brand"
              >
                Réinitialiser les filtres
              </CustomLink>
            }
          />
        ) : (
          <AdminEmptyState
            description="Créez une première catégorie pour structurer le catalogue."
            eyebrow="Aucune catégorie"
            title="Le catalogue ne contient pas encore de catégorie"
            actionNode={
              <CustomLink
                href="/admin/categories/new"
                variant="navUnderline"
                className="text-brand"
              >
                Créer une catégorie
              </CustomLink>
            }
          />
        )}
      </>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden min-h-0 flex-1 flex-col gap-3 overflow-y-auto [scrollbar-gutter:stable] p-1 lg:flex ">
        <CategoryListToolbar />
        <div className="overflow-x-auto">
          <CategoryTableDesktop
            selectedIds={selectedIds}
            onToggleOne={toggleOne}
            onToggleAll={toggleAll}
          />
        </div>
        <AdminPaginationBar
          currentPage={filters.page}
          totalPages={totalPages}
          perPage={filters.perPage}
          totalItems={total}
          onPageChange={filters.setPage}
          onPerPageChange={(n) => {
            filters.setPerPage(n);
            filters.setPage(1);
          }}
        />
        <CategoryBulkBar
          count={selectedIds.size}
          isPending={isPending}
          onClear={() => setSelectedIds(new Set())}
          onDelete={handleBulkDelete}
        />
      </div>

      {/* Mobile/tablet — infinite scroll, no pagination */}
      <div className="flex min-h-0 flex-1 flex-col lg:hidden p-1">
        <CategoryListToolbar />
        <div
          data-scroll-root="true"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2"
        >
          <CategoryTableMobile />
        </div>
      </div>
    </>
  );
}
