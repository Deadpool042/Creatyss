"use client";

import { useRef } from "react";
import Link from "next/link";
import { MoreHorizontalIcon } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { AdminProductSummary } from "@/db/repositories/admin-product.repository";
import { getProductPublishability } from "@/entities/product/product-publishability";
import {
  toggleProductStatusAction,
  deleteProductAction
} from "@/features/admin/products/actions";

type ProductRowActionsProps = {
  product: AdminProductSummary;
};

export function ProductRowActions({ product }: ProductRowActionsProps) {
  const toggleFormRef = useRef<HTMLFormElement>(null);
  const deleteFormRef = useRef<HTMLFormElement>(null);

  const toggleLabel =
    product.status === "published" ? "Passer en brouillon" : "Publier";

  const isToggleDisabled =
    product.status === "draft" &&
    !getProductPublishability(product.productType, product.variantCount).ok;

  return (
    <>
      <form
        ref={toggleFormRef}
        action={toggleProductStatusAction}>
        <input
          type="hidden"
          name="productId"
          value={product.id}
        />
      </form>
      <form
        ref={deleteFormRef}
        action={deleteProductAction}>
        <input
          type="hidden"
          name="productId"
          value={product.id}
        />
      </form>

      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8">
              <MoreHorizontalIcon className="size-4" />
              <span className="sr-only">Actions produit {product.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product.id}`}>Modifier</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isToggleDisabled}
              onClick={() => toggleFormRef.current?.requestSubmit()}>
              {toggleLabel}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Supprimer
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer « {product.name} » ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit sera supprimé avec ses
              déclinaisons et ses images.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Conserver le produit</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteFormRef.current?.requestSubmit()}>
              Supprimer le produit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
