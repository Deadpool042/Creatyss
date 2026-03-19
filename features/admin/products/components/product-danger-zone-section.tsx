import { Notice } from "@/components/shared/notice";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { ProductDeleteConfirmDialog } from "./product-delete-confirm-dialog";

type ProductDangerZoneSectionProps = Readonly<{
  deleteErrorMessage: string | null;
  productId: string;
}>;

export function ProductDangerZoneSection({
  deleteErrorMessage,
  productId,
}: ProductDangerZoneSectionProps) {
  return (
    <section className="space-y-4">
      {deleteErrorMessage ? <Notice tone="alert">{deleteErrorMessage}</Notice> : null}

      <AdminFormSection
        description="La suppression retire aussi les catégories associées, les déclinaisons et les images rattachées."
        eyebrow="Suppression"
        title="Supprimer ce produit"
      >
        <ProductDeleteConfirmDialog productId={productId} />
      </AdminFormSection>
    </section>
  );
}
