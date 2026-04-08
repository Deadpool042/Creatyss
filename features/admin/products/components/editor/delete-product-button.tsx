"use client";

import { useTransition, type JSX, type ReactNode } from "react";

import { ConfirmDestructiveDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/features/admin/products/editor/actions";

type DeleteProductButtonProps = {
  productId: string;
  trigger?: ReactNode;
};

export function DeleteProductButton({ productId, trigger }: DeleteProductButtonProps): JSX.Element {
  const [isPending, startTransition] = useTransition();

  return (
    <ConfirmDestructiveDialog
      title="Supprimer ce produit ?"
      description="Cette action est irréversible. Le produit, ses variantes et ses images associées ne seront plus disponibles dans l’administration."
      confirmLabel="Supprimer le produit"
      pending={isPending}
      trigger={
        trigger ?? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Supprimer
          </Button>
        )
      }
      onConfirm={() => {
        startTransition(async () => {
          await deleteProductAction({ productId });
        });

        return false;
      }}
    />
  );
}
