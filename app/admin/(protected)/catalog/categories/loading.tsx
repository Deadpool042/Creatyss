import type React from "react";

import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { CategorieCreateTopbarMenu } from "@/features/admin/categories/components/create/categorie-create-topbar-menu";
import {
  CATEGORY_LIST_PAGE_COPY,
  CATEGORY_NAVIGATION_COPY,
} from "@/features/admin/categories/config";
import { ADMIN_CATEGORIES_LIST_PATH } from "@/features/admin/categories/shared/admin-categories-routes";

// ---------------------------------------------------------------------------
// Skeleton primitives
// ---------------------------------------------------------------------------

function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div style={style} className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />;
}

// ---------------------------------------------------------------------------
// Toolbar skeleton
// ---------------------------------------------------------------------------

function ToolbarSkeleton() {
  return (
    <div className="flex flex-col gap-2 mt-2">
      {/* Row 1 — search + sort button (mobile) / search + tabs + controls (desktop) */}
      <div className="flex items-center gap-2">
        {/* Search input */}
        <Skeleton className="h-8 w-full max-w-sm flex-1" />
        {/* Sort dropdown (mobile only) */}
        <Skeleton className="h-8 w-8 shrink-0 lg:hidden" />
      </div>

      {/* Status tabs row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-7 rounded-full"
            style={{ width: `${[40, 72, 80, 68, 72][i]}px` }}
          />
        ))}
      </div>

      {/* Featured filter row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Skeleton className="h-7 w-10 rounded-full" />
        <Skeleton className="h-7 w-28 rounded-full" />
        <Skeleton className="h-7 w-32 rounded-full" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table skeleton (desktop)
// ---------------------------------------------------------------------------

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-surface-border px-4 py-3">
      {/* Checkbox */}
      <Skeleton className="h-4 w-4 shrink-0" />
      {/* Image */}
      <Skeleton className="h-10 w-10 shrink-0 rounded" />
      {/* Name + slug */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      {/* Status badge */}
      <Skeleton className="h-6 w-16 rounded-full" />
      {/* Featured */}
      <Skeleton className="h-4 w-4" />
      {/* Products count */}
      <Skeleton className="h-4 w-8" />
      {/* Updated */}
      <Skeleton className="h-4 w-20" />
      {/* Actions */}
      <Skeleton className="h-7 w-7 rounded" />
    </div>
  );
}

function TableSkeletonDesktop() {
  return (
    <div className="hidden min-h-0 flex-1 flex-col gap-3 overflow-hidden lg:flex">
      <ToolbarSkeleton />

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-surface-border">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-surface-border bg-muted/40 px-4 py-2.5">
          <Skeleton className="h-4 w-4 shrink-0" />
          <Skeleton className="h-3.5 w-16 flex-1" />
          <Skeleton className="h-3.5 w-14" />
          <Skeleton className="h-3.5 w-10" />
          <Skeleton className="h-3.5 w-12" />
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-3.5 w-6" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <TableRowSkeleton key={i} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cards skeleton (mobile)
// ---------------------------------------------------------------------------

function CardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-surface-border p-3">
      <Skeleton className="h-12 w-12 shrink-0 rounded-md" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-8 w-8 shrink-0 rounded" />
    </div>
  );
}

function TableSkeletonMobile() {
  return (
    <div className="flex min-h-0 flex-1 flex-col lg:hidden">
      <ToolbarSkeleton />
      <div className="mt-2 flex flex-col gap-2 pb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page export
// ---------------------------------------------------------------------------

export default function AdminCategoriesLoading() {
  return (
    <AdminPageShell
      headerVisibility="desktop"
      headerDensity="compact"
      eyebrow={CATEGORY_LIST_PAGE_COPY.eyebrow}
      title={CATEGORY_LIST_PAGE_COPY.title}
      description={CATEGORY_LIST_PAGE_COPY.description}
      scrollMode="nested"
      topbarAction={<CategorieCreateTopbarMenu />}
      navigation={{ label: CATEGORY_NAVIGATION_COPY.homeLabel, href: "/admin" }}
      breadcrumbs={[
        { label: CATEGORY_NAVIGATION_COPY.homeLabel, href: "/admin" },
        { label: CATEGORY_NAVIGATION_COPY.categoriesLabel, href: ADMIN_CATEGORIES_LIST_PATH },
      ]}
      viewportClassName="!h-full"
      contentClassName="min-h-0 flex-1 overflow-hidden px-3 pt-14 pb-4 [@media(max-height:480px)]:px-2.5 [@media(max-height:480px)]:pt-12 lg:px-6 lg:pb-6 lg:pt-0"
    >
      <TableSkeletonDesktop />
      <TableSkeletonMobile />
    </AdminPageShell>
  );
}
