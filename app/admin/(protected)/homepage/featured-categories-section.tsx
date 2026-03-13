import { Card } from "@/components/ui/card";
import { Notice } from "@/components/notice";
import { SectionIntro } from "@/components/section-intro";
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
    <AdminFormSection>
      <SectionIntro
        className="stack"
        description="En complément, choisissez les catégories à afficher sur la page d'accueil."
        eyebrow="Catégories"
        title="Catégories mises en avant"
      />

      {categoryOptions.length > 0 ? (
        <div className="admin-homepage-option-grid">
          {categoryOptions.map(category => (
            <Card
              className="store-card admin-homepage-option"
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

              <label className="admin-field admin-selection-order">
                <span className="meta-label">Ordre</span>
                <input
                  className="admin-input"
                  defaultValue={
                    categorySelectionMap.get(category.id)?.toString() ?? ""
                  }
                  min="0"
                  name={`featuredCategorySortOrder:${category.id}`}
                  type="number"
                />
              </label>
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
