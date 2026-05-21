"use client";

import { useState, type ReactNode, type JSX } from "react";

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
import { cn } from "@/lib/utils";

type ConfirmDestructiveDialogProps = {
  trigger: ReactNode;
  title: string;
  description: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  pendingLabel?: string;
  pending?: boolean;
  /** Contrôle l'ouverture depuis le parent (mode contrôlé). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => Promise<boolean> | boolean;
};

export function ConfirmDestructiveDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirmer la suppression",
  cancelLabel = "Annuler",
  pendingLabel = "Suppression…",
  pending = false,
  open,
  onOpenChange,
  onConfirm,
}: ConfirmDestructiveDialogProps): JSX.Element {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  function handleOpenChange(next: boolean) {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }

  async function handleConfirm(): Promise<void> {
    const shouldClose = await onConfirm();
    if (shouldClose) handleOpenChange(false);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild={typeof description !== "string"}>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              void handleConfirm();
            }}
            disabled={pending}
            className={cn(
              "bg-feedback-error text-white",
              "hover:bg-feedback-error/90",
              "focus-visible:ring-feedback-error/50",
              "disabled:bg-feedback-error/50"
            )}
          >
            {pending ? pendingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
