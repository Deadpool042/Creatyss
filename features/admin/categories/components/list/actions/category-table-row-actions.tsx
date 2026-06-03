"use client";

import { useTransition } from "react";
import { Archive, ArchiveRestore, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { AdminRowActionsMenu } from "@/components/admin/tables/actions/admin-row-actions-menu";
import { ConfirmDestructiveDialog } from "@/components/shared";
import {
  archiveCategoryAction,
  hardDeleteCategoryAction,
  restoreCategoryAction,
} from "@/features/admin/categories/actions";
import {
  CATEGORY_LIST_FEEDBACK_COPY,
  CATEGORY_ROW_ACTIONS_COPY,
} from "@/features/admin/categories/config";
import type { AdminCategoryStatus } from "@/features/admin/categories/types";
import {
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getAdminCategoryDetailPath } from "../../../shared";

type CategoryTableRowActionsProps = Readonly<{
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  status: AdminCategoryStatus;
}>;

type CategoryRowActionMutations = {
  isPending: boolean;
  handleArchive: () => void;
  handleRestore: () => void;
  handleHardDelete: () => Promise<boolean>;
};

function useCategoryRowActionMutations({
  categoryId,
  categoryName,
}: Pick<CategoryTableRowActionsProps, "categoryId" | "categoryName">): CategoryRowActionMutations {
  const [isPending, startTransition] = useTransition();

  function handleArchive() {
    startTransition(async () => {
      const result = await archiveCategoryAction({ categoryId });
      if (result.success) {
        toast.success(`"${categoryName}" ${CATEGORY_LIST_FEEDBACK_COPY.archiveSuccessSuffix}`);
      } else {
        toast.error(CATEGORY_LIST_FEEDBACK_COPY.bulkArchiveErrorTitle, {
          description: CATEGORY_LIST_FEEDBACK_COPY.errorDescription,
        });
      }
    });
  }

  function handleRestore() {
    startTransition(async () => {
      const result = await restoreCategoryAction({ categoryId });
      if (result.success) {
        toast.success(`"${categoryName}" ${CATEGORY_LIST_FEEDBACK_COPY.restoreSuccessSuffix}`);
      } else {
        toast.error(CATEGORY_LIST_FEEDBACK_COPY.restoreErrorTitle, {
          description: CATEGORY_LIST_FEEDBACK_COPY.errorDescription,
        });
      }
    });
  }

  function handleHardDelete(): Promise<boolean> {
    return new Promise((resolve) => {
      startTransition(async () => {
        const result = await hardDeleteCategoryAction({ categoryId });
        if (result.success) {
          toast.success(`"${categoryName}" ${CATEGORY_LIST_FEEDBACK_COPY.hardDeleteSuccessSuffix}`);
          resolve(true);
        } else {
          toast.error(CATEGORY_LIST_FEEDBACK_COPY.hardDeleteErrorTitle, {
            description: CATEGORY_LIST_FEEDBACK_COPY.errorDescription,
          });
          resolve(false);
        }
      });
    });
  }

  return { isPending, handleArchive, handleRestore, handleHardDelete };
}

type ArchivedCategoryRowActionsProps = {
  categoryName: string;
  isPending: boolean;
  onRestore: () => void;
  onHardDelete: () => Promise<boolean>;
};

function ArchivedCategoryRowActions({
  categoryName,
  isPending,
  onRestore,
  onHardDelete,
}: ArchivedCategoryRowActionsProps) {
  return (
    <AdminRowActionsMenu
      label={`${CATEGORY_ROW_ACTIONS_COPY.menuLabelPrefix} ${categoryName}`}
      contentClassName="w-52"
    >
      <DropdownMenuGroup>
        <DropdownMenuItem onClick={onRestore} disabled={isPending} className="gap-2">
          <ArchiveRestore className="h-4 w-4" />
          <span>
            {isPending
              ? CATEGORY_ROW_ACTIONS_COPY.restorePendingLabel
              : CATEGORY_ROW_ACTIONS_COPY.restoreLabel}
          </span>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <ConfirmDestructiveDialog
          trigger={
            <button
              type="button"
              disabled={isPending}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-none transition-colors hover:bg-accent hover:text-destructive focus:bg-accent focus:text-destructive disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              <span>{CATEGORY_ROW_ACTIONS_COPY.hardDeleteLabel}</span>
            </button>
          }
          title={CATEGORY_ROW_ACTIONS_COPY.hardDeleteDialogTitle(categoryName)}
          description={CATEGORY_ROW_ACTIONS_COPY.hardDeleteDialogDescription}
          confirmLabel={CATEGORY_ROW_ACTIONS_COPY.hardDeleteLabel}
          pending={isPending}
          onConfirm={onHardDelete}
        />
      </DropdownMenuGroup>
    </AdminRowActionsMenu>
  );
}

type ActiveCategoryRowActionsProps = {
  categoryName: string;
  categorySlug: string;
  isPending: boolean;
  onArchive: () => void;
};

function ActiveCategoryRowActions({
  categoryName,
  categorySlug,
  isPending,
  onArchive,
}: ActiveCategoryRowActionsProps) {
  const editHref = getAdminCategoryDetailPath(categorySlug);

  return (
    <AdminRowActionsMenu
      label={`${CATEGORY_ROW_ACTIONS_COPY.menuLabelPrefix} ${categoryName}`}
      contentClassName="w-44"
    >
      <DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href={editHref} className="flex items-center gap-2 cursor-pointer">
            <Pencil className="h-4 w-4" />
            <span>{CATEGORY_ROW_ACTIONS_COPY.editLabel}</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={onArchive}
          disabled={isPending}
          className="gap-2 text-muted-foreground focus:text-foreground"
        >
          <Archive className="h-4 w-4" />
          <span>
            {isPending
              ? CATEGORY_ROW_ACTIONS_COPY.archivePendingLabel
              : CATEGORY_ROW_ACTIONS_COPY.archiveLabel}
          </span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </AdminRowActionsMenu>
  );
}

export function CategoryTableRowActions({
  categoryId,
  categoryName,
  categorySlug,
  status,
}: CategoryTableRowActionsProps) {
  const { isPending, handleArchive, handleRestore, handleHardDelete } =
    useCategoryRowActionMutations({ categoryId, categoryName });

  if (status === "archived") {
    return (
      <ArchivedCategoryRowActions
        categoryName={categoryName}
        isPending={isPending}
        onRestore={handleRestore}
        onHardDelete={handleHardDelete}
      />
    );
  }

  return (
    <ActiveCategoryRowActions
      categoryName={categoryName}
      categorySlug={categorySlug}
      isPending={isPending}
      onArchive={handleArchive}
    />
  );
}
