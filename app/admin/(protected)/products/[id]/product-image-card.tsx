import { AdminFormField } from "@/components/admin/admin-form-field";
import { type AdminProductImage } from "@/db/repositories/admin-product-image.repository";
import { deleteProductImageAction } from "@/features/admin/products/actions/delete-product-image-action";
import { updateProductImageAction } from "@/features/admin/products/actions/update-product-image-action";
import { getImageUrl } from "./product-detail-helpers";

type ProductImageCardProps = Readonly<{
  image: AdminProductImage;
  imageScope: "product" | "variant";
  productId: string;
  uploadsPublicPath: string;
}>;

function renderImagePreview(
  uploadsPublicPath: string,
  image: AdminProductImage
) {
  const imageUrl = getImageUrl(uploadsPublicPath, image.filePath);

  if (imageUrl === null) {
    return (
      <div className="admin-image-preview admin-image-placeholder">
        Chemin d&apos;image indisponible
      </div>
    );
  }

  return (
    <div className="admin-image-preview">
      <img
        alt={image.altText ?? "Image produit"}
        src={imageUrl}
      />
    </div>
  );
}

export function ProductImageCard({
  image,
  imageScope,
  productId,
  uploadsPublicPath
}: ProductImageCardProps) {
  const altTextId = `image-alt-${image.id}`;
  const sortOrderId = `image-sort-order-${image.id}`;

  return (
    <article className="store-card admin-image-card grid gap-4 rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm">
      {renderImagePreview(uploadsPublicPath, image)}

      <div className="stack">
        <div className="admin-product-tags">
          <span className="admin-chip">
            {image.isPrimary ? "Image principale" : "Image secondaire"}
          </span>
          <span className="admin-chip">Ordre {image.sortOrder}</span>
        </div>
        <p className="card-meta">{image.filePath}</p>
      </div>

      <form
        action={updateProductImageAction}
        className="admin-form admin-record-form">
        <input
          name="productId"
          type="hidden"
          value={productId}
        />
        <input
          name="imageId"
          type="hidden"
          value={image.id}
        />
        <input
          name="imageScope"
          type="hidden"
          value={imageScope}
        />

        <AdminFormField
          htmlFor={altTextId}
          label="Texte alternatif">
          <input
            className="admin-input"
            defaultValue={image.altText ?? ""}
            id={altTextId}
            name="altText"
            type="text"
          />
        </AdminFormField>

        <AdminFormField
          htmlFor={sortOrderId}
          label="Ordre">
          <input
            className="admin-input"
            defaultValue={String(image.sortOrder)}
            id={sortOrderId}
            name="sortOrder"
            type="number"
          />
        </AdminFormField>

        <label className="admin-checkbox">
          <input
            defaultChecked={image.isPrimary}
            name="isPrimary"
            type="checkbox"
            value="on"
          />
          <span>
            {imageScope === "product"
              ? "Image principale produit"
              : "Image principale de la déclinaison"}
          </span>
        </label>

        <div className="admin-inline-actions">
          <button
            className="button"
            type="submit">
            Mettre à jour l&apos;image
          </button>
        </div>
      </form>

      <form action={deleteProductImageAction}>
        <input
          name="productId"
          type="hidden"
          value={productId}
        />
        <input
          name="imageId"
          type="hidden"
          value={image.id}
        />
        <input
          name="imageScope"
          type="hidden"
          value={imageScope}
        />

        <button
          className="button link-subtle"
          type="submit">
          Supprimer l&apos;image
        </button>
      </form>
    </article>
  );
}
