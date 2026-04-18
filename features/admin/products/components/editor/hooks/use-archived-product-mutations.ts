"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { deleteProductPermanentlyBySlugAction } from "@/features/admin/products/shared/actions/delete-product-permanently.action";
import { restoreProductBySlugAction } from "@/features/admin/products/shared/actions/restore-product.action";

type UseArchivedProductMutationsInput = {
  productSlug: string;
};

type UseArchivedProductMutationsResult = {
  isPending: boolean;
  handleRestore: () => void;
  handlePermanentDelete: () => void;
};

export function useArchivedProductMutations({
  productSlug,
}: UseArchivedProductMutationsInput): UseArchivedProductMutationsResult {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleRestore(): void {
    startTransition(async () => {
      const result = await restoreProductBySlugAction(productSlug);

      if (result.status === "success") {
        router.push("/admin/products");
        router.refresh();
      }
    });
  }

  function handlePermanentDelete(): void {
    const confirmed = window.confirm(
      "Cette action est irréversible. Supprimer définitivement ce produit ?"
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result = await deleteProductPermanentlyBySlugAction({
        productSlug,
      });

      if (result.status === "success") {
        router.push("/admin/products?view=trash");
        router.refresh();
      }
    });
  }

  return {
    isPending,
    handleRestore,
    handlePermanentDelete,
  };
}
