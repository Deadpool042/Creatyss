"use client";

import type { JSX } from "react";
import { RotateCcw, Trash2 } from "lucide-react";

import { CustomButton } from "@/components/shared";
import { useArchivedProductMutations } from "./hooks/use-archived-product-mutations";

type ProductArchivedActionsProps = {
  productSlug: string;
};

export function ProductArchivedActions({ productSlug }: ProductArchivedActionsProps): JSX.Element {
  const { isPending, handleRestore, handlePermanentDelete } = useArchivedProductMutations({
    productSlug,
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <CustomButton
        type="button"
        loading={isPending}
        leadingIcon={<RotateCcw className="h-4 w-4" />}
        onClick={handleRestore}
      >
        {isPending ? "Traitement…" : "Restaurer"}
      </CustomButton>

      <CustomButton
        type="button"
        variant="destructive"
        loading={isPending}
        leadingIcon={<Trash2 className="h-4 w-4" />}
        onClick={handlePermanentDelete}
      >
        {isPending ? "Suppression…" : "Supprimer définitivement"}
      </CustomButton>
    </div>
  );
}
