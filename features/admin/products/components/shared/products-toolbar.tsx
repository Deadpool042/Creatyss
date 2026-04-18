import Link from "next/link";

import {
  buildProductsCreateHref,
  buildProductsFiltersHref,
  type ProductsPageParams,
} from "@/features/admin/products/navigation";
import type { JSX } from "react";

type ProductsToolbarProps = {
  params: ProductsPageParams;
};

function getStatusLabel(status: string): string {
  switch (status) {
    case "active":
      return "Actifs";
    case "inactive":
      return "Inactifs";
    case "draft":
      return "Brouillons";
    case "archived":
      return "Archivés";
    default:
      return "Tous";
  }
}

function getFeaturedLabel(featured: string): string {
  switch (featured) {
    case "featured":
    case "true":
    case "1":
      return "Mis en avant";
    case "standard":
    case "false":
    case "0":
      return "Standards";
    default:
      return "Tous";
  }
}

export function ProductsToolbar({ params }: ProductsToolbarProps): JSX.Element {
  const statusLinks = [
    {
      label: "Tous",
      href: buildProductsFiltersHref(params, { status: "" }),
      isActive: params.status === "",
    },
    {
      label: "Actifs",
      href: buildProductsFiltersHref(params, { status: "active" }),
      isActive: params.status === "active",
    },
    {
      label: "Inactifs",
      href: buildProductsFiltersHref(params, { status: "inactive" }),
      isActive: params.status === "inactive",
    },
    {
      label: "Brouillons",
      href: buildProductsFiltersHref(params, { status: "draft" }),
      isActive: params.status === "draft",
    },
    {
      label: "Archivés",
      href: buildProductsFiltersHref(params, { status: "archived" }),
      isActive: params.status === "archived",
    },
  ];

  const featuredLinks = [
    {
      label: "Tous",
      href: buildProductsFiltersHref(params, { featured: "" }),
      isActive: params.featured === "",
    },
    {
      label: "Mis en avant",
      href: buildProductsFiltersHref(params, { featured: "featured" }),
      isActive: params.featured === "featured",
    },
    {
      label: "Standards",
      href: buildProductsFiltersHref(params, { featured: "standard" }),
      isActive: params.featured === "standard",
    },
  ];

  const hasActiveFilters =
    params.search.length > 0 ||
    params.status.length > 0 ||
    params.featured.length > 0 ||
    params.category.length > 0;

  return (
    <div className="space-y-4 border-b p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Catalogue produit</h2>
          <p className="text-sm text-muted-foreground">
            Statut : {getStatusLabel(params.status)} · Visibilité :{" "}
            {getFeaturedLabel(params.featured)}
          </p>
        </div>

        <Link
          href={buildProductsCreateHref(params)}
          className="rounded-md border px-3 py-2 text-sm font-medium"
        >
          Nouveau
        </Link>
      </div>

      <form action="/admin/products" method="get" className="flex flex-col gap-3 lg:flex-row">
        <input type="hidden" name="mode" value="view" />
        <input type="hidden" name="status" value={params.status} />
        <input type="hidden" name="featured" value={params.featured} />
        <input type="hidden" name="category" value={params.category} />

        <div className="min-w-0 flex-1">
          <label htmlFor="products-search" className="sr-only">
            Rechercher un produit
          </label>
          <input
            id="products-search"
            name="q"
            defaultValue={params.search}
            placeholder="Rechercher par nom, slug ou description courte"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <button type="submit" className="rounded-md border px-3 py-2 text-sm font-medium">
            Rechercher
          </button>

          {hasActiveFilters ? (
            <Link
              href="/admin/products"
              className="rounded-md border px-3 py-2 text-sm text-muted-foreground"
            >
              Réinitialiser
            </Link>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Statut</span>

          {statusLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={
                link.isActive
                  ? "rounded-full border bg-muted px-3 py-1 text-xs font-medium"
                  : "rounded-full border px-3 py-1 text-xs text-muted-foreground"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Visibilité</span>

          {featuredLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={
                link.isActive
                  ? "rounded-full border bg-muted px-3 py-1 text-xs font-medium"
                  : "rounded-full border px-3 py-1 text-xs text-muted-foreground"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
