import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/notice";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormSection } from "@/components/admin/admin-form-section";

type ProductOption = {
  id: string;
  name: string;
  slug: string;
};

type FeaturedProductsSectionProps = {
  productOptions: ProductOption[];
  productSelectionMap: Map<string, number>;
};

export function FeaturedProductsSection({
  productOptions,
  productSelectionMap
}: FeaturedProductsSectionProps) {
  return (
    <AdminFormSection
      description="En complément, choisissez les produits publiés à afficher sur la page d'accueil."
      eyebrow="Produits"
      title="Produits mis en avant">

      <Notice tone="note">
        Ces sélections complètent la page après la bannière principale et le
        bloc éditorial.
      </Notice>

      {productOptions.length > 0 ? (
        <div className="admin-homepage-option-grid">
          {productOptions.map(product => (
            <Card
              className="admin-homepage-option rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm"
              key={product.id}>
              <label className="admin-checkbox">
                <input
                  defaultChecked={productSelectionMap.has(product.id)}
                  name="featuredProductIds"
                  type="checkbox"
                  value={product.id}
                />
                <span>
                  {product.name}
                  <span className="card-meta"> · {product.slug}</span>
                </span>
              </label>

              <AdminFormField
                className="admin-selection-order"
                htmlFor={`homepage-featured-product-sort-order-${product.id}`}
                label="Ordre">
                <Input
                  defaultValue={
                    productSelectionMap.get(product.id)?.toString() ?? ""
                  }
                  id={`homepage-featured-product-sort-order-${product.id}`}
                  min="0"
                  name={`featuredProductSortOrder:${product.id}`}
                  type="number"
                />
              </AdminFormField>
            </Card>
          ))}
        </div>
      ) : (
        <Notice tone="note">
          Publiez d&apos;abord un produit pour l&apos;afficher ici.
        </Notice>
      )}
    </AdminFormSection>
  );
}
