"use client";

import { useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Archive } from "lucide-react";

import { CustomButton } from "@/components/shared";
import { deleteProductAction } from "@/features/admin/products/editor/public";

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
