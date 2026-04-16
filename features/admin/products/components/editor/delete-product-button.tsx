"use client";

import { useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Archive } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/features/admin/products/editor/public/delete-product.action";

type DeleteProductButtonProps = {
  productId: string;
  trigger?: ReactNode;
  redirectTo?: string;
  onDelete?: (input: {
    productId: string;
  }) => Promise<{ status: "success" | "error"; message: string }>;
};

export function DeleteProductButton({
  productId,
  trigger,
  redirectTo = "/admin/products",
  onDelete = deleteProductAction,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete(): void {
    startTransition(async () => {
      const result = await onDelete({ productId });

      if (result.status === "success") {
        router.push(redirectTo);
        router.refresh();
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
    <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={handleDelete}>
      <Archive className="mr-2 h-4 w-4" />
      {isPending ? "Déplacement…" : "Mettre à la corbeille"}
    </Button>
  );
}
