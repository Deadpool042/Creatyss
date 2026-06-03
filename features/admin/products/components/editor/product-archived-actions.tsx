"use client";

import { useTransition, type JSX, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, RotateCcw, Trash2 } from "lucide-react";

import { CustomButton } from "@/components/shared";
import { ADMIN_PRODUCTS_LIST_PATH } from "@/features/admin/products/navigation";
import { useArchivedProductMutations } from "@/features/admin/products/editor/hooks";
import type {
  DeleteProductInput,
  DeleteProductResult,
} from "@/features/admin/products/editor/types";

type ProductArchivedActionsProps = {
  productSlug: string;
};

type DeleteProductButtonProps = {
  productId: string;
  onDelete: (input: DeleteProductInput) => Promise<DeleteProductResult>;
  trigger?: ReactNode;
  redirectTo?: string;
};

export function ProductArchivedBanner(): JSX.Element {
  return (
    <div className="rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-4 text-amber-950 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-amber-100 p-2">
          <ArchiveRestore className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold">Produit dans la corbeille</p>
          <p className="mt-1 text-sm text-amber-900/85">
            Ce produit est archivé. Vous pouvez le restaurer ou le supprimer définitivement.
          </p>
        </div>
      </div>
    </div>
  );
}

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

export function DeleteProductButton({
  productId,
  onDelete,
  trigger,
  redirectTo = ADMIN_PRODUCTS_LIST_PATH,
}: DeleteProductButtonProps): JSX.Element {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete(): void {
    startTransition(async () => {
      const result = await onDelete({ productId });

      if (result.status === "success") {
        router.push(redirectTo);
      }
    });
  }

  if (trigger) {
    return (
      <button type="button" disabled={isPending} onClick={handleDelete}>
        {trigger}
      </button>
    );
  }

  return (
    <CustomButton
      type="button"
      variant="outline"
      size="sm"
      loading={isPending}
      leadingIcon={<Archive className="h-4 w-4" />}
      onClick={handleDelete}
    >
      {isPending ? "Déplacement…" : "Mettre à la corbeille"}
    </CustomButton>
  );
}
