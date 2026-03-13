import Link from "next/link";
import { type AdminCategory } from "@/db/repositories/admin-category.repository";

type AdminCategoryCardProps = {
  category: AdminCategory;
};

export function AdminCategoryCard({ category }: AdminCategoryCardProps) {
  const titleId = `admin-category-${category.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="store-card admin-category-card rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm">
      <div className="stack gap-2">
        <p className="card-kicker text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Catégorie
        </p>
        <h2
          className="text-lg font-semibold tracking-tight text-foreground"
          id={titleId}>
          {category.name}
        </h2>
        <p className="card-meta text-sm text-muted-foreground">
          {category.slug}
        </p>
      </div>

      <p className="card-copy text-sm leading-6 text-foreground/85">
        {category.description ?? "Aucune description pour cette catégorie."}
      </p>

      <div className="admin-category-tags flex flex-wrap gap-2">
        <span className="admin-chip border-border/70 bg-muted/50 text-xs font-medium text-foreground">
          {category.isFeatured ? "Mise en avant" : "Standard"}
        </span>
      </div>

      <div className="pt-1">
        <Link
          className="link inline-flex w-fit items-center text-sm font-medium"
          href={`/admin/categories/${category.id}`}>
          Modifier la catégorie
        </Link>
      </div>
    </article>
  );
}
