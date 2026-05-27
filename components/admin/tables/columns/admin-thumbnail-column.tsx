"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { AdminThumbnail } from "@/components/admin/media/admin-thumbnail";
import { buildAdminColumnMeta } from "./admin-column-meta";

type AdminThumbnailColumnOptions<TData> = Readonly<{
  src: (row: TData) => string | null;
  alt: (row: TData) => string;
  fallbackLabel?: (row: TData) => string;
  id?: string;
  header?: string;
  headerClassName?: string;
  cellClassName?: string;
  thumbnailClassName?: string;
  imageClassName?: string;
  stopRowClick?: boolean;
}>;

export function createAdminThumbnailColumn<TData>({
  src,
  alt,
  fallbackLabel,
  id = "image",
  header = "",
  headerClassName,
  cellClassName,
  thumbnailClassName = "h-9 w-9 rounded-md border border-surface-border/40 bg-surface-subtle/50",
  imageClassName = "transition-transform duration-300 group-hover:scale-105",
  stopRowClick = false,
}: AdminThumbnailColumnOptions<TData>): ColumnDef<TData> {
  return {
    id,
    header,
    cell: ({ row }) => (
      <AdminThumbnail
        src={src(row.original)}
        alt={alt(row.original)}
        className={thumbnailClassName}
        imageClassName={imageClassName}
        {...(fallbackLabel ? { fallbackLabel: fallbackLabel(row.original) } : {})}
      />
    ),
    meta: buildAdminColumnMeta({ headerClassName, cellClassName, stopRowClick }),
  };
}
