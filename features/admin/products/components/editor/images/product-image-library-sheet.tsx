"use client";

import { useMemo, useState, useTransition, type JSX } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AttachableMediaAssetItem } from "@/features/admin/products/editor/types";
import { ProductImageLibraryPicker } from "./product-image-library-picker";

type ProductImageLibrarySheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: AttachableMediaAssetItem[];
  onAttach?: (mediaAssetIds: string[]) => Promise<{ status: "success" | "error"; message: string }>;
};

export function ProductImageLibrarySheet({
  open,
  onOpenChange,
  items,
  onAttach,
}: ProductImageLibrarySheetProps): JSX.Element {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (normalizedSearch.length === 0) {
      return items;
    }

    return items.filter((item) => {
      const haystack = [
        item.originalFilename ?? "",
        item.altText ?? "",
        item.publicUrl,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [items, search]);

  function toggleItem(id: string): void {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  }

  function handleAttach(): void {
    if (!onAttach || selectedIds.length === 0) {
      return;
    }

    startTransition(async () => {
      const result = await onAttach(selectedIds);
      setMessage(result.message);

      if (result.status === "success") {
        setSelectedIds([]);
        onOpenChange(false);
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-5xl">
        <SheetHeader className="border-b px-6 py-4 text-left">
          <SheetTitle>Médiathèque</SheetTitle>
          <SheetDescription>
            Sélectionne un ou plusieurs médias existants à rattacher à la galerie produit.
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 px-6 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un média…"
              className="sm:max-w-sm"
            />

            <div className="text-sm text-muted-foreground">
              {selectedIds.length} sélection{selectedIds.length > 1 ? "s" : ""}
            </div>
          </div>

          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

          <div className="min-h-0 flex-1 overflow-y-auto">
            <ProductImageLibraryPicker
              items={filteredItems}
              selectedIds={selectedIds}
              onToggle={toggleItem}
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>

            <Button
              type="button"
              disabled={!onAttach || selectedIds.length === 0 || isPending}
              onClick={handleAttach}
            >
              {isPending ? "Association…" : "Associer les médias"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
