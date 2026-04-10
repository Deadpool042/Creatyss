import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/shared/notice";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";

const checkboxClassName =
  "mt-0.5 size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type FeaturedCategoriesSectionProps = {
  categoryOptions: readonly CategoryOption[];
  categorySelectionMap: Map<string, number>;
};

export function FeaturedCategoriesSection({
  categoryOptions,
  categorySelectionMap,
}: FeaturedCategoriesSectionProps) {
  return (
    <AdminFormSection
      contentClassName="gap-5"
      description="En complément, choisissez les catégories à afficher sur la page d'accueil."
      eyebrow="Catégories"
      title="Catégories mises en avant"
    >
      {categoryOptions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categoryOptions.map((category) => (
            <Card
              className="rounded-xl border border-border/70 bg-card/95 text-card-foreground shadow-sm"
              key={category.id}
            >
              <div className="grid gap-4 px-3">
                <label className="flex items-start gap-3 text-sm leading-6 text-foreground">
                  <input
                    className={checkboxClassName}
                    defaultChecked={categorySelectionMap.has(category.id)}
                    name="featuredCategoryIds"
                    type="checkbox"
                    value={category.id}
                  />
                  <span className="grid gap-1">
                    <span className="font-medium text-foreground">{category.name}</span>
                    <span className="text-sm text-muted-foreground">{category.slug}</span>
                  </span>
                </label>

                <AdminFormField
                  className="max-w-28"
                  htmlFor={`homepage-featured-category-sort-order-${category.id}`}
                  label="Ordre"
                >
                  <Input
                    defaultValue={categorySelectionMap.get(category.id)?.toString() ?? ""}
                    id={`homepage-featured-category-sort-order-${category.id}`}
                    min="0"
                    name={`featuredCategorySortOrder:${category.id}`}
                    type="number"
                  />
                </AdminFormField>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Notice tone="note">Créez ou publiez une catégorie pour l&apos;afficher ici.</Notice>
      )}
    </AdminFormSection>
  );
}
