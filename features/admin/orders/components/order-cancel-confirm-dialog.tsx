"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmDestructiveDialog } from "@/components/shared";
import { updateOrderStatusAction } from "@/features/admin/orders/actions";

type OrderCancelConfirmDialogProps = {
  orderId: string;
};

export function OrderCancelConfirmDialog({ orderId }: OrderCancelConfirmDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={updateOrderStatusAction}>
      <input type="hidden" name="orderId" value={orderId} />
      <input type="hidden" name="nextStatus" value="cancelled" />

      <ConfirmDestructiveDialog
        trigger={
          <Button variant="destructive" type="button" size="sm">
            Annuler la commande
          </Button>
        }
        title="Annuler cette commande ?"
        description="Cette action est irréversible. La commande sera annulée et le stock des articles sera rétabli automatiquement."
        confirmLabel="Annuler la commande"
        onConfirm={() => {
          formRef.current?.requestSubmit();
          return true;
        }}
      />
    </form>
  );
}
