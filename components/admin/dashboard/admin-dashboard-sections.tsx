import type { ComponentType, JSX } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  FolderTree,
  Globe,
  ImageIcon,
  Package,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ADMIN_CATEGORIES_LIST_PATH } from "@/features/admin/categories";
import { ADMIN_ORDERS_LIST_PATH } from "@/features/admin/commerce/orders/shared/admin-orders-routes";
import { ADMIN_PRODUCTS_LIST_PATH } from "@/features/admin/products/navigation";
import type { AdminDashboardStats } from "@/features/admin/dashboard";

type AdminQuickLink = {
  href: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

type AdminPulseMetric = {
  label: string;
  value: string;
  hint: string;
  chartVar: string;
  icon: ComponentType<{ className?: string }>;
};

type AdminReadinessTrack = {
  title: string;
  detail: string;
  progressLabel: string;
  progressWidthClassName: string;
  toneClassName: string;
};

type AdminPriority = {
  title: string;
  detail: string;
  state: string;
  tone: "info" | "warning" | "neutral";
};

const quickLinks: AdminQuickLink[] = [
  {
    href: ADMIN_PRODUCTS_LIST_PATH,
    title: "Produits",
    description: "Gérer le catalogue, les fiches produits et la base du merchandising.",
    icon: Package,
  },
  {
    href: ADMIN_CATEGORIES_LIST_PATH,
    title: "Catégories",
    description: "Organiser les produits dans une structure claire et maintenable.",
    icon: FolderTree,
  },
  {
    href: ADMIN_ORDERS_LIST_PATH,
    title: "Commandes",
    description: "Suivre la vente, la préparation et les points de friction.",
    icon: ShoppingBag,
  },
  {
    href: "/admin/catalog/media",
    title: "Médias",
    description: "Centraliser les visuels, couvertures et assets de la boutique.",
    icon: ImageIcon,
  },
  {
    href: "/admin/content/homepage",
    title: "Page d’accueil",
    description: "Piloter les mises en avant, messages saisonniers et blocs éditoriaux.",
    icon: Globe,
  },
  {
    href: "/admin/content/blog",
    title: "Blog",
    description: "Préparer les articles, l’acquisition organique et le calendrier éditorial.",
    icon: FileText,
  },
];

function formatCount(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function buildPulseMetrics(stats: AdminDashboardStats): ReadonlyArray<AdminPulseMetric> {
  return [
    {
      label: "Catalogue vivant",
      value: `${formatCount(stats.productsCount)} fiches`,
      hint: "Base réelle du catalogue disponible côté admin.",
      chartVar: "--chart-1",
      icon: Package,
    },
    {
      label: "Pipeline commerce",
      value: `${formatCount(stats.ordersCount)} commande${stats.ordersCount > 1 ? "s" : ""}`,
      hint: "Commandes enregistrées et accessibles pour le suivi de votre activité.",
      chartVar: "--chart-2",
      icon: ShoppingBag,
    },
    {
      label: "Contenu éditorial",
      value: `${formatCount(stats.blogPostsCount)} article${stats.blogPostsCount > 1 ? "s" : ""}`,
      hint: "Articles et pages disponibles dans votre espace éditorial.",
      chartVar: "--chart-3",
      icon: FileText,
    },
    {
      label: "Lecture business",
      value: "—",
      hint: "Indicateurs de performance commerciale, disponibles à l'activation des modules analytics.",
      chartVar: "--chart-4",
      icon: TrendingUp,
    },
  ];
}

function buildReadinessTracks(stats: AdminDashboardStats): ReadonlyArray<AdminReadinessTrack> {
  const productMomentum = stats.productsCount > 0 ? "78%" : "34%";
  const contentMomentum = stats.blogPostsCount > 0 ? "56%" : "18%";
  const commerceMomentum = stats.ordersCount > 0 ? "49%" : "37%";

  return [
    {
      title: "Catalogue",
      detail: "Produits, catégories, médias et structure d’édition déjà utilisables.",
      progressLabel: productMomentum,
      progressWidthClassName: stats.productsCount > 0 ? "w-[78%]" : "w-[34%]",
      toneClassName: "bg-[var(--chart-1)]",
    },
    {
      title: "Commerce",
      detail:
        "Commandes présentes. Les vues de pilotage et les automatismes restent à approfondir.",
      progressLabel: commerceMomentum,
      progressWidthClassName: stats.ordersCount > 0 ? "w-[49%]" : "w-[37%]",
      toneClassName: "bg-[var(--chart-2)]",
    },
    {
      title: "Contenu",
      detail:
        "Homepage et blog sont disponibles. L’outillage éditorial sera enrichi progressivement.",
      progressLabel: contentMomentum,
      progressWidthClassName: stats.blogPostsCount > 0 ? "w-[56%]" : "w-[18%]",
      toneClassName: "bg-[var(--chart-3)]",
    },
  ];
}

function buildPriorities(stats: AdminDashboardStats): ReadonlyArray<AdminPriority> {
  return [
    {
      title: "Finaliser le flux catalogue",
      detail:
        stats.productsCount > 0
          ? "Le coeur produit est visible. Il faut stabiliser variantes, édition fine et QA mobile."
          : "Les écrans sont prêts à accueillir le vrai flux catalogue dès les premières fiches.",
      state: "En cours",
      tone: "info",
    },
    {
      title: "Rendre le commerce lisible",
      detail:
        stats.ordersCount > 0
          ? "Il y a déjà des commandes à lire, mais le cockpit de suivi reste à densifier."
          : "Le module commandes doit encore être outillé avant un pilotage quotidien complet.",
      state: "À structurer",
      tone: "warning",
    },
    {
      title: "Brancher le contenu storefront",
      detail:
        stats.blogPostsCount > 0
          ? "Le blog est actif. Homepage, mises en avant et calendrier éditorial sont les prochaines étapes."
          : "L'espace éditorial est prêt à accueillir vos premiers contenus.",
      state: "En préparation",
      tone: "neutral",
    },
  ];
}

const PRIORITY_BADGE_CLASSNAMES: Record<AdminPriority["tone"], string> = {
  info: "bg-feedback-info-surface text-feedback-info-foreground",
  warning: "bg-feedback-warning-surface text-feedback-warning-foreground",
  neutral: "bg-surface-subtle text-text-muted-strong",
};

export function AdminDashboardSections({ stats }: { stats: AdminDashboardStats }): JSX.Element {
  const pulseMetrics = buildPulseMetrics(stats);
  const readinessTracks = buildReadinessTracks(stats);
  const priorities = buildPriorities(stats);

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
        <Card className="overflow-hidden rounded-3xl border-shell-border-strong bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface-panel)_90%,white)_0%,color-mix(in_srgb,var(--surface-panel)_70%,var(--shell-surface))_100%)] shadow-card">
          <CardHeader className="gap-4 pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-shell-border/70 bg-surface-subtle px-2.5 py-1 text-[10px] font-semibold tracking-[0.24em] text-text-muted-strong uppercase">
                Tableau de bord
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-foreground/6 px-2.5 py-1 text-[11px] text-text-muted-strong">
                <Sparkles className="h-3.5 w-3.5" />
                Vue pilotage
              </span>
            </div>

            <div className="space-y-3">
              <CardTitle className="max-w-3xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-[2.4rem]">
                Un cockpit sobre pour piloter le catalogue, le contenu et le commerce.
              </CardTitle>
              <CardDescription className="max-w-2xl text-base leading-7 text-text-muted-strong">
                Les indicateurs du catalogue et du commerce reflètent vos données réelles. D'autres
                métriques s'enrichiront à mesure que les modules seront activés.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-5">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {pulseMetrics.map((metric) => {
                const Icon = metric.icon;

                return (
                  <div key={metric.label} className="flex items-start gap-3">
                    <span
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor: `color-mix(in srgb, var(${metric.chartVar}) 16%, transparent)`,
                        color: `var(${metric.chartVar})`,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 space-y-1">
                      <p className="text-xs font-semibold tracking-[0.2em] text-text-muted-strong uppercase">
                        {metric.label}
                      </p>
                      <p className="text-xl font-semibold tracking-tight text-foreground">
                        {metric.value}
                      </p>
                      <p className="text-sm leading-6 text-text-muted-soft">{metric.hint}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-surface-panel/80 shadow-sm">
          <CardHeader className="gap-2 border-b border-surface-border-subtle/80 pb-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-text-muted-strong uppercase">
              <Activity className="h-4 w-4" />
              Aujourd’hui
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
              Priorités immédiates
            </CardTitle>
            <CardDescription className="leading-6">
              Repères de pilotage pour avancer au quotidien sur votre boutique.
            </CardDescription>
          </CardHeader>

          <CardContent className="divide-y divide-surface-border-subtle pt-1">
            {priorities.map((priority) => (
              <div key={priority.title} className="flex items-start justify-between gap-3 py-4">
                <div className="min-w-0 space-y-1.5">
                  <p className="text-base font-medium text-foreground">{priority.title}</p>
                  <p className="text-sm leading-6 text-text-muted-soft">{priority.detail}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
                    PRIORITY_BADGE_CLASSNAMES[priority.tone]
                  )}
                >
                  {priority.state}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
        <Card className="rounded-2xl bg-surface-panel/80 shadow-sm">
          <CardHeader className="gap-2 border-b border-surface-border-subtle/80 pb-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-text-muted-strong uppercase">
              <TrendingUp className="h-4 w-4" />
              Readiness
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
              État d’avancement des chantiers
            </CardTitle>
            <CardDescription className="leading-6">
              Avancement des zones principales de votre administration. Les indicateurs évolueront à
              mesure que les modules seront activés.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-5">
            {readinessTracks.map((track) => (
              <div key={track.title} className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-base font-medium text-foreground">{track.title}</p>
                    <p className="text-sm leading-6 text-text-muted-soft">{track.detail}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-foreground">
                    {track.progressLabel}
                  </span>
                </div>

                <div className="h-2 rounded-full bg-foreground/10">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      track.progressWidthClassName,
                      track.toneClassName
                    )}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl bg-surface-panel/80 shadow-sm">
          <CardHeader className="gap-2 border-b border-surface-border-subtle/80 pb-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-text-muted-strong uppercase">
              <AlertTriangle className="h-4 w-4" />
              Vigilance
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
              Ce qui mérite votre attention
            </CardTitle>
            <CardDescription className="leading-6">
              Points d’attention pour avancer sereinement sur chaque module de votre boutique.
            </CardDescription>
          </CardHeader>

          <CardContent className="divide-y divide-surface-border-subtle pt-1">
            <div className="flex items-start gap-3 border-l-2 border-feedback-warning-foreground/50 py-4 pl-3">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-feedback-warning-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Indicateurs de performance</p>
                <p className="text-sm leading-6 text-text-muted-soft">
                  Conversion, panier moyen et trafic seront disponibles une fois les modules
                  analytics activés.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-l-2 border-feedback-success-foreground/50 py-4 pl-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-feedback-success-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Base admin stable</p>
                <p className="text-sm leading-6 text-text-muted-soft">
                  Authentification, shell responsive et workflow catalogue ont désormais une base
                  cohérente.
                </p>
              </div>
            </div>

            <div className="py-4">
              <p className="text-xs font-semibold tracking-[0.24em] text-text-muted-strong uppercase">
                Prochain palier recommandé
              </p>
              <p className="mt-2 text-sm leading-6 text-text-muted-soft">
                Approfondir le suivi des commandes, enrichir les contenus storefront et activer les
                indicateurs de performance commerciale.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.24em] text-text-muted-strong uppercase">
              Accès rapides
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Les zones qui font avancer la boutique
            </h2>
          </div>

          <span className="hidden rounded-full border border-shell-border/70 bg-surface-panel/80 px-3 py-1 text-xs text-text-muted-strong sm:inline-flex sm:w-fit">
            Modules activables progressivement
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
