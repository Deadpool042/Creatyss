import { AdminFormField } from "@/components/admin/admin-form-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type AdminProductImage } from "@/features/admin/products/types/product-detail-types";
import {
  updateProductImageAction,
  deleteProductImageAction,
} from "@/features/admin/products/actions";
import { getImageUrl } from "@/features/admin/products/mappers/product-detail-mappers";
import Image from "next/image";

const checkboxInputClassName =
  "mt-1 size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30";

const subtleDestructiveButtonClassName =
  "w-fit px-0 text-destructive hover:bg-transparent hover:text-destructive";

type ProductImageCardProps = Readonly<{
  image: AdminProductImage;
  imageScope: "product" | "variant";
  productId: string;
  uploadsPublicPath: string;
}>;

function renderImagePreview(uploadsPublicPath: string, image: AdminProductImage) {
  const imageUrl = getImageUrl(uploadsPublicPath, image.filePath);

  if (imageUrl === null) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-6 text-center text-sm leading-6 text-muted-foreground">
        Chemin d&apos;image indisponible
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/20 shadow-xs">
      <Image
        alt={image.altText ?? "Image produit"}
        className="aspect-16/10 w-full object-cover"
        src={imageUrl}
        width={400}
        height={250}
      />
    </div>
  );
}

export function ProductImageCard({
  image,
  imageScope,
  productId,
  uploadsPublicPath,
}: ProductImageCardProps) {
  const altTextId = `image-alt-${image.id}`;
  const sortOrderId = `image-sort-order-${image.id}`;

  return (
    <article className="grid gap-4 rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm">
      {renderImagePreview(uploadsPublicPath, image)}

      <div className="grid gap-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            {image.isPrimary ? "Image principale" : "Image secondaire"}
          </Badge>
          <Badge variant="secondary">Ordre {image.sortOrder}</Badge>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{image.filePath}</p>
      </div>

      <form action={updateProductImageAction} className="space-y-4">
        <input name="productId" type="hidden" value={productId} />
        <input name="imageId" type="hidden" value={image.id} />
        <input name="imageScope" type="hidden" value={imageScope} />

        <AdminFormField htmlFor={altTextId} label="Texte alternatif">
          <Input defaultValue={image.altText ?? ""} id={altTextId} name="altText" type="text" />
        </AdminFormField>

        <AdminFormField htmlFor={sortOrderId} label="Ordre">
          <Input
            defaultValue={String(image.sortOrder)}
            id={sortOrderId}
            name="sortOrder"
            type="number"
          />
        </AdminFormField>

        <label className="flex items-start gap-3 text-sm leading-6 text-foreground">
          <input
            className={checkboxInputClassName}
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

        <div className="flex flex-wrap items-center gap-3">
          <Button className="w-full sm:w-fit" type="submit">
            Mettre à jour l&apos;image
          </Button>
        </div>
      </form>

      <form action={deleteProductImageAction}>
        <input name="productId" type="hidden" value={productId} />
        <input name="imageId" type="hidden" value={image.id} />
        <input name="imageScope" type="hidden" value={imageScope} />

        <Button
          className={subtleDestructiveButtonClassName}
          size="sm"
          variant="ghost"
          type="submit"
        >
          Supprimer l&apos;image
        </Button>
      </form>
    </article>
  );
}
