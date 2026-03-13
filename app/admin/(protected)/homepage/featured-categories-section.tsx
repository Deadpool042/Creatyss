import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/notice";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormSection } from "@/components/admin/admin-form-section";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type FeaturedCategoriesSectionProps = {
  categoryOptions: CategoryOption[];
  categorySelectionMap: Map<string, number>;
};

export function FeaturedCategoriesSection({
  categoryOptions,
  categorySelectionMap
}: FeaturedCategoriesSectionProps) {
  return (
    <AdminFormSection
      description="En complément, choisissez les catégories à afficher sur la page d'accueil."
      eyebrow="Catégories"
      title="Catégories mises en avant">

      {categoryOptions.length > 0 ? (
        <div className="admin-homepage-option-grid">
          {categoryOptions.map(category => (
            <Card
              className="admin-homepage-option rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm"
              key={category.id}>
              <label className="admin-checkbox">
                <input
                  defaultChecked={categorySelectionMap.has(category.id)}
                  name="featuredCategoryIds"
                  type="checkbox"
                  value={category.id}
                />
                <span>
                  {category.name}
                  <span className="card-meta"> · {category.slug}</span>
                </span>
              </label>

              <AdminFormField
                className="admin-selection-order"
                htmlFor={`homepage-featured-category-sort-order-${category.id}`}
                label="Ordre">
                <Input
                  defaultValue={
                    categorySelectionMap.get(category.id)?.toString() ?? ""
                  }
                  id={`homepage-featured-category-sort-order-${category.id}`}
                  min="0"
                  name={`featuredCategorySortOrder:${category.id}`}
                  type="number"
                />
              </AdminFormField>
            </Card>
          ))}
        </div>
      ) : (
        <Notice tone="note">
          Créez ou publiez une catégorie pour l&apos;afficher ici.
        </Notice>
      )}
    </AdminFormSection>
  );
}
