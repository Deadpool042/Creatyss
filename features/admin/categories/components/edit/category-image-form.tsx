"use client";

import Image from "next/image";
import { useMemo, useState, useTransition, type JSX } from "react";
import { useRouter } from "next/navigation";

import {
  AdminFormActions,
  AdminFormField,
  AdminFormMessage,
  AdminSelectField,
} from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { CATEGORY_IMAGE_FORM_COPY } from "@/features/admin/categories/config";
import {
  deleteCategoryImageAction,
  setCategoryImageAction,
} from "@/features/admin/categories/actions";

type MediaAssetOption = {
  id: string;
  originalName: string;
  mimeType: string;
  previewUrl: string | null;
};

type CategoryImageFormProps = Readonly<{
  categoryId: string;
  categoryName: string;
  primaryImageId: string | null;
  primaryImageUrl: string | null;
  mediaAssets: MediaAssetOption[];
}>;

type CategoryImageFeedbackState = {
  status: "idle" | "success" | "error";
  message: string;
};

const initialState: CategoryImageFeedbackState = {
  status: "idle",
  message: "",
};

export function CategoryImageForm({
  categoryId,
  categoryName,
  primaryImageId,
  primaryImageUrl,
  mediaAssets,
}: CategoryImageFormProps): JSX.Element {
  const router = useRouter();
  const [selectedMediaAssetId, setSelectedMediaAssetId] = useState(primaryImageId ?? "");
  const [displayedImageUrl, setDisplayedImageUrl] = useState(primaryImageUrl);
  const [feedbackState, setFeedbackState] = useState<CategoryImageFeedbackState>(initialState);
  const [isPending, startTransition] = useTransition();

  const selectedAsset = useMemo(
    () => mediaAssets.find((asset) => asset.id === selectedMediaAssetId) ?? null,
    [mediaAssets, selectedMediaAssetId]
  );

  function handleSetImage(formData: FormData): void {
    startTransition(async () => {
      const result = await setCategoryImageAction(initialState, formData);
      setFeedbackState(result);

      if (result.status === "success") {
        setDisplayedImageUrl(selectedAsset?.previewUrl ?? null);
        router.refresh();
      }
    });
  }

  function handleDeleteImage(formData: FormData): void {
    startTransition(async () => {
      const result = await deleteCategoryImageAction(initialState, formData);
      setFeedbackState(result);

      if (result.status === "success") {
        setSelectedMediaAssetId("");
        setDisplayedImageUrl(null);
        router.refresh();
      }
    });
  }

  return (
    <div className="grid gap-4">
      {displayedImageUrl ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <Image
            alt={categoryName}
            className="aspect-video w-full object-cover"
            src={displayedImageUrl}
            width={800}
            height={450}
          />
        </div>
      ) : (
        <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 text-center text-sm text-muted-foreground">
          {CATEGORY_IMAGE_FORM_COPY.emptyImageLabel}
        </div>
      )}

      <AdminFormMessage
        tone={feedbackState.status === "error" ? "error" : "success"}
        message={feedbackState.status === "idle" ? null : feedbackState.message}
      />

      <form action={handleSetImage} className="grid gap-4">
        <input name="categoryId" type="hidden" value={categoryId} />

        <AdminFormField
          htmlFor="cat-image-media-asset"
          label={CATEGORY_IMAGE_FORM_COPY.mediaFieldLabel}
        >
          <AdminSelectField
            id="cat-image-media-asset"
            name="mediaAssetId"
            value={selectedMediaAssetId}
            onChange={(event) => setSelectedMediaAssetId(event.target.value)}
          >
            <option value="">{CATEGORY_IMAGE_FORM_COPY.emptyMediaOptionLabel}</option>
            {mediaAssets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.originalName} · {asset.mimeType}
              </option>
            ))}
          </AdminSelectField>
        </AdminFormField>

        <AdminFormActions>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? CATEGORY_IMAGE_FORM_COPY.setImagePendingLabel
              : CATEGORY_IMAGE_FORM_COPY.setImageSubmitLabel}
          </Button>
        </AdminFormActions>
      </form>

      {selectedMediaAssetId ? (
        <form action={handleDeleteImage}>
          <input name="categoryId" type="hidden" value={categoryId} />
          <Button
            className="w-fit px-0 text-destructive hover:text-destructive"
            size="sm"
            type="submit"
            variant="ghost"
            disabled={isPending}
          >
            {isPending
              ? CATEGORY_IMAGE_FORM_COPY.deleteImagePendingLabel
              : CATEGORY_IMAGE_FORM_COPY.deleteImageSubmitLabel}
          </Button>
        </form>
      ) : null}
    </div>
  );
}
