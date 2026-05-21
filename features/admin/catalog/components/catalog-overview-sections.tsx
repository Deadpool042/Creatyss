import type { JSX } from "react";
import Link from "next/link";
import { AlertTriangle, FolderTree, ImageIcon, Package } from "lucide-react";

import { StatsCard } from "@/components/shared/display";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CatalogOverviewStats } from "@/features/admin/catalog/types/catalog-overview.types";

type CatalogOverviewSectionsProps = {
  stats: CatalogOverviewStats;
};

export function CatalogOverviewSections({ stats }: CatalogOverviewSectionsProps): JSX.Element {
  const hasAlerts =
    stats.alerts.productsWithoutImages > 0 ||
    stats.alerts.productsWithoutCategories > 0 ||
    stats.alerts.categoriesWithoutProducts > 0;

  return (
    <>
      {/* KPI Cards */}
      <section className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Produits"
          value={stats.products.total}
          description={`${stats.products.active} actifs · ${stats.products.draft} brouillons · ${stats.products.archived} archivés`}
          icon={Package}
        />
        <StatsCard
          title="Catégories"
          value={stats.categories.total}
          description={`${stats.categories.active} actives · ${stats.categories.draft} brouillons · ${stats.categories.archived} archivées`}
          icon={FolderTree}
        />
        <StatsCard
          title="Médias"
          value={stats.media.total}
          description={`${stats.media.archived} archivés`}
          icon={ImageIcon}
        />
      </section>

      {/* Alerts */}
      {hasAlerts && (
        <section>
          <div className="flex flex-wrap items-center gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-900/50 dark:bg-amber-950/20">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Points d&apos;attention :
            </span>
            {stats.alerts.productsWithoutImages > 0 && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                {stats.alerts.productsWithoutImages} produit{stats.alerts.productsWithoutImages > 1 ? "s" : ""} sans image
              </Badge>
            )}
            {stats.alerts.productsWithoutCategories > 0 && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                {stats.alerts.productsWithoutCategories} produit{stats.alerts.productsWithoutCategories > 1 ? "s" : ""} sans catégorie
              </Badge>
            )}
            {stats.alerts.categoriesWithoutProducts > 0 && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                {stats.alerts.categoriesWithoutProducts} catégorie{stats.alerts.categoriesWithoutProducts > 1 ? "s" : ""} vide{stats.alerts.categoriesWithoutProducts > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </section>
      )}

      {/* Quick Access */}
      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/products" className="block">
          <Card className="h-full transition hover:border-foreground/20 hover:shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div className="space-y-1.5">
                <CardTitle className="text-lg">Produits</CardTitle>
                <CardDescription className="text-sm leading-6">
                  Gérer les fiches produits, les variantes et la tarification.
                </CardDescription>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted">
                <Package className="h-5 w-5 text-foreground" />
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/catalog/categories" className="block">
          <Card className="h-full transition hover:border-foreground/20 hover:shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div className="space-y-1.5">
                <CardTitle className="text-lg">Catégories</CardTitle>
                <CardDescription className="text-sm leading-6">
                  Organiser les produits dans une structure claire et maintenable.
                </CardDescription>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted">
                <FolderTree className="h-5 w-5 text-foreground" />
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/media" className="block">
          <Card className="h-full transition hover:border-foreground/20 hover:shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
              <div className="space-y-1.5">
                <CardTitle className="text-lg">Médias</CardTitle>
                <CardDescription className="text-sm leading-6">
                  Centraliser les visuels produits et les contenus de la boutique.
                </CardDescription>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted">
                <ImageIcon className="h-5 w-5 text-foreground" />
              </div>
            </CardHeader>
          </Card>
        </Link>
      </section>
    </>
  );
}
