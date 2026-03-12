import Link from "next/link";
import { Notice } from "@/components/ui/notice";
import { PageHeader } from "@/components/ui/page-header";
import { listAdminBlogPosts } from "@/db/repositories/admin-blog.repository";

export const dynamic = "force-dynamic";

const blogDateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short"
});

type AdminBlogPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
    status?: string | string[];
  }>;
}>;

function getStatusLabel(status: "draft" | "published"): string {
  return status === "published" ? "Publié" : "Brouillon";
}

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
              <article className="store-card admin-blog-card" key={blogPost.id}>
                <div className="stack">
                  <p className="card-kicker">Article</p>
                  <h2>{blogPost.title}</h2>
                  <p className="card-meta">{blogPost.slug}</p>
                </div>

                <p className="card-copy">
                  {blogPost.excerpt ?? "Aucun extrait pour cet article."}
                </p>

                <div className="admin-product-tags">
                  <span className="admin-chip">
                    {getStatusLabel(blogPost.status)}
                  </span>
                  <span className="admin-chip">
                    {blogPost.publishedAt
                      ? `Publié le ${blogDateTimeFormatter.format(new Date(blogPost.publishedAt))}`
                      : "Non publié"}
                  </span>
                </div>

                <div>
                  <Link className="link" href={`/admin/blog/${blogPost.id}`}>
                    Modifier l&apos;article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Aucun article</p>
            <h2>Le blog ne contient pas encore d&apos;article</h2>
            <p className="card-copy">
              Créez un premier article simple pour alimenter la partie blog
              publique.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
