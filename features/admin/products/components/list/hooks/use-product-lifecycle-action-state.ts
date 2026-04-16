"use client";

import { useState } from "react";

type ProductLifecycleAction = ((slug: string) => void | Promise<void>) | undefined;

type UseProductLifecycleActionStateInput = {
  productSlug: string;
  onConfirmArchive?: ProductLifecycleAction;
  onConfirmRestore?: ProductLifecycleAction;
  onConfirmPermanentDelete?: ProductLifecycleAction;
};

type UseProductLifecycleActionStateResult = {
  archiveDialogOpen: boolean;
  restoreDialogOpen: boolean;
  permanentDeleteDialogOpen: boolean;
  isSubmitting: boolean;
  setArchiveDialogOpen: (open: boolean) => void;
  setRestoreDialogOpen: (open: boolean) => void;
  setPermanentDeleteDialogOpen: (open: boolean) => void;
  handleArchive: () => Promise<void>;
  handleRestore: () => Promise<void>;
  handlePermanentDelete: () => Promise<void>;
};

async function runProductLifecycleAction(input: {
  action?: ProductLifecycleAction;
  productSlug: string;
  closeDialog: () => void;
  setSubmitting: (value: boolean) => void;
}): Promise<void> {
  if (!input.action) {
    input.closeDialog();
    return;
  }

  try {
    input.setSubmitting(true);
    await input.action(input.productSlug);
    input.closeDialog();
  } finally {
    input.setSubmitting(false);
  }
}

export function useProductLifecycleActionState({
  productSlug,
  onConfirmArchive,
  onConfirmRestore,
  onConfirmPermanentDelete,
}: UseProductLifecycleActionStateInput): UseProductLifecycleActionStateResult {
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [permanentDeleteDialogOpen, setPermanentDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleArchive(): Promise<void> {
    await runProductLifecycleAction({
      action: onConfirmArchive,
      productSlug,
      closeDialog: () => setArchiveDialogOpen(false),
      setSubmitting: setIsSubmitting,
    });
  }

  async function handleRestore(): Promise<void> {
    await runProductLifecycleAction({
      action: onConfirmRestore,
      productSlug,
      closeDialog: () => setRestoreDialogOpen(false),
      setSubmitting: setIsSubmitting,
    });
  }

  async function handlePermanentDelete(): Promise<void> {
    await runProductLifecycleAction({
      action: onConfirmPermanentDelete,
      productSlug,
      closeDialog: () => setPermanentDeleteDialogOpen(false),
      setSubmitting: setIsSubmitting,
    });
  }

  return {
    archiveDialogOpen,
    restoreDialogOpen,
    permanentDeleteDialogOpen,
    isSubmitting,
    setArchiveDialogOpen,
    setRestoreDialogOpen,
    setPermanentDeleteDialogOpen,
    handleArchive,
    handleRestore,
    handlePermanentDelete,
  };
}
