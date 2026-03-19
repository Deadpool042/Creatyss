import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { type AdminCategory } from "@/db/repositories/admin-category.repository";
import { getUploadsPublicPath } from "@/lib/uploads";

type AdminCategoryCardProps = {
  category: AdminCategory;
};

export function AdminCategoryCard({ category }: AdminCategoryCardProps) {
  const titleId = `admin-category-${category.id}`;
  const uploadsPublicPath = getUploadsPublicPath();
  const displayPath = category.imagePath ?? category.representativeImage?.filePath ?? null;
  const imageUrl = displayPath ? `${uploadsPublicPath}/${displayPath.replace(/^\/+/, "")}` : null;

  return (
    <article
      aria-labelledby={titleId}
      className="grid h-full gap-4 rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm overflow-hidden"
    >
      {imageUrl ? (
        <div className="overflow-hidden">
          <img alt={category.name} className="aspect-video w-full object-cover" src={imageUrl} />
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center bg-muted/30 text-xs text-muted-foreground">
          Pas d&apos;image
        </div>
      )}
      <div className="grid gap-4 px-5 pb-5">
        <div className="grid gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Catégorie
          </p>
          <h2 className="text-lg font-semibold tracking-tight text-foreground" id={titleId}>
            {category.name}
          </h2>
          <p className="text-sm text-muted-foreground">{category.slug}</p>
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
          href={`/admin/categories/${category.id}`}
        >
          Modifier la catégorie
        </Link>
      </div>
    </article>
  );
}
