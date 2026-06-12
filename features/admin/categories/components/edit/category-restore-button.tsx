"use client";

import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";
import { useTransition, type JSX } from "react";

import { toast } from "@/components/shared/feedback";
import { Button } from "@/components/ui/button";
import { restoreCategoryAction } from "@/features/admin/categories/actions";
import {
  CATEGORY_LIST_FEEDBACK_COPY,
  CATEGORY_ROW_ACTIONS_COPY,
} from "@/features/admin/categories/config";
import { ADMIN_CATEGORIES_LIST_PATH } from "../../shared";

type CategoryRestoreButtonProps = Readonly<{
  categoryId: string;
  categoryName: string;
}>;

function buildRestoreListHref(searchParams: ReadonlyURLSearchParams): string {
  const params = new URLSearchParams(searchParams.toString());
  params.delete("status");

  const query = params.toString();
  return query ? `${ADMIN_CATEGORIES_LIST_PATH}?${query}` : ADMIN_CATEGORIES_LIST_PATH;
}

export function CategoryRestoreButton({
  categoryId,
  categoryName,
}: CategoryRestoreButtonProps): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleRestore(): void {
    startTransition(async () => {
      const result = await restoreCategoryAction({ categoryId });

      if (result.success) {
        toast.success(`"${categoryName}" ${CATEGORY_LIST_FEEDBACK_COPY.restoreSuccessSuffix}`);
        router.push(buildRestoreListHref(searchParams));
        router.refresh();
        return;
      }

      toast.error(CATEGORY_LIST_FEEDBACK_COPY.restoreErrorTitle, {
        description: CATEGORY_LIST_FEEDBACK_COPY.errorDescription,
      });
    });
  }

  return (
    <Button type="button" onClick={handleRestore} disabled={isPending}>
      {isPending ? CATEGORY_ROW_ACTIONS_COPY.restorePendingLabel : CATEGORY_ROW_ACTIONS_COPY.restoreLabel}
    </Button>
  );
}
