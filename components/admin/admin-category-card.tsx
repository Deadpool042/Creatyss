import Link from "next/link";
import { type AdminCategory } from "@/db/repositories/admin-category.repository";

type AdminCategoryCardProps = {
  category: AdminCategory;
};

export function AdminCategoryCard({ category }: AdminCategoryCardProps) {
  return (
    <article className="store-card admin-category-card">
      <div className="stack">
        <p className="card-kicker">Catégorie</p>
        <h2>{category.name}</h2>
        <p className="card-meta">{category.slug}</p>
      </div>

      <p className="card-copy">
        {category.description ?? "Aucune description pour cette catégorie."}
      </p>

      <div className="admin-category-tags">
        <span className="admin-chip">
          {category.isFeatured ? "Mise en avant" : "Standard"}
        </span>
      </div>

      <div>
        <Link className="link" href={`/admin/categories/${category.id}`}>
          Modifier la catégorie
        </Link>
      </div>
    </article>
  );
}
