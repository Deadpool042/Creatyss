import Link from "next/link";
import { type AdminBlogPostSummary } from "@/db/repositories/admin-blog.repository";

const blogDateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short"
});

function getStatusLabel(status: "draft" | "published"): string {
  return status === "published" ? "Publié" : "Brouillon";
}

type AdminBlogPostCardProps = {
  blogPost: AdminBlogPostSummary;
};

export function AdminBlogPostCard({ blogPost }: AdminBlogPostCardProps) {
  const titleId = `admin-blog-post-${blogPost.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="store-card admin-blog-card rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm">
      <div className="stack gap-2">
        <p className="card-kicker text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Article
        </p>
        <h2
          className="text-lg font-semibold tracking-tight text-foreground"
          id={titleId}>
          {blogPost.title}
        </h2>
        <p className="card-meta text-sm text-muted-foreground">
          {blogPost.slug}
        </p>
      </div>

      <p className="card-copy text-sm leading-6 text-foreground/85">
        {blogPost.excerpt ?? "Aucun extrait pour cet article."}
      </p>

      <div className="admin-product-tags flex flex-wrap gap-2">
        <span className="admin-chip border-border/70 bg-muted/50 text-xs font-medium text-foreground">
          {getStatusLabel(blogPost.status)}
        </span>
        <span className="admin-chip border-border/70 bg-muted/50 text-xs font-medium text-foreground">
          {blogPost.publishedAt
            ? `Publié le ${blogDateTimeFormatter.format(new Date(blogPost.publishedAt))}`
            : "Non publié"}
        </span>
      </div>

      <div className="pt-1">
        <Link
          className="link inline-flex w-fit items-center text-sm font-medium"
          href={`/admin/blog/${blogPost.id}`}>
          Modifier l&apos;article
        </Link>
      </div>
    </article>
  );
}
