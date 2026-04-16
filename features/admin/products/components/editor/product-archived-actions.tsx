"use client";

import type { JSX } from "react";
import { RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useArchivedProductMutations } from "./use-archived-product-mutations";

type ProductArchivedActionsProps = {
  productSlug: string;
};

export function ProductArchivedActions({ productSlug }: ProductArchivedActionsProps): JSX.Element {
  const { isPending, handleRestore, handlePermanentDelete } = useArchivedProductMutations({
    productSlug,
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" onClick={handleRestore} disabled={isPending}>
        <RotateCcw className="mr-2 h-4 w-4" />
        {isPending ? "Traitement…" : "Restaurer"}
      </Button>

      <Button
        type="button"
        variant="destructive"
        onClick={handlePermanentDelete}
        disabled={isPending}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {isPending ? "Suppression…" : "Supprimer définitivement"}
      </Button>
    </div>
  );
}
