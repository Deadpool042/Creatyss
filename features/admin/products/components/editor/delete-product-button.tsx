"use client";

import { useTransition, type ReactNode } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/features/admin/products/editor/public";

type DeleteProductButtonProps = {
  productId: string;
  trigger?: ReactNode;
  onDelete?: (input: { productId: string }) => Promise<{ status: "success" | "error"; message: string }>;
};

export function DeleteProductButton({
  productId,
  trigger,
  onDelete = deleteProductAction,
}: DeleteProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(): void {
    startTransition(async () => {
      await onDelete({ productId });
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
    <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleDelete}>
      <Trash2 className="mr-2 h-4 w-4" />
      Supprimer
    </Button>
  );
}
