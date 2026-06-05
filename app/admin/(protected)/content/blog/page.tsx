import Link from "next/link";
import { Edit3, Eye, EyeOff, FileText, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Notice } from "@/components/shared/feedback";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { cn } from "@/lib/utils";
import { listAdminBlogPosts, toggleBlogPostStatusAction } from "@/features/admin/blog";

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
  return null;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

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
  const blogPosts = await listAdminBlogPosts();

  const published = blogPosts.filter((p) => p.status === "published").length;
  const drafts = blogPosts.filter((p) => p.status === "draft").length;

  return (
    <AdminPageShell
      scrollMode="area"
      title="Articles"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Contenu", href: "/admin/content/overview" },
        { label: "Blog" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="table"
      topbarAction={
        <Button asChild size="sm" className="rounded-full gap-1.5">
          <Link href="/admin/content/blog/new">
            <Plus className="size-3.5" />
            Nouvel article
          </Link>
        </Button>
      }
    >
      {successMessage ? <Notice tone="success">{successMessage}</Notice> : null}
      {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

      {blogPosts.length > 0 ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total", value: blogPosts.length },
              { label: "Publiés", value: published, accent: published > 0 ? "text-feedback-success-foreground" : undefined },
              { label: "Brouillons", value: drafts, accent: drafts > 0 ? "text-feedback-warning-foreground" : undefined },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-4 py-3 text-center shadow-sm backdrop-blur-sm"
              >
                <p className={cn("text-2xl font-semibold tracking-tight", s.accent ?? "text-foreground")}>
                  {s.value}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Liste articles */}
          <div className="divide-y divide-surface-border/40">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
              >
                {/* Icône statut */}
                <div
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl border",
                    post.status === "published"
                      ? "border-feedback-success-border bg-feedback-success-surface/40 text-feedback-success-foreground"
                      : "border-surface-border/60 bg-surface-subtle text-muted-foreground/50"
                  )}
                >
                  <FileText className="size-4" />
                </div>

                {/* Titre + meta */}
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/content/blog/${post.id}`}
                    className="text-[13px] font-medium text-foreground hover:underline underline-offset-4"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {post.status === "published" && post.publishedAt
                      ? `Publié le ${dateFormatter.format(new Date(post.publishedAt))}`
                      : post.hasContent
                        ? "Brouillon — prêt à publier"
                        : "Brouillon — contenu à compléter"}
                  </p>
                </div>

                {/* Badge statut */}
                <span
                  className={cn(
                    "shrink-0 inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium",
                    post.status === "published"
                      ? "bg-feedback-success-surface/75 text-feedback-success-foreground"
                      : "bg-surface-subtle text-muted-foreground"
                  )}
                >
                  {post.status === "published" ? "Publié" : "Brouillon"}
                </span>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  <Link
                    href={`/admin/content/blog/${post.id}`}
                    className="flex size-8 items-center justify-center rounded-xl text-muted-foreground/60 transition-colors hover:bg-surface-subtle hover:text-foreground"
                    title="Modifier"
                  >
                    <Edit3 className="size-3.5" />
                  </Link>
                  <form action={toggleBlogPostStatusAction}>
                    <input type="hidden" name="postId" value={post.id} />
                    <button
                      type="submit"
                      disabled={post.status === "draft" && !post.hasContent}
                      title={post.status === "published" ? "Passer en brouillon" : "Publier"}
                      className="flex size-8 items-center justify-center rounded-xl text-muted-foreground/60 transition-colors hover:bg-surface-subtle hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {post.status === "published" ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <AdminEmptyState
          eyebrow="Aucun article"
          title="Le blog ne contient pas encore d'article"
          description="Créez un premier article pour alimenter la partie éditoriale de la boutique."
        />
      )}
    </AdminPageShell>
  );
}
