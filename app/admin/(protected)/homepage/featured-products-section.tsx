import { Card } from "@/components/ui/card";
import { Notice } from "@/components/notice";
import { SectionIntro } from "@/components/section-intro";
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
    <AdminFormSection>
      <SectionIntro
        className="stack"
        description="En complément, choisissez les produits publiés à afficher sur la page d'accueil."
        eyebrow="Produits"
        title="Produits mis en avant"
      />

      <Notice tone="note">
        Ces sélections complètent la page après la bannière principale et le
        bloc éditorial.
      </Notice>

      {productOptions.length > 0 ? (
        <div className="admin-homepage-option-grid">
          {productOptions.map(product => (
            <Card
              className="store-card admin-homepage-option"
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

              <label className="admin-field admin-selection-order">
                <span className="meta-label">Ordre</span>
                <input
                  className="admin-input"
                  defaultValue={
                    productSelectionMap.get(product.id)?.toString() ?? ""
                  }
                  min="0"
                  name={`featuredProductSortOrder:${product.id}`}
                  type="number"
                />
              </label>
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
