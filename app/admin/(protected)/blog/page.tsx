import Link from "next/link";
import { Notice } from "@/components/ui/notice";
import { PageHeader } from "@/components/ui/page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminBlogPostCard } from "@/components/admin/admin-blog-post-card";
import { listAdminBlogPosts } from "@/db/repositories/admin-blog.repository";

export const dynamic = "force-dynamic";

type AdminBlogPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
    status?: string | string[];
  }>;
}>;

function getStatusMessage(status: string | undefined): string | null {
  switch (status) {
    case "deleted":
      return "Article supprimé avec succès.";
    default:
      return null;
  }
}

function getErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "missing_blog_post":
      return "L'article demandé est introuvable.";
    default:
      return null;
  }
}

export default async function AdminBlogPage({
  searchParams
}: AdminBlogPageProps) {
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

  return (
    <div className="admin-blog-page">
      <section className="section">
        <PageHeader
          actions={
            <Link className="button" href="/admin/blog/new">
              Nouvel article
            </Link>
          }
          description="Gérez les articles, leur statut de publication et leur visuel de couverture depuis une page simple et lisible."
          eyebrow="Blog"
          title="Articles"
        />

        {successMessage ? <Notice tone="success">{successMessage}</Notice> : null}
        {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

        {blogPosts.length > 0 ? (
          <div className="admin-blog-list">
            {blogPosts.map((blogPost) => (
              <AdminBlogPostCard key={blogPost.id} blogPost={blogPost} />
            ))}
          </div>
        ) : (
          <AdminEmptyState
            eyebrow="Aucun article"
            title="Le blog ne contient pas encore d'article"
            description="Créez un premier article simple pour alimenter la partie blog publique."
          />
        )}
      </section>
    </div>
  );
}
