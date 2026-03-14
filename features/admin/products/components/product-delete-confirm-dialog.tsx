"use client";

import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/features/admin/products/actions";

type ProductDeleteConfirmDialogProps = {
  productId: string;
};

export function ProductDeleteConfirmDialog({
  productId
}: ProductDeleteConfirmDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={deleteProductAction}>
      <input
        type="hidden"
        name="productId"
        value={productId}
      />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            className="w-full sm:w-fit"
            variant="destructive"
            type="button">
            Supprimer le produit
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit sera supprimé avec ses
              déclinaisons et ses images.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Conserver le produit</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => formRef.current?.requestSubmit()}>
              Supprimer le produit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
