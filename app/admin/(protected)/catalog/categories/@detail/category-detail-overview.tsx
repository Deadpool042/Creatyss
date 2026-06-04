import Link from "next/link";
import { TagIcon } from "lucide-react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { Button } from "@/components/ui/button";
import {
  ADMIN_CATEGORIES_NEW_PATH,
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
    <AdminPageShell
      scrollMode="area"
      title={OVERVIEW_TITLE}
      contentPreset="full-width"
      contentClassName="space-y-5"
      header={
        <div className="hidden px-4 pt-1 md:px-5 lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-3 lg:px-6 lg:pb-1">
          <div className="flex size-11 items-center justify-center rounded-[1.15rem] border border-white/70 bg-white/72 shadow-sm backdrop-blur-xl">
            <TagIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-[1.45rem] font-semibold tracking-tight text-foreground">
              {OVERVIEW_TITLE}
            </h1>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">{OVERVIEW_DESCRIPTION}</p>
          </div>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total", value: items.length, tone: "bg-white/72" },
          { label: "Publiées", value: activeCount, tone: "bg-emerald-50/85" },
          { label: "Mises en avant", value: featuredCount, tone: "bg-amber-50/85" },
          { label: "Produits reliés", value: totalProducts, tone: "bg-sky-50/85" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-[1.35rem] border border-surface-border/60 ${stat.tone} px-4 py-4 shadow-sm backdrop-blur-xl`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.8fr)]">
        <section className="rounded-[1.65rem] border border-surface-border/60 bg-white/68 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/80">
                Priorités
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                Catégories à fort impact
              </h2>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                Ouvrez directement les catégories qui concentrent le plus de produits ou de
                sous-catégories.
              </p>
            </div>
            <Button asChild size="sm" className="rounded-full">
              <Link href={ADMIN_CATEGORIES_NEW_PATH}>Nouvelle catégorie</Link>
            </Button>
          </div>

          {topCategories.length > 0 ? (
            <div className="mt-5 space-y-2">
              {topCategories.map((category) => (
                <Link
                  key={category.id}
                  href={getAdminCategoryDetailPath(category.slug)}
                  className="flex items-center justify-between gap-3 rounded-[1.1rem] border border-white/70 bg-white/74 px-4 py-3 transition-colors hover:bg-white"
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
            <div className="mt-5 rounded-[1.4rem] border border-dashed border-surface-border/70 bg-white/45 px-5 py-8 text-center">
              <p className="text-sm font-medium text-foreground">Aucune catégorie pour le moment</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Créez une première catégorie pour structurer le catalogue.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-[1.65rem] border border-surface-border/60 bg-white/54 p-5 shadow-sm backdrop-blur-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/80">
            Conseils
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            Pour démarrer vite
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Regroupez d'abord les catégories qui portent vraiment la navigation boutique.</p>
            <p>
              Mettez en avant seulement quelques catégories clés pour garder une hiérarchie nette.
            </p>
            <p>Ajoutez un visuel uniquement quand il aide à reconnaître plus vite la catégorie.</p>
          </div>
        </section>
      </div>
    </AdminPageShell>
  );
}
