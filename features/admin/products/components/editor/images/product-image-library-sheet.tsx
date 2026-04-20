"use client";

import { useMemo, useState, useTransition, type JSX } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      const haystack = [item.originalFilename ?? "", item.altText ?? "", item.publicUrl]
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-4xl overflow-hidden">
        <div className="flex max-h-[85dvh] flex-col">
          <DialogHeader className="border-b px-6 py-4 text-left">
            <DialogTitle>Médiathèque</DialogTitle>
            <DialogDescription>
              Sélectionne un ou plusieurs médias déjà présents dans ta médiathèque pour les ajouter à
              la galerie du produit.
            </DialogDescription>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-6 py-4">
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
          </div>

          <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>

            <Button
              type="button"
              disabled={!onAttach || selectedIds.length === 0 || isPending}
              onClick={handleAttach}
            >
              {isPending ? "Ajout en cours…" : "Ajouter à la galerie"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
