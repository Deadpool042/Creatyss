import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { type AdminBlogPostSummary } from "@/db/repositories/admin-blog.repository";

const blogDateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
});

function getStatusLabel(status: "draft" | "published"): string {
  return status === "published" ? "Publié" : "Brouillon";
}

function getStatusBadgeVariant(status: AdminBlogPostSummary["status"]) {
  return status === "published" ? ("secondary" as const) : ("outline" as const);
}

type AdminBlogPostCardProps = {
  blogPost: AdminBlogPostSummary;
};

export function AdminBlogPostCard({ blogPost }: AdminBlogPostCardProps) {
  const titleId = `admin-blog-post-${blogPost.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="grid h-full gap-4 rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm"
    >
      <div className="grid gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Article
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-foreground" id={titleId}>
          {blogPost.title}
        </h2>
        <p className="text-sm text-muted-foreground">{blogPost.slug}</p>
      </div>

      <p className="text-sm leading-6 text-foreground/85">
        {blogPost.excerpt ?? "Aucun extrait pour cet article."}
      </p>

      <div className="flex flex-wrap gap-2">
        <Badge variant={getStatusBadgeVariant(blogPost.status)}>
          {getStatusLabel(blogPost.status)}
        </Badge>
        <Badge variant={blogPost.publishedAt ? "secondary" : "outline"}>
          {blogPost.publishedAt
            ? `Publié le ${blogDateTimeFormatter.format(new Date(blogPost.publishedAt))}`
            : "Non publié"}
        </Badge>
      </div>

      <Link
        className="inline-flex w-fit items-center text-sm font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
        href={`/admin/blog/${blogPost.id}`}
      >
        Modifier l&apos;article
      </Link>
    </article>
  );
}
