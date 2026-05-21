"use client";

import { useTransition, type JSX } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDestructiveDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/shared/feedback";
import { archiveCategoryAction } from "@/features/admin/categories/actions";
import {
  CATEGORY_ARCHIVE_ACTIONS_COPY,
  CATEGORY_ARCHIVE_DIALOG_COPY,
  CATEGORY_LIST_FEEDBACK_COPY,
} from "@/features/admin/categories/config";
import { ADMIN_CATEGORIES_LIST_PATH } from "@/features/admin/categories/shared/admin-categories-routes";

type CategoryArchiveButtonProps = Readonly<{
  categoryId: string;
  categoryName: string;
}>;

export function CategoryArchiveButton({
  categoryId,
  categoryName,
}: CategoryArchiveButtonProps): JSX.Element {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleConfirm(): Promise<boolean> {
    return new Promise((resolve) => {
      startTransition(async () => {
        const result = await archiveCategoryAction({ categoryId });

        if (result.success) {
          toast.success(`"${categoryName}" ${CATEGORY_ARCHIVE_ACTIONS_COPY.archiveSuccessSuffix}`);
          router.push(`${ADMIN_CATEGORIES_LIST_PATH}?status=deleted`);
          router.refresh();
          resolve(true);
          return;
        }

        toast.error(CATEGORY_ARCHIVE_ACTIONS_COPY.archiveErrorTitle, {
          description: CATEGORY_LIST_FEEDBACK_COPY.errorDescription,
        });
        resolve(false);
      });
    });
  }

  return (
    <ConfirmDestructiveDialog
      trigger={
        <Button type="button" variant="destructive">
          {CATEGORY_ARCHIVE_DIALOG_COPY.triggerLabel}
        </Button>
      }
      title={CATEGORY_ARCHIVE_DIALOG_COPY.title(categoryName)}
      description={CATEGORY_ARCHIVE_DIALOG_COPY.description}
      confirmLabel={CATEGORY_ARCHIVE_DIALOG_COPY.confirmLabel}
      pendingLabel={CATEGORY_ARCHIVE_DIALOG_COPY.pendingLabel}
      pending={isPending}
      onConfirm={handleConfirm}
    />
  );
}
