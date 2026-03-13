import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/notice";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { AdminFormSection } from "@/components/admin/admin-form-section";

const checkboxClassName =
  "mt-0.5 size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

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
      contentClassName="gap-5"
      description="En complément, choisissez les produits publiés à afficher sur la page d'accueil."
      eyebrow="Produits"
      title="Produits mis en avant">
      <Notice tone="note">
        Ces sélections complètent la page après la bannière principale et le
        bloc éditorial.
      </Notice>

      {productOptions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {productOptions.map(product => (
            <Card
              className="rounded-xl border border-border/70 bg-card/95 text-card-foreground shadow-sm"
              key={product.id}>
              <div className="grid gap-4 px-3">
                <label className="flex items-start gap-3 text-sm leading-6 text-foreground">
                  <input
                    className={checkboxClassName}
                    defaultChecked={productSelectionMap.has(product.id)}
                    name="featuredProductIds"
                    type="checkbox"
                    value={product.id}
                  />
                  <span className="grid gap-1">
                    <span className="font-medium text-foreground">
                      {product.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {product.slug}
                    </span>
                  </span>
                </label>

                <AdminFormField
                  className="max-w-28"
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
              </div>
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
