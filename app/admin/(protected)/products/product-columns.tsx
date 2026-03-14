"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminProductSummary } from "@/db/repositories/admin-product.repository";
import { getAdminProductPresentation } from "@/entities/product/product-admin-presentation";
import { getProductPublishability } from "@/entities/product/product-publishability";
import { ProductRowActions } from "./product-row-actions";

const productDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium"
});

function getProductStatusLabel(status: AdminProductSummary["status"]) {
  return status === "published" ? "Publié" : "Brouillon";
}

function getProductStatusBadgeVariant(status: AdminProductSummary["status"]) {
  return status === "published" ? ("secondary" as const) : ("outline" as const);
}

function SortableHeader<TData>({
  column,
  title
}: {
  column: Column<TData, unknown>;
  title: string;
}) {
  const direction = column.getIsSorted();

  return (
    <Button
      className="-ml-2 h-8 px-2 text-left font-semibold text-foreground hover:bg-muted/60"
      size="sm"
      variant="ghost"
      onClick={() => column.toggleSorting(direction === "asc")}>
      {title}
      {direction === "asc" ? (
        <ArrowUpIcon className="size-3.5" />
      ) : direction === "desc" ? (
        <ArrowDownIcon className="size-3.5" />
      ) : (
        <ArrowUpDownIcon className="size-3.5 text-muted-foreground" />
      )}
    </Button>
  );
}

export const productColumns: ColumnDef<AdminProductSummary>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Produit"
      />
    ),
    filterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue ?? "")
        .trim()
        .toLowerCase();

      if (!query) {
        return true;
      }

      const { name, slug } = row.original;

      return `${name} ${slug}`.toLowerCase().includes(query);
    },
    cell: ({ row }) => {
      const product = row.original;

      return (
        <article className="admin-product-card grid min-w-[16rem] gap-1.5 py-1">
          <h3 className="text-sm font-semibold text-foreground">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product.slug}</p>
          {product.shortDescription ? (
            <p className="line-clamp-2 text-sm text-foreground/80">
              {product.shortDescription}
            </p>
          ) : null}
          <Link
            className="inline-flex w-fit items-center text-sm font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
            href={`/admin/products/${product.id}`}>
            Modifier le produit
          </Link>
        </article>
      );
    }
  },
  {
    id: "status",
    accessorFn: product => getProductStatusLabel(product.status),
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Statut"
      />
    ),
    cell: ({ row }) => {
      const product = row.original;
      const publishability =
        product.status === "draft"
          ? getProductPublishability(product.productType, product.variantCount)
          : null;

      return (
        <div className="grid gap-1">
          <Badge variant={getProductStatusBadgeVariant(product.status)}>
            {getProductStatusLabel(product.status)}
          </Badge>
          {publishability !== null && !publishability.ok ? (
            <span className="text-xs text-destructive">Non publiable</span>
          ) : null}
        </div>
      );
    }
  },
  {
    id: "type",
    accessorFn: product =>
      getAdminProductPresentation(product.productType, product.variantCount)
        .typeLabel,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Type"
      />
    ),
    cell: ({ row }) => {
      const presentation = getAdminProductPresentation(
        row.original.productType,
        row.original.variantCount
      );

      return (
        <span className="text-sm text-foreground">
          {presentation.typeLabel}
        </span>
      );
    }
  },
  {
    id: "featured",
    accessorFn: product => (product.isFeatured ? 1 : 0),
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Mise en avant"
      />
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.isFeatured ? "secondary" : "outline"}>
        {row.original.isFeatured ? "Mis en avant" : "Standard"}
      </Badge>
    )
  },
  {
    id: "categoryCount",
    accessorFn: product => product.categoryCount,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Catégories"
      />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.categoryCount} catégorie
        {row.original.categoryCount > 1 ? "s" : ""}
      </span>
    )
  },
  {
    id: "sales",
    accessorFn: product => product.variantCount,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Vente"
      />
    ),
    cell: ({ row }) => {
      const presentation = getAdminProductPresentation(
        row.original.productType,
        row.original.variantCount
      );

      return (
        <span className="text-sm text-muted-foreground">
          {presentation.sellableCountLabel}
        </span>
      );
    }
  },
  {
    id: "updatedAt",
    accessorFn: product => new Date(product.updatedAt),
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Mis à jour"
      />
    ),
    sortingFn: "datetime",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {productDateFormatter.format(new Date(row.original.updatedAt))}
      </span>
    )
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => <ProductRowActions product={row.original} />,
  }
];
