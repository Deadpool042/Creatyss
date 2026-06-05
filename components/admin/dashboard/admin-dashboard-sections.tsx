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
  accentClassName: string;
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
    href: "/admin/orders",
    title: "Commandes",
    description: "Suivre la vente, la préparation et les points de friction.",
    icon: ShoppingBag,
  },
  {
    href: "/admin/media",
    title: "Médias",
    description: "Centraliser les visuels, couvertures et assets de la boutique.",
    icon: ImageIcon,
  },
  {
    href: "/admin/homepage",
    title: "Page d’accueil",
    description: "Piloter les mises en avant, messages saisonniers et blocs éditoriaux.",
    icon: Globe,
  },
  {
    href: "/admin/blog",
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
      accentClassName: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
      icon: Package,
    },
    {
      label: "Pipeline commerce",
      value: `${formatCount(stats.ordersCount)} commande${stats.ordersCount > 1 ? "s" : ""}`,
      hint: "La brique commandes existe, le cockpit reste à enrichir.",
      accentClassName: "bg-sky-500/12 text-sky-700 dark:text-sky-300",
      icon: ShoppingBag,
    },
    {
      label: "Contenu éditorial",
      value: `${formatCount(stats.blogPostsCount)} article${stats.blogPostsCount > 1 ? "s" : ""}`,
      hint: "Le socle contenu est là, l’interface publication reste à finir.",
      accentClassName: "bg-amber-500/14 text-amber-700 dark:text-amber-300",
      icon: FileText,
    },
    {
      label: "Lecture business",
      value: "En construction",
      hint: "Simulation : reporting ventes, conversion et trafic arriveront ici.",
      accentClassName: "bg-violet-500/12 text-violet-700 dark:text-violet-300",
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
      toneClassName: "bg-emerald-500",
    },
    {
      title: "Commerce",
      detail: "Commandes présentes. Les vues de pilotage et les automatismes restent à approfondir.",
      progressLabel: commerceMomentum,
      progressWidthClassName: stats.ordersCount > 0 ? "w-[49%]" : "w-[37%]",
      toneClassName: "bg-sky-500",
    },
    {
      title: "Contenu",
      detail: "Homepage et blog ont leur place. L’outillage éditorial reste partiellement mocké.",
      progressLabel: contentMomentum,
      progressWidthClassName: stats.blogPostsCount > 0 ? "w-[56%]" : "w-[18%]",
      toneClassName: "bg-amber-500",
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
    },
    {
      title: "Rendre le commerce lisible",
      detail:
        stats.ordersCount > 0
          ? "Il y a déjà des commandes à lire, mais le cockpit de suivi reste à densifier."
          : "Le module commandes doit encore être outillé avant un pilotage quotidien complet.",
      state: "À structurer",
    },
    {
      title: "Brancher le contenu storefront",
      detail:
        stats.blogPostsCount > 0
          ? "Le blog existe déjà. Homepage, mises en avant et calendrier éditorial doivent suivre."
          : "Le socle éditorial existe mais reste encore largement en mode préparation.",
      state: "Partiellement mocké",
    },
  ];
}

export function AdminDashboardSections({ stats }: { stats: AdminDashboardStats }): JSX.Element {
  const pulseMetrics = buildPulseMetrics(stats);
  const readinessTracks = buildReadinessTracks(stats);
  const priorities = buildPriorities(stats);

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
        <Card className="overflow-hidden rounded-3xl border-shell-border-strong bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface-panel)_90%,white)_0%,color-mix(in_srgb,var(--surface-panel)_70%,var(--shell-surface))_100%)] shadow-card">
          <CardHeader className="gap-4 pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-shell-border/70 bg-surface-subtle px-2.5 py-1 text-[10px] font-semibold tracking-[0.24em] text-text-muted-strong uppercase">
                Tableau de bord
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-foreground/[0.06] px-2.5 py-1 text-[11px] text-text-muted-strong">
                <Sparkles className="h-3.5 w-3.5" />
                Vue pilotage
              </span>
            </div>

            <div className="space-y-3">
              <CardTitle className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-[2.4rem]">
                Un cockpit sobre pour piloter le catalogue, le contenu et le commerce.
              </CardTitle>
              <CardDescription className="max-w-2xl text-base leading-7 text-text-muted-strong">
                Certaines briques restent en construction. Cette vue assume donc un mélange de
                signaux réels et de repères mockés pour garder un cap lisible sans attendre que
                tout le back-office soit terminé.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="grid gap-3 pt-5 md:grid-cols-2">
            {pulseMetrics.map((metric) => {
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
              <Activity className="h-4 w-4" />
              Aujourd’hui
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Priorités immédiates
            </CardTitle>
            <CardDescription className="leading-6">
              Vue de conduite pour avancer sans se perdre dans des modules encore incomplets.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {priorities.map((priority, index) => (
              <div
                key={priority.title}
                className="rounded-xl border border-surface-border-subtle bg-surface-panel/70 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <p className="text-base font-medium text-foreground">{priority.title}</p>
                    <p className="text-sm leading-6 text-text-muted-soft">{priority.detail}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
                      index === 0
                        ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                        : index === 1
                          ? "bg-sky-500/12 text-sky-700 dark:text-sky-300"
                          : "bg-amber-500/14 text-amber-700 dark:text-amber-300"
                    )}
                  >
                    {priority.state}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
        <Card className="rounded-2xl bg-surface-panel/80 shadow-sm">
          <CardHeader className="gap-2 border-b border-surface-border-subtle/80 pb-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-text-muted-strong uppercase">
              <TrendingUp className="h-4 w-4" />
              Readiness
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              État d’avancement des chantiers
            </CardTitle>
            <CardDescription className="leading-6">
              Lecture synthétique du niveau de maturité des zones admin. Les pourcentages restent
              mockés tant que le reporting complet n’existe pas.
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

                <div className="h-2 rounded-full bg-foreground/[0.07]">
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
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Ce qui mérite ton attention
            </CardTitle>
            <CardDescription className="leading-6">
              Des repères utiles pour la suite, même si toute la chaîne métier n’est pas encore
              branchée.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 pt-5">
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.08] p-4">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Métriques business simulées</p>
                <p className="text-sm leading-6 text-text-muted-soft">
                  Conversion, panier moyen et trafic restent mockés pour garder un cockpit utile
                  avant le branchement analytics.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-sky-500/20 bg-sky-500/[0.08] p-4">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-300" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Base admin stable</p>
                <p className="text-sm leading-6 text-text-muted-soft">
                  Authentification, shell responsive et workflow catalogue ont désormais une base
                  cohérente.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-surface-border-subtle bg-surface-panel/70 p-4">
              <p className="text-xs font-semibold tracking-[0.24em] text-text-muted-strong uppercase">
                Prochain palier recommandé
              </p>
              <p className="mt-2 text-sm leading-6 text-text-muted-soft">
                Finir la lecture commandes, brancher les contenus storefront et introduire de vrais
                signaux de performance commerciale.
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
              Les zones qui font avancer la boutique
            </h2>
          </div>

          <span className="hidden rounded-full border border-shell-border/70 bg-surface-panel/80 px-3 py-1 text-xs text-text-muted-strong sm:inline-flex">
            Modules activables progressivement
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

                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-foreground/[0.06] text-foreground">
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
