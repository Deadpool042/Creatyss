import Link from "next/link";
import { Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { listAdminBlogPosts } from "@/db/repositories/admin-blog.repository";
import { toggleBlogPostStatusAction } from "@/features/admin/blog/actions/toggle-blog-post-status-action";

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

const blogDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium"
});

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
    <div className="grid gap-6">
      <section className="grid gap-6">
        <PageHeader
          actions={
            <Link
              className="button"
              href="/admin/blog/new">
              Nouvel article
            </Link>
          }
          description="Gérez les articles, leur statut de publication et leur visuel de couverture depuis une page simple et lisible."
          eyebrow="Blog"
          title="Articles"
        />

        {successMessage ? (
          <Notice tone="success">{successMessage}</Notice>
        ) : null}
        {errorMessage ? <Notice tone="alert">{errorMessage}</Notice> : null}

        {blogPosts.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Publié le</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Link
                        className="text-sm font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                        href={`/admin/blog/${post.id}`}>
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {post.slug}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          post.status === "published" ? "secondary" : "outline"
                        }>
                        {post.status === "published" ? "Publié" : "Brouillon"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {post.publishedAt
                        ? blogDateFormatter.format(new Date(post.publishedAt))
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Link
                          className="text-sm font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                          href={`/admin/blog/${post.id}`}>
                          Modifier l&apos;article
                        </Link>

                        <form action={toggleBlogPostStatusAction}>
                          <input type="hidden" name="postId" value={post.id} />
                          <button
                            className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={
                              post.status === "draft" && !post.hasContent
                            }
                            type="submit">
                            {post.status === "published"
                              ? "Passer en brouillon"
                              : "Publier"}
                          </button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
