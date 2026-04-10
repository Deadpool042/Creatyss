"use client";

import { useActionState, useMemo, useState, type ChangeEvent, type JSX } from "react";
import { ImagePlus } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { uploadProductImagesAction } from "@/features/admin/products/editor/public";
import {
  uploadProductImagesFormInitialState,
  type UploadProductImagesFormState,
} from "@/features/admin/products/editor/types";

type UploadProductImagesAction = typeof uploadProductImagesAction;

type ProductImageUploadFormProps = {
  productId: string;
  action: UploadProductImagesAction;
};

export function ProductImageUploadForm({
  productId,
  action,
}: ProductImageUploadFormProps): JSX.Element {
  const [state, formAction, pending] = useActionState<UploadProductImagesFormState, FormData>(
    action,
    uploadProductImagesFormInitialState
  );
  const [selectedFilesCount, setSelectedFilesCount] = useState(0);
  const [makePrimaryChecked, setMakePrimaryChecked] = useState(false);

  const canSetPrimary = selectedFilesCount === 1;

  const checkboxHint = useMemo(() => {
    if (selectedFilesCount <= 0) {
      return "Sélectionnez une image unique pour pouvoir la définir explicitement comme image principale.";
    }

    if (selectedFilesCount === 1) {
      return "Cette image sera utilisée comme image principale du produit.";
    }

    return "Avec plusieurs images sélectionnées, cette option est désactivée. Si le produit n’a pas encore d’image principale, la première importée sera utilisée automatiquement.";
  }, [selectedFilesCount]);

  function handleFilesChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextCount = event.target.files?.length ?? 0;
    setSelectedFilesCount(nextCount);

    if (nextCount !== 1) {
      setMakePrimaryChecked(false);
    }
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="productId" value={productId} />

      <AdminFormMessage
        tone={state.status === "success" ? "success" : "error"}
        message={state.status !== "idle" ? state.message : null}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <AdminFormField
          label="Images"
          htmlFor="product-image-files"
          required
          {...(state.fieldErrors.files ? { error: state.fieldErrors.files } : {})}
        >
          <Input
            id="product-image-files"
            name="files"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp, image/avif"
            className="text-sm"
            onChange={handleFilesChange}
          />
        </AdminFormField>

        <AdminFormField
          label="Définir comme image principale"
          htmlFor="product-image-make-primary"
          description={checkboxHint}
          {...(state.fieldErrors.makePrimary ? { error: state.fieldErrors.makePrimary } : {})}
        >
          <label className="flex min-h-10 items-center gap-3 rounded-md border px-3 py-2 text-sm">
            <input
              id="product-image-make-primary"
              name="makePrimary"
              type="checkbox"
              value="true"
              className="h-4 w-4"
              checked={makePrimaryChecked}
              disabled={!canSetPrimary}
              onChange={(event) => setMakePrimaryChecked(event.target.checked)}
            />
            <span>Utiliser comme principale</span>
          </label>
        </AdminFormField>
      </div>

      <AdminFormField
        label="Texte alternatif"
        htmlFor="product-image-alt-text"
        description="Champ optionnel appliqué aux images importées."
        {...(state.fieldErrors.altText ? { error: state.fieldErrors.altText } : {})}
      >
        <Input
          id="product-image-alt-text"
          name="altText"
          placeholder="Décris brièvement l’image"
          className="text-sm"
        />
      </AdminFormField>

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          <ImagePlus className="mr-2 h-4 w-4" />
          {pending ? "Import…" : "Importer les images"}
        </Button>
      </div>
    </form>
  );
}
