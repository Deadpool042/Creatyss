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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminOrderSummary } from "@/features/admin/orders/types/order-detail-types";
import { updateOrderStatusAction } from "@/features/admin/orders/actions";

type OrderRowActionsProps = {
  order: AdminOrderSummary;
};

export function OrderRowActions({ order }: OrderRowActionsProps) {
  const preparingFormRef = useRef<HTMLFormElement>(null);
  const cancelFormRef = useRef<HTMLFormElement>(null);

  const canPrepare = order.status === "paid";
  const canCancel = ["pending", "paid", "preparing"].includes(order.status);

  return (
    <>
      <form ref={preparingFormRef} action={updateOrderStatusAction}>
        <input type="hidden" name="orderId" value={order.id} />
        <input type="hidden" name="nextStatus" value="preparing" />
      </form>
      <form ref={cancelFormRef} action={updateOrderStatusAction}>
        <input type="hidden" name="orderId" value={order.id} />
        <input type="hidden" name="nextStatus" value="cancelled" />
      </form>

      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              className="text-text-muted-strong data-[state=open]:border-control-border-strong data-[state=open]:bg-control-surface-selected data-[state=open]:text-foreground"
            >
              <MoreHorizontalIcon className="size-4" />
              <span className="sr-only">Actions commande {order.reference}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/orders/${order.id}`}>Voir le détail</Link>
            </DropdownMenuItem>

            {canPrepare ? (
              <DropdownMenuItem onClick={() => preparingFormRef.current?.requestSubmit()}>
                Marquer en préparation
              </DropdownMenuItem>
            ) : null}

            {canCancel ? (
              <>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                    Annuler la commande
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la commande {order.reference} ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La commande sera annulée et le stock des articles sera
              rétabli automatiquement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Garder la commande</AlertDialogCancel>
            <AlertDialogAction
              className="border-feedback-error-border bg-feedback-error-surface text-destructive hover:bg-feedback-error-surface-strong"
              onClick={() => cancelFormRef.current?.requestSubmit()}
            >
              Annuler la commande
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
