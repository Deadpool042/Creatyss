import type { ComponentType, JSX } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  FileImage,
  FolderTree,
  ImageIcon,
  Layers3,
  Package,
  ScanSearch,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ADMIN_CATEGORIES_LIST_PATH } from "@/features/admin/categories";
import { ADMIN_PRODUCTS_LIST_PATH } from "@/features/admin/products/navigation";
import type { CatalogOverviewStats } from "@/features/admin/catalog/types/catalog-overview.types";

type CatalogOverviewSectionsProps = {
  stats: CatalogOverviewStats;
};

type CatalogHeroMetric = {
  label: string;
  value: string;
  hint: string;
  accentClassName: string;
  icon: ComponentType<{ className?: string }>;
};

type CatalogQuickLink = {
  href: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

type CatalogReadinessItem = {
  title: string;
  detail: string;
  progressLabel: string;
  progressValue: number;
  toneClassName: string;
};

const quickLinks: ReadonlyArray<CatalogQuickLink> = [
  {
    href: ADMIN_PRODUCTS_LIST_PATH,
    title: "Produits",
    description: "Structurer les fiches, variantes, prix et publication du catalogue.",
    icon: Package,
  },
  {
    href: ADMIN_CATEGORIES_LIST_PATH,
    title: "Catégories",
    description:
      "Maintenir une navigation claire, des regroupements cohérents et une hiérarchie propre.",
    icon: FolderTree,
  },
  {
    href: "/admin/catalog/media",
    title: "Médias",
    description: "Consolider les visuels, couvertures, miniatures et ressources éditoriales.",
    icon: ImageIcon,
  },
];

function formatCount(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function buildHeroMetrics(stats: CatalogOverviewStats): ReadonlyArray<CatalogHeroMetric> {
  const publicationRatio =
    stats.products.total > 0 ? Math.round((stats.products.active / stats.products.total) * 100) : 0;
  const taxonomyCoverage =
    stats.products.total > 0
      ? Math.max(
          0,
          100 - Math.round((stats.alerts.productsWithoutCategories / stats.products.total) * 100)
        )
      : 100;

  return [
    {
      label: "Catalogue actif",
      value: `${formatCount(stats.products.active)} fiches`,
      hint: `${publicationRatio}% du catalogue est déjà publiable côté boutique.`,
      accentClassName: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
      icon: Package,
    },
    {
      label: "Taxonomie",
      value: `${formatCount(stats.categories.total)} catégories`,
      hint: `${taxonomyCoverage}% des produits ont déjà une catégorie rattachée.`,
      accentClassName: "bg-sky-500/12 text-sky-700 dark:text-sky-300",
      icon: FolderTree,
    },
    {
      label: "Couverture média",
      value: `${formatCount(stats.media.total)} assets`,
      hint: `${formatCount(stats.alerts.productsWithoutImages)} produit(s) restent sans image principale.`,
      accentClassName: "bg-amber-500/14 text-amber-700 dark:text-amber-300",
      icon: FileImage,
    },
    {
      label: "Lecture commerciale",
      value: "Mock",
      hint: "Rotation stock, best-sellers et conversion catalogue arriveront ici.",
      accentClassName: "bg-violet-500/12 text-violet-700 dark:text-violet-300",
      icon: TrendingUp,
    },
  ];
}

function buildReadinessItems(stats: CatalogOverviewStats): ReadonlyArray<CatalogReadinessItem> {
  const mediaCoverage =
    stats.products.total > 0
      ? Math.max(
          0,
          100 - Math.round((stats.alerts.productsWithoutImages / stats.products.total) * 100)
        )
      : 100;
  const categoryCoverage =
    stats.products.total > 0
      ? Math.max(
          0,
          100 - Math.round((stats.alerts.productsWithoutCategories / stats.products.total) * 100)
        )
      : 100;

  return [
    {
      title: "Qualité fiches produit",
      detail:
        "Identité, publication et contenu existent. Les derniers arbitrages UX se jouent côté édition.",
      progressLabel: `${Math.max(42, Math.min(92, mediaCoverage))}%`,
      progressValue: Math.max(42, Math.min(92, mediaCoverage)),
      toneClassName: "bg-emerald-500",
    },
    {
      title: "Structure catégories",
      detail: "La base est là. Il reste à mieux équilibrer couverture, hiérarchie et liens vides.",
      progressLabel: `${Math.max(38, Math.min(88, categoryCoverage))}%`,
      progressValue: Math.max(38, Math.min(88, categoryCoverage)),
      toneClassName: "bg-sky-500",
    },
    {
      title: "Signal business",
      detail:
        "Les vraies métriques catalogues sont encore en préparation. La lecture reste volontairement mockée.",
      progressLabel: "31%",
      progressValue: 31,
      toneClassName: "bg-violet-500",
    },
  ];
}

export function CatalogOverviewSections({ stats }: CatalogOverviewSectionsProps): JSX.Element {
  const hasAlerts =
    stats.alerts.productsWithoutImages > 0 ||
    stats.alerts.productsWithoutCategories > 0 ||
    stats.alerts.categoriesWithoutProducts > 0;
  const heroMetrics = buildHeroMetrics(stats);
  const readinessItems = buildReadinessItems(stats);

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.28fr)_minmax(20rem,0.72fr)]">
        <Card className="overflow-hidden rounded-3xl border-shell-border-strong bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface-panel)_90%,white)_0%,color-mix(in_srgb,var(--surface-panel)_70%,var(--shell-surface))_100%)] shadow-card">
          <CardHeader className="gap-4 pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-shell-border/70 bg-surface-subtle px-2.5 py-1 text-[10px] font-semibold tracking-[0.24em] text-text-muted-strong uppercase">
                Catalogue
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-foreground/6 px-2.5 py-1 text-[11px] text-text-muted-strong">
                <Sparkles className="h-3.5 w-3.5" />
                Vue pilotage
              </span>
            </div>

            <div className="space-y-3">
              <CardTitle className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-[2.35rem]">
                Une lecture catalogue claire avant même que tout le back-office soit branché.
              </CardTitle>
              <CardDescription className="max-w-2xl text-base leading-7 text-text-muted-strong">
                Cette vue mélange le socle réel du catalogue et quelques signaux mockés pour garder
                une lecture métier utile: couverture fiches, taxonomie, médias et zones de
                vigilance.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="grid gap-3 pt-5 md:grid-cols-2">
            {heroMetrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <div
                  key={metric.label}
                  className="rounded-xl border border-shell-border/70 bg-surface-panel/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold tracking-[0.24em] text-text-muted-strong uppercase">
                        {metric.label}
                      </p>
                      <p className="text-2xl font-semibold tracking-tight text-foreground">
                        {metric.value}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "inline-flex h-10 w-10 items-center justify-center rounded-2xl",
                        metric.accentClassName
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-text-muted-soft">{metric.hint}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-surface-panel/80 shadow-sm">
          <CardHeader className="gap-2 border-b border-surface-border-subtle/80 pb-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-text-muted-strong uppercase">
              <ScanSearch className="h-4 w-4" />
              Lecture rapide
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Priorités du catalogue
            </CardTitle>
            <CardDescription className="leading-6">
              Les quelques points qui empêchent aujourd’hui d’avoir un catalogue totalement net.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 pt-5">
            <div className="rounded-xl border border-surface-border-subtle bg-surface-panel/70 p-4">
              <p className="text-sm font-medium text-foreground">Couverture visuelle</p>
              <p className="mt-1 text-sm leading-6 text-text-muted-soft">
                {stats.alerts.productsWithoutImages > 0
                  ? `${formatCount(stats.alerts.productsWithoutImages)} fiche(s) restent sans image principale.`
                  : "Toutes les fiches actives disposent déjà d’une image principale."}
              </p>
            </div>

            <div className="rounded-xl border border-surface-border-subtle bg-surface-panel/70 p-4">
              <p className="text-sm font-medium text-foreground">Cohérence taxonomique</p>
              <p className="mt-1 text-sm leading-6 text-text-muted-soft">
                {stats.alerts.productsWithoutCategories > 0
                  ? `${formatCount(stats.alerts.productsWithoutCategories)} produit(s) restent à rattacher à une catégorie.`
                  : "La structure catégories couvre déjà l’ensemble des produits visibles."}
              </p>
            </div>

            <div className="rounded-xl border border-surface-border-subtle bg-surface-panel/70 p-4">
              <p className="text-sm font-medium text-foreground">Dette fonctionnelle assumée</p>
              <p className="mt-1 text-sm leading-6 text-text-muted-soft">
                Les signaux de performance catalogue restent partiellement mockés tant que les
                métriques business ne sont pas encore branchées.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {hasAlerts ? (
        <section>
          <Card className="rounded-2xl border-amber-500/20 bg-[linear-gradient(180deg,rgba(245,158,11,0.08)_0%,rgba(245,158,11,0.03)_100%)] shadow-none">
            <CardContent className="flex flex-wrap items-center gap-2 px-4 py-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/12 px-3 py-1.5 text-sm font-medium text-amber-800 dark:text-amber-200">
                <AlertTriangle className="h-4 w-4" />
                Points d’attention
              </span>

              {stats.alerts.productsWithoutImages > 0 ? (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
                >
                  {stats.alerts.productsWithoutImages} produit
                  {stats.alerts.productsWithoutImages > 1 ? "s" : ""} sans image
                </Badge>
              ) : null}

              {stats.alerts.productsWithoutCategories > 0 ? (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
                >
                  {stats.alerts.productsWithoutCategories} produit
                  {stats.alerts.productsWithoutCategories > 1 ? "s" : ""} sans catégorie
                </Badge>
              ) : null}

              {stats.alerts.categoriesWithoutProducts > 0 ? (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
                >
                  {stats.alerts.categoriesWithoutProducts} catégorie
                  {stats.alerts.categoriesWithoutProducts > 1 ? "s" : ""} vide
                  {stats.alerts.categoriesWithoutProducts > 1 ? "s" : ""}
                </Badge>
              ) : null}
            </CardContent>
          </Card>
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
        <Card className="rounded-2xl bg-surface-panel/80 shadow-sm">
          <CardHeader className="gap-2 border-b border-surface-border-subtle/80 pb-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-text-muted-strong uppercase">
              <Layers3 className="h-4 w-4" />
              Qualité structurelle
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Maturité du module catalogue
            </CardTitle>
            <CardDescription className="leading-6">
              Lecture synthétique de l’état des fiches, de la taxonomie et des signaux encore
              incomplets.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-5">
            {readinessItems.map((item) => (
              <div key={item.title} className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-base font-medium text-foreground">{item.title}</p>
                    <p className="text-sm leading-6 text-text-muted-soft">{item.detail}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-foreground">
                    {item.progressLabel}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-foreground/[0.07]">
                  <div
                    className={cn("h-full rounded-full", item.toneClassName)}
                    style={{ width: `${item.progressValue}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-surface-panel/80 shadow-sm">
          <CardHeader className="gap-2 border-b border-surface-border-subtle/80 pb-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-text-muted-strong uppercase">
              <TrendingUp className="h-4 w-4" />
              Signaux à venir
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Ce qui complétera cette vue
            </CardTitle>
            <CardDescription className="leading-6">
              Quelques repères mockés pour préparer le futur cockpit commerce sans brouiller la
              lecture actuelle.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 pt-5">
            <div className="rounded-xl border border-surface-border-subtle bg-surface-panel/70 p-4">
              <p className="text-sm font-medium text-foreground">Best-sellers et rotation</p>
              <p className="mt-1 text-sm leading-6 text-text-muted-soft">
                À terme, cette zone affichera les fiches qui performent vraiment et celles qui
                stagnent.
              </p>
            </div>

            <div className="rounded-xl border border-surface-border-subtle bg-surface-panel/70 p-4">
              <p className="text-sm font-medium text-foreground">Couverture média détaillée</p>
              <p className="mt-1 text-sm leading-6 text-text-muted-soft">
                Hero, miniatures, variantes et formats storefront seront suivis ici dès que la
                chaîne média sera totalement branchée.
              </p>
            </div>

            <div className="rounded-xl border border-surface-border-subtle bg-surface-panel/70 p-4">
              <p className="text-sm font-medium text-foreground">Hygiène éditoriale</p>
              <p className="mt-1 text-sm leading-6 text-text-muted-soft">
                Métadonnées SEO, accents éditoriaux et cohérence de publication rejoindront ensuite
                ce cockpit.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.24em] text-text-muted-strong uppercase">
              Accès rapides
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Les trois zones qui tiennent le catalogue
            </h2>
          </div>

          <span className="hidden rounded-full border border-shell-border/70 bg-surface-panel/80 px-3 py-1 text-xs text-text-muted-strong sm:inline-flex">
            Socle catalogue V1
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
              >
                <Card className="h-full rounded-2xl bg-surface-panel/80 transition duration-200 hover:-translate-y-0.5 hover:border-shell-border-strong hover:shadow-sm">
                  <CardHeader className="gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <CardTitle className="text-xl font-semibold tracking-tight">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="text-sm leading-6">
                          {item.description}
                        </CardDescription>
                      </div>

                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-foreground/6 text-foreground">
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-1">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground/76 transition group-hover:text-foreground">
                      Ouvrir le module
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
