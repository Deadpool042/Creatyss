import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Notice } from "@/components/shared/feedback";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { cn } from "@/lib/utils";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { listAdminBlogPosts } from "@/features/admin/blog";
import { BlogPostsPanel } from "@/features/admin/blog/components/blog-posts-panel";
import { ContentRouteNav } from "@/features/admin/content/components/content-route-nav";

export const dynamic = "force-dynamic";

type AdminBlogPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
    status?: string | string[];
  }>;
}>;

function getStatusMessage(status: string | undefined): string | null {
  if (status === "deleted") return "Article supprimé avec succès.";
  return null;
}

function getErrorMessage(error: string | undefined): string | null {
  if (error === "missing_blog_post") return "L'article demandé est introuvable.";
  if (error === "publish_level_insufficient") {
    return "Le niveau blog actuel n'autorise pas la publication storefront.";
  }
  return null;
}

export default async function AdminBlogPage({ searchParams }: AdminBlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const statusParam = Array.isArray(resolvedSearchParams.status)
    ? resolvedSearchParams.status[0]
    : resolvedSearchParams.status;
  const errorParam = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0]
    : resolvedSearchParams.error;
  const successMessage = getStatusMessage(statusParam);
  const errorMessage = getErrorMessage(errorParam);
  const [blogPosts, canPublishBlog] = await Promise.all([
    listAdminBlogPosts(),
    meetsFeatureLevel("content.blog", "publish"),
  ]);

  const published = blogPosts.filter((p) => p.status === "published").length;
  const drafts = blogPosts.filter((p) => p.status === "draft").length;

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Articles"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Contenu", href: "/admin/content/overview" },
        { label: "Blog" },
      ]}
      showTitleInContent={false}
      contentPreset="table"
      header={
        <AdminPageHeader
          eyebrow="Contenu"
          title="Articles"
          description="Pilotage éditorial du blog, publication storefront et suivi des brouillons."
        />
      }
      topbarAction={
        <Button asChild size="sm" className="rounded-full gap-1.5">
          <Link href="/admin/content/blog/new">
            <Plus className="size-3.5" />
            Nouvel article
          </Link>
        </Button>
      }
    >
      <ContentRouteNav />
      {successMessage ? <Notice tone="success">{successMessage}</Notice> : null}
      {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

      {blogPosts.length > 0 ? (
        <>
          <div className="rounded-2xl border border-surface-border/60 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface-panel)_92%,white)_0%,color-mix(in_srgb,var(--surface-panel)_72%,var(--shell-surface))_100%)] px-4 py-3 shadow-card">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
              Niveau blog
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {canPublishBlog ? "Publication storefront active" : "Mode brouillon uniquement"}
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              {canPublishBlog
                ? "Les articles publiés peuvent alimenter le storefront."
                : "Le blog reste éditable côté admin, sans diffusion publique tant que le niveau `publish` n’est pas actif."}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "Total", value: blogPosts.length },
              {
                label: "Publiés",
                value: published,
                accent: published > 0 ? "text-feedback-success-foreground" : undefined,
              },
              {
                label: "Brouillons",
                value: drafts,
                accent: drafts > 0 ? "text-feedback-warning-foreground" : undefined,
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-4 py-3 text-center shadow-sm backdrop-blur-sm"
              >
                <p
                  className={cn(
                    "text-2xl font-semibold tracking-tight",
                    s.accent ?? "text-foreground"
                  )}
                >
                  {s.value}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <BlogPostsPanel posts={blogPosts} canPublishBlog={canPublishBlog} />
        </>
      ) : (
        <>
          <div className="rounded-2xl border border-surface-border/60 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface-panel)_92%,white)_0%,color-mix(in_srgb,var(--surface-panel)_72%,var(--shell-surface))_100%)] px-4 py-3 shadow-card">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
              Niveau blog
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {canPublishBlog ? "Publication storefront active" : "Mode brouillon uniquement"}
            </p>
          </div>

          <AdminEmptyState
            eyebrow="Aucun article"
            title="Le blog ne contient pas encore d'article"
            description="Créez un premier article pour alimenter la partie éditoriale de la boutique."
          />
        </>
      )}
    </AdminPageShell>
  );
}
