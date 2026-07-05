import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileText,
  Globe,
  Info,
  LayoutTemplate,
  Newspaper,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ADMIN_CONTENT_BLOG_PATH,
  ADMIN_CONTENT_HOMEPAGE_PATH,
  ADMIN_CONTENT_PAGES_PATH,
  ADMIN_CONTENT_SEO_PATH,
} from "@/features/admin/content/shared/admin-content-routes";
import type { ContentOverviewStats } from "@/features/admin/content/queries/get-content-overview-stats.query";

// ── Quick links ────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  {
    href: ADMIN_CONTENT_BLOG_PATH,
    title: "Blog",
    description: "Écrire, planifier et publier les articles éditoriaux de la boutique.",
    icon: Newspaper,
    available: true,
  },
  {
    href: ADMIN_CONTENT_HOMEPAGE_PATH,
    title: "Page d'accueil",
    description: "Composer les sections, produits mis en avant et appels à l'action.",
    icon: LayoutTemplate,
    available: true,
  },
  {
    href: ADMIN_CONTENT_PAGES_PATH,
    title: "Pages",
    description: "CGV, Mentions légales, À propos, FAQ — pages éditoriales statiques.",
    icon: FileText,
    available: true,
  },
  {
    href: ADMIN_CONTENT_SEO_PATH,
    title: "SEO",
    description: "Métadonnées globales, titres, descriptions et plan de site.",
    icon: Search,
    available: true,
  },
] as const;

// ── Metric card ────────────────────────────────────────────────────────────
function HeroMetric({
  label,
  value,
  hint,
  accentClassName,
}: {
  label: string;
  value: string;
  hint: string;
  accentClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-5 py-4 shadow-sm backdrop-blur-sm",
        accentClassName
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        {label}
      </p>
      <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="text-xs leading-5 text-muted-foreground">{hint}</p>
    </div>
  );
}

// ── Readiness row ──────────────────────────────────────────────────────────
function ReadinessRow({
  label,
  detail,
  progress,
  toneClassName,
  isMock,
}: {
  label: string;
  detail: string;
  progress: number;
  toneClassName: string;
  isMock?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
      <div className="w-28 shrink-0">
        <p className="text-[13px] font-medium text-foreground">
          {label}
          {isMock ? (
            <span className="ml-1.5 align-middle text-[10px] text-muted-foreground/50">(mock)</span>
          ) : null}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-subtle">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              progress >= 70
                ? "bg-feedback-success-surface"
                : progress >= 35
                  ? "bg-feedback-warning-surface"
                  : "bg-feedback-error-surface"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span
          className={cn(
            "w-8 shrink-0 text-right text-xs font-semibold tabular-nums",
            toneClassName
          )}
        >
          {progress}%
        </span>
      </div>
    </div>
  );
}

// ── Signal item ────────────────────────────────────────────────────────────
function SignalItem({
  label,
  detail,
  tone,
  isMock,
}: {
  label: string;
  detail: string;
  tone: "warning" | "error" | "info" | "success";
  isMock?: boolean;
}) {
  const Icon =
    tone === "error"
      ? XCircle
      : tone === "warning"
        ? AlertTriangle
        : tone === "success"
          ? CheckCircle2
          : Info;

  const iconClass =
    tone === "error"
      ? "text-feedback-error-foreground"
      : tone === "warning"
        ? "text-feedback-warning-foreground"
        : tone === "success"
          ? "text-feedback-success-foreground"
          : "text-foreground/50";

  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <Icon className={cn("mt-0.5 size-4 shrink-0", iconClass)} />
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-foreground">
          {label}
          {isMock ? (
            <span className="ml-1.5 text-[10px] text-muted-foreground/50">(mock)</span>
          ) : null}
        </p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
type ContentOverviewSectionsProps = {
  stats: ContentOverviewStats;
  canPublishBlog: boolean;
};

export function ContentOverviewSections({ stats, canPublishBlog }: ContentOverviewSectionsProps) {
  const heroMetrics = [
    {
      label: "Articles blog",
      value: String(stats.totalPosts),
      hint:
        stats.totalPosts === 0
          ? "Aucun article rédigé"
          : `${stats.publishedPosts} publié${stats.publishedPosts > 1 ? "s" : ""} · ${stats.draftPosts} brouillon${stats.draftPosts > 1 ? "s" : ""}`,
      accentClassName: undefined,
    },
    {
      label: "Page d'accueil",
      value: stats.homepagePublished ? "Publiée" : "Brouillon",
      hint: `${stats.homepageSectionsCount} section${stats.homepageSectionsCount > 1 ? "s" : ""} configurée${stats.homepageSectionsCount > 1 ? "s" : ""}`,
      accentClassName: stats.homepagePublished ? "bg-emerald-50/60" : "bg-amber-50/60",
    },
    {
      label: "Pages légales",
      value: `${stats.publishedPages}/${stats.totalPages}`,
      hint: "CGV, Mentions légales, FAQ et pages éditoriales",
      accentClassName:
        stats.publishedPages === 0 && stats.totalPages > 0 ? "bg-red-50/60" : undefined,
    },
    {
      label: "Score SEO",
      value: `${stats.seoOverallScore}/100`,
      hint: "Couverture des titres SEO sur les produits actifs",
      accentClassName:
        stats.seoOverallScore >= 70
          ? "bg-emerald-50/60"
          : stats.seoOverallScore >= 40
            ? "bg-amber-50/60"
            : "bg-red-50/60",
    },
  ];

  return (
    <div>
      {/* ── Hero metrics ──────────────────────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {heroMetrics.map(({ accentClassName, ...rest }) => (
          <HeroMetric
            key={rest.label}
            {...rest}
            {...(accentClassName ? { accentClassName } : {})}
          />
        ))}
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        {/* Colonne principale */}
        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border border-surface-border/60 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface-panel)_92%,white)_0%,color-mix(in_srgb,var(--surface-panel)_72%,var(--shell-surface))_100%)] p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                  Hub contenu
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                  Blog, pages, accueil et SEO dans un même domaine
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Le domaine contenu s’utilise désormais comme un tout : pilotage, surfaces
                  éditoriales et optimisation storefront.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-surface-border/60 bg-surface-panel/70 px-3 py-1.5 text-xs font-medium text-foreground">
                <BadgeCheck className="size-3.5 text-muted-foreground" />
                Blog storefront : {canPublishBlog ? "publication active" : "niveau brouillon"}
              </div>
            </div>
          </section>

          {/* Articles récents */}
          <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                  Blog
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                  Articles récents
                </h2>
              </div>
              <Link
                href={ADMIN_CONTENT_BLOG_PATH}
                className="inline-flex items-center gap-1 rounded-full border border-surface-border/60 bg-surface-panel px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-panel-soft hover:text-foreground"
              >
                Tous les articles
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {stats.recentPosts.length === 0 ? (
              <div className="py-8 text-center">
                <Newspaper className="mx-auto mb-3 size-8 text-muted-foreground/30" />
                <p className="text-sm font-medium text-foreground">Aucun article</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Rédigez le premier article pour démarrer le blog éditorial.
                </p>
                <Link
                  href={`${ADMIN_CONTENT_BLOG_PATH}/new`}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <Sparkles className="size-3.5" />
                  Écrire un article
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-surface-border/30">
                {stats.recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-foreground">
                        {post.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {post.publishedAt
                          ? new Intl.DateTimeFormat("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }).format(new Date(post.publishedAt))
                          : "Non publié"}
                        {!post.hasContent ? (
                          <span className="ml-1.5 text-feedback-warning-foreground">
                            · contenu vide
                          </span>
                        ) : null}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex h-6 shrink-0 items-center rounded-md px-2 text-[11px] font-medium",
                        post.status === "published"
                          ? "bg-feedback-success-surface/75 text-feedback-success-foreground"
                          : "bg-surface-subtle text-muted-foreground"
                      )}
                    >
                      {post.status === "published" ? "Publié" : "Brouillon"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Accès rapides */}
          <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm backdrop-blur-sm">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
              Outils contenu
            </p>
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
              Accès rapides
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-3.5 transition-colors",
                    link.available
                      ? "border-surface-border/40 bg-surface-panel/50 hover:border-surface-border hover:bg-surface-panel"
                      : "cursor-default border-surface-border/20 bg-surface-subtle/30 opacity-60"
                  )}
                  tabIndex={link.available ? 0 : -1}
                  aria-disabled={!link.available}
                >
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface-subtle">
                    <link.icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[13px] font-medium text-foreground">
                      {link.title}
                      {!link.available ? (
                        <span className="text-[10px] font-normal text-muted-foreground/60">
                          à venir
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Colonne latérale — signaux + maturité */}
        <div className="flex flex-col gap-4">
          {/* Signaux */}
          <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm backdrop-blur-sm">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
              Signaux
            </p>
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
              Points d'attention
            </h2>
            {stats.signals.length === 0 ? (
              <div className="flex items-center gap-2.5 rounded-xl bg-feedback-success-surface/40 px-3 py-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-feedback-success-foreground" />
                <p className="text-[13px] text-feedback-success-foreground">
                  Contenu éditorial en ordre
                </p>
              </div>
            ) : (
              <div className="divide-y divide-surface-border/30">
                {stats.signals.map((s) => (
                  <SignalItem
                    key={s.key}
                    label={s.label}
                    detail={s.detail}
                    tone={s.tone}
                    {...(s.isMock !== undefined ? { isMock: s.isMock } : {})}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Maturité éditoriale */}
          <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm backdrop-blur-sm">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
              Maturité éditoriale
            </p>
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
              Complétude contenu
            </h2>
            <div className="divide-y divide-surface-border/30">
              {stats.readinessItems.map(({ key, ...rest }) => (
                <ReadinessRow key={key} {...rest} />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-surface-border/40 bg-surface-panel/30 p-4">
            <div className="flex items-start gap-2">
              <Globe className="mt-0.5 size-4 shrink-0 text-muted-foreground/50" />
              <div>
                <p className="text-[11px] font-medium text-muted-foreground">Portée des données</p>
                <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground/70">
                  Blog, pages, accueil et couverture SEO produits : données réelles. Le score SEO
                  mesure les titres personnalisés des produits actifs (SeoMetadata).
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
