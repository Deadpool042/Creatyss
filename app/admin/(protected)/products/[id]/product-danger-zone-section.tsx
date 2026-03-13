import { Notice } from "@/components/notice";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/features/admin/products/actions/delete-product-action";

type ProductDangerZoneSectionProps = Readonly<{
  deleteErrorMessage: string | null;
  productId: string;
}>;

export function ProductDangerZoneSection({
  deleteErrorMessage,
  productId
}: ProductDangerZoneSectionProps) {
  return (
    <section className="section admin-danger-zone">
      {deleteErrorMessage ? (
        <Notice tone="alert">{deleteErrorMessage}</Notice>
      ) : null}

      <AdminFormSection
        description="La suppression retire aussi les catégories associées, les déclinaisons et les images rattachées."
        eyebrow="Suppression"
        title="Supprimer ce produit">
        <form action={deleteProductAction}>
          <input
            name="productId"
            type="hidden"
            value={productId}
          />

          <Button
            className="button admin-danger-button"
            type="submit">
            Supprimer le produit
          </Button>
        </form>
      </AdminFormSection>
    </section>
  );
}
