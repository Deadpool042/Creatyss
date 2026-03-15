import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { type AdminCategory } from "@/db/repositories/admin-category.repository";

type AdminCategoryCardProps = {
  category: AdminCategory;
};

export function AdminCategoryCard({ category }: AdminCategoryCardProps) {
  const titleId = `admin-category-${category.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className="grid h-full gap-4 rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm">
      <div className="grid gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Catégorie
        </p>
        <h2
          className="text-lg font-semibold tracking-tight text-foreground"
          id={titleId}>
          {category.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {category.slug}
        </p>
      </div>

      <p className="text-sm leading-6 text-foreground/85">
        {category.description ?? "Aucune description pour cette catégorie."}
      </p>

      <div className="flex flex-wrap gap-2">
        <Badge variant={category.isFeatured ? "secondary" : "outline"}>
          {category.isFeatured ? "Mise en avant" : "Standard"}
        </Badge>
      </div>

      <Link
        className="inline-flex w-fit items-center text-sm font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
        href={`/admin/categories/${category.id}`}>
        Modifier la catégorie
      </Link>
    </article>
  );
}
