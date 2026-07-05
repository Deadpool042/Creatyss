"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AdminConfigDataTableToolbar } from "@/components/admin/tables/admin-config-data-table-toolbar";
import { AdminSelectFilterControl } from "@/components/admin/tables/filters/admin-select-filter-control";
import { Button } from "@/components/ui/button";
import {
  ADMIN_MEDIA_FORMAT_OPTIONS,
  ADMIN_MEDIA_SORT_OPTIONS,
  ADMIN_MEDIA_USAGE_OPTIONS,
  ADMIN_MEDIA_VIEW_OPTIONS,
  DEFAULT_ADMIN_MEDIA_FORMAT,
  DEFAULT_ADMIN_MEDIA_SORT,
  DEFAULT_ADMIN_MEDIA_USAGE,
  DEFAULT_ADMIN_MEDIA_VIEW,
} from "@/features/admin/media/components/admin-media-library-helpers";
import type {
  AdminMediaFormatFilter,
  AdminMediaLibraryView,
  AdminMediaSortOption,
  AdminMediaUsageFilter,
} from "@/features/admin/media/types/admin-media-list-item.types";
import { AdminMediaMobileFiltersDrawer } from "./admin-media-mobile-filters-drawer";
import { AdminMediaMobileUploadSheet } from "./admin-media-mobile-upload-sheet";

type AdminMediaLibraryToolbarProps = Readonly<{
  format: AdminMediaFormatFilter;
  query: string;
  sort: AdminMediaSortOption;
  totalCount: number;
  usage: AdminMediaUsageFilter;
  view: AdminMediaLibraryView;
}>;

export function AdminMediaLibraryToolbar({
  format,
  query,
  sort,
  totalCount,
  usage,
  view,
}: AdminMediaLibraryToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [draftQuery, setDraftQuery] = useState(query);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileUploadOpen, setMobileUploadOpen] = useState(false);

  useEffect(() => {
    setDraftQuery(query);
  }, [query]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (sort !== DEFAULT_ADMIN_MEDIA_SORT) count += 1;
    if (format !== DEFAULT_ADMIN_MEDIA_FORMAT) count += 1;
    if (usage !== DEFAULT_ADMIN_MEDIA_USAGE) count += 1;
    return count;
  }, [format, sort, usage]);

  const updateParams = useCallback((input: {
    format?: AdminMediaFormatFilter;
    q?: string | null;
    sort?: AdminMediaSortOption;
    usage?: AdminMediaUsageFilter;
    view?: AdminMediaLibraryView;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (input.q !== undefined) {
      if (!input.q) {
        params.delete("q");
      } else {
        params.set("q", input.q);
      }
      params.delete("page");
    }

    if (input.sort !== undefined) {
      if (input.sort === DEFAULT_ADMIN_MEDIA_SORT) {
        params.delete("sort");
      } else {
        params.set("sort", input.sort);
      }
      params.delete("page");
    }

    if (input.format !== undefined) {
      if (input.format === DEFAULT_ADMIN_MEDIA_FORMAT) {
        params.delete("format");
      } else {
        params.set("format", input.format);
      }
      params.delete("page");
    }

    if (input.usage !== undefined) {
      if (input.usage === DEFAULT_ADMIN_MEDIA_USAGE) {
        params.delete("usage");
      } else {
        params.set("usage", input.usage);
      }
      params.delete("page");
    }

    if (input.view !== undefined) {
      if (input.view === DEFAULT_ADMIN_MEDIA_VIEW) {
        params.delete("view");
      } else {
        params.set("view", input.view);
      }
      params.delete("page");
      params.delete("assetId");
      params.delete("status");
      params.delete("error");
    }

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const normalizedDraftQuery = draftQuery.trim();
      const currentQuery = searchParams.get("q")?.trim() ?? "";

      if (normalizedDraftQuery === currentQuery) {
        return;
      }

      updateParams({ q: normalizedDraftQuery || null });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [draftQuery, searchParams, updateParams]);

  return (
    <>
      <AdminConfigDataTableToolbar
        search={draftQuery}
        onSearchChange={setDraftQuery}
        mobileSearchPlaceholder="Rechercher un média..."
        desktopSearchPlaceholder="Rechercher un média..."
        mobileControls={
          <AdminMediaMobileFiltersDrawer
            activeFiltersCount={activeFiltersCount}
            format={format}
            onOpenChange={setMobileFiltersOpen}
            onFormatChange={(value) => updateParams({ format: value })}
            onSortChange={(value) => updateParams({ sort: value })}
            onUsageChange={(value) => updateParams({ usage: value })}
            open={mobileFiltersOpen}
            sort={sort}
            usage={usage}
          />
        }
        mobileTrailing={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-surface-border/60 bg-surface-panel/60 p-1">
              {ADMIN_MEDIA_VIEW_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={
                    option.value === view
                      ? "h-8 rounded-full bg-background px-3 text-xs text-foreground shadow-sm"
                      : "h-8 rounded-full px-3 text-xs text-muted-foreground hover:text-foreground"
                  }
                  onClick={() => updateParams({ view: option.value })}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {view === "active" ? (
              <AdminMediaMobileUploadSheet
                open={mobileUploadOpen}
                onOpenChange={setMobileUploadOpen}
                searchState={{
                  ...(format !== DEFAULT_ADMIN_MEDIA_FORMAT ? { format } : {}),
                  ...(query ? { q: query } : {}),
                  ...(sort !== DEFAULT_ADMIN_MEDIA_SORT ? { sort } : {}),
                  ...(usage !== DEFAULT_ADMIN_MEDIA_USAGE ? { usage } : {}),
                  ...(view !== DEFAULT_ADMIN_MEDIA_VIEW ? { view } : {}),
                }}
              />
            ) : null}
          </div>
        }
        desktopFilters={
          <>
            <div className="flex items-center gap-1 rounded-full border border-surface-border/60 bg-surface-panel/60 p-1">
              {ADMIN_MEDIA_VIEW_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={
                    option.value === view
                      ? "h-8 rounded-full bg-background px-3 text-xs text-foreground shadow-sm"
                      : "h-8 rounded-full px-3 text-xs text-muted-foreground hover:text-foreground"
                  }
                  onClick={() => updateParams({ view: option.value })}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <AdminSelectFilterControl
              value={sort}
              onValueChange={(value) => updateParams({ sort: value })}
              options={ADMIN_MEDIA_SORT_OPTIONS}
              triggerClassName="h-8 w-36 text-xs text-foreground/65"
            />
            <AdminSelectFilterControl
              value={format}
              onValueChange={(value) => updateParams({ format: value })}
              options={ADMIN_MEDIA_FORMAT_OPTIONS}
              triggerClassName="h-8 w-32 text-xs text-foreground/65"
            />
            <AdminSelectFilterControl
              value={usage}
              onValueChange={(value) => updateParams({ usage: value })}
              options={ADMIN_MEDIA_USAGE_OPTIONS}
              triggerClassName="h-8 w-34 text-xs text-foreground/65"
            />
          </>
        }
        resultsCount={totalCount}
        resultsFullLabel={(count) => `${count} média${count > 1 ? "s" : ""}`}
        resultsShortLabel={(count) => `${count}`}
      />
    </>
  );
}
