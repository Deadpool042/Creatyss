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
  return (
    <article className="store-card admin-blog-card">
      <div className="stack">
        <p className="card-kicker">Article</p>
        <h2>{blogPost.title}</h2>
        <p className="card-meta">{blogPost.slug}</p>
      </div>

      <p className="card-copy">
        {blogPost.excerpt ?? "Aucun extrait pour cet article."}
      </p>

      <div className="admin-product-tags">
        <span className="admin-chip">{getStatusLabel(blogPost.status)}</span>
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
  );
}
