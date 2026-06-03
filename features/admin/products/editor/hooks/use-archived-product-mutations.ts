"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import {
  deleteProductPermanentlyBySlugAction,
  restoreProductBySlugAction,
} from "@/features/admin/products/actions/product-lifecycle-actions";
import {
  ADMIN_PRODUCTS_LIST_PATH,
  ADMIN_PRODUCTS_TRASH_PATH,
} from "@/features/admin/products/navigation";

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
        router.push(ADMIN_PRODUCTS_LIST_PATH);
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
        router.push(ADMIN_PRODUCTS_TRASH_PATH);
      }
    });
  }

  return {
    isPending,
    handleRestore,
    handlePermanentDelete,
  };
}
