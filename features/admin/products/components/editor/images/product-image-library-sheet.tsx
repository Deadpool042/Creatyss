"use client";

import { useMemo, useState, type JSX } from "react";
import { Images } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type {
  AttachableMediaAssetItem,
  AttachProductImagesResult,
} from "@/features/admin/products/editor/types";
import { ProductImageLibraryPicker } from "./product-image-library-picker";

type ProductImageLibrarySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: AttachableMediaAssetItem[];
  onAttach?: (assetIds: string[]) => Promise<AttachProductImagesResult>;
};

export function ProductImageLibrarySheet({
  open,
  onOpenChange,
  items,
  onAttach,
}: ProductImageLibrarySheetProps): JSX.Element {
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [pending, setPending] = useState(false);

  const selectedCount = selectedAssetIds.length;

  function toggleSelection(assetId: string): void {
    setSelectedAssetIds((current) =>
      current.includes(assetId)
        ? current.filter((entry) => entry !== assetId)
        : [...current, assetId]
    );
  }

  const canSubmit = useMemo(() => {
    return Boolean(onAttach) && selectedAssetIds.length > 0 && !pending;
  }, [onAttach, selectedAssetIds.length, pending]);

  async function handleAttach(): Promise<void> {
    if (!onAttach || selectedAssetIds.length === 0) {
      return;
    }

    setPending(true);
    const result = await onAttach(selectedAssetIds);
    setPending(false);

    if (result.status === "success") {
      setSelectedAssetIds([]);
      onOpenChange(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-4xl">
        <SheetHeader className="shrink-0 border-b px-6 py-4 text-left">
          <SheetTitle>Associer depuis les médias</SheetTitle>
          <SheetDescription>
            Sélectionne un ou plusieurs médias existants pour les associer à la galerie produit.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <ProductImageLibraryPicker
            items={items}
            selectedAssetIds={selectedAssetIds}
            onToggle={toggleSelection}
          />
        </div>

        <div className="shrink-0 border-t px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {selectedCount} média{selectedCount > 1 ? "s" : ""} sélectionné
              {selectedCount > 1 ? "s" : ""}
            </p>

            <div className="flex items-center gap-2">
              <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>

              <Button type="button" onClick={() => void handleAttach()} disabled={!canSubmit}>
                <Images className="mr-2 h-4 w-4" />
                {pending ? "Association…" : "Associer au produit"}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
