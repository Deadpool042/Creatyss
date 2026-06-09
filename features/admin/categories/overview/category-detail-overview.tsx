import Link from "next/link";
import { TagIcon } from "lucide-react";

import { AdminOverviewHero } from "@/components/admin/layout/admin-overview-hero";
import {
  AdminSplitDetailOverviewEmptyState,
  AdminSplitDetailOverviewGrid,
} from "@/components/admin/layout/admin-split-detail-overview-content";
import {
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-section-card";
import { AdminSplitDetailOverviewShell } from "@/components/admin/layout/admin-split-detail-overview-shell";
import { Button } from "@/components/ui/button";
import {
  ADMIN_CATEGORIES_NEW_PATH,
  ADMIN_CATEGORIES_DETAIL_OVERVIEW_CONTENT_WIDTH,
  getAdminCategoryDetailPath,
  listAdminCategories,
} from "@/features/admin/categories";

const OVERVIEW_TITLE = "Catégories";
const OVERVIEW_DESCRIPTION =
  "Sélectionnez une catégorie pour la modifier, ou commencez par les zones qui structurent le plus le catalogue.";

function formatProductsLabel(count: number): string {
  return `${count} produit${count > 1 ? "s" : ""}`;
}

function formatChildrenLabel(count: number): string {
  return `${count} sous-catégorie${count > 1 ? "s" : ""}`;
}

export async function CategoryDetailOverview() {
  const { items } = await listAdminCategories({});

  const featuredCount = items.filter((category) => category.isFeatured).length;
  const activeCount = items.filter((category) => category.status === "active").length;
  const totalProducts = items.reduce((sum, category) => sum + category.productCount, 0);
  const topCategories = [...items]
    .sort(
      (left, right) =>
        right.productCount - left.productCount || right.childrenCount - left.childrenCount
    )
    .slice(0, 5);

  return (
    <AdminSplitDetailOverviewShell
      title={OVERVIEW_TITLE}
      contentWidth={ADMIN_CATEGORIES_DETAIL_OVERVIEW_CONTENT_WIDTH}
      hero={
        <AdminOverviewHero
          mobileHidden
          align="leading"
          eyebrow="Catalogue"
          icon={TagIcon}
          title={OVERVIEW_TITLE}
          description={OVERVIEW_DESCRIPTION}
          action={
            <Button asChild size="sm" className="rounded-full">
              <Link href={ADMIN_CATEGORIES_NEW_PATH}>Nouvelle catégorie</Link>
            </Button>
          }
          metrics={[
            {
              label: "Total",
              value: items.length,
              hint: "Catégories disponibles dans le catalogue.",
              toneClassName: "bg-surface-panel",
            },
            {
              label: "Publiées",
              value: activeCount,
              hint: "Catégories visibles côté boutique.",
              toneClassName: "bg-surface-panel-soft",
            },
            {
              label: "Mises en avant",
              value: featuredCount,
              hint: "Catégories clés pour la navigation.",
              toneClassName: "bg-surface-panel-soft",
            },
            {
              label: "Produits reliés",
              value: totalProducts,
              hint: "Volume total d’assignations produit.",
              toneClassName: "bg-surface-panel-soft",
            },
          ]}
        />
      }
    >
      <AdminSplitDetailOverviewGrid className="xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.8fr)]">
        <AdminSplitDetailSectionCard>
          <AdminSplitDetailSectionHeader
            eyebrow="Priorités"
            title="Catégories à fort impact"
            description="Ouvrez directement les catégories qui concentrent le plus de produits ou de sous-catégories."
            action={
              <Button asChild size="sm" className="rounded-full">
                <Link href={ADMIN_CATEGORIES_NEW_PATH}>Nouvelle catégorie</Link>
              </Button>
            }
          />

          {topCategories.length > 0 ? (
            <div className="mt-5 space-y-2">
              {topCategories.map((category) => (
                <Link
                  key={category.id}
                  href={getAdminCategoryDetailPath(category.slug)}
                  className="flex items-center justify-between gap-3 rounded-xl border border-surface-border-subtle bg-surface-panel-soft px-4 py-3 transition-colors hover:bg-surface-panel"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{category.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatProductsLabel(category.productCount)} ·{" "}
                      {formatChildrenLabel(category.childrenCount)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-surface/80 px-2 py-1 text-[10px] font-medium text-muted-foreground">
                    {category.status === "active"
                      ? "Publiée"
                      : category.status === "draft"
                        ? "Brouillon"
                        : category.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <AdminSplitDetailOverviewEmptyState
              title="Aucune catégorie pour le moment"
              description="Créez une première catégorie pour structurer le catalogue."
            />
          )}
        </AdminSplitDetailSectionCard>

        <AdminSplitDetailSectionCard tone="secondary">
          <AdminSplitDetailSectionHeader eyebrow="Conseils" title="Pour démarrer vite" />
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Regroupez d'abord les catégories qui portent vraiment la navigation boutique.</p>
            <p>
              Mettez en avant seulement quelques catégories clés pour garder une hiérarchie nette.
            </p>
            <p>Ajoutez un visuel uniquement quand il aide à reconnaître plus vite la catégorie.</p>
          </div>
        </AdminSplitDetailSectionCard>
      </AdminSplitDetailOverviewGrid>
    </AdminSplitDetailOverviewShell>
  );
}
