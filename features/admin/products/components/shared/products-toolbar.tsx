import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  buildProductsCreateHref,
  buildProductsFiltersHref,
  type ProductsPageParams,
} from "@/features/admin/products/navigation";
import { cn } from "@/lib/utils";
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
    <div className="space-y-4 border-b border-shell-border p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Catalogue produit</h2>
          <p className="text-sm text-text-muted-strong">
            Statut : {getStatusLabel(params.status)} · Visibilité :{" "}
            {getFeaturedLabel(params.featured)}
          </p>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href={buildProductsCreateHref(params)}>Nouveau</Link>
        </Button>
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
          <Input
            id="products-search"
            name="q"
            defaultValue={params.search}
            placeholder="Rechercher par nom, slug ou description courte"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" variant="outline" size="sm">
            Rechercher
          </Button>

          {hasActiveFilters ? (
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/products">Réinitialiser</Link>
            </Button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-text-muted-strong">Statut</span>

          {statusLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                link.isActive
                  ? "border-control-border-strong bg-control-surface-selected text-foreground"
                  : "border-control-border bg-control-surface text-text-muted-strong hover:border-control-border-strong hover:bg-control-surface-hover hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-text-muted-strong">Visibilité</span>

          {featuredLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                link.isActive
                  ? "border-control-border-strong bg-control-surface-selected text-foreground"
                  : "border-control-border bg-control-surface text-text-muted-strong hover:border-control-border-strong hover:bg-control-surface-hover hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
