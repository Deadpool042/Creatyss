"use client";

import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { CustomLink } from "@/components/shared";
import {
  CATEGORY_LIST_COPY,
  CATEGORY_LIST_EMPTY_STATE_COPY,
} from "@/features/admin/categories/config";
import {
  ADMIN_CATEGORIES_LIST_PATH,
  ADMIN_CATEGORIES_NEW_PATH,
} from "@/features/admin/categories/shared/admin-categories-routes";

type CategoryTableEmptyStateProps = {
  isFiltered: boolean;
};

export function CategoryTableEmptyState({ isFiltered }: CategoryTableEmptyStateProps) {
  if (isFiltered) {
    return (
      <AdminEmptyState
        eyebrow={CATEGORY_LIST_EMPTY_STATE_COPY.filtered.eyebrow}
        title={CATEGORY_LIST_EMPTY_STATE_COPY.filtered.title}
        description={CATEGORY_LIST_EMPTY_STATE_COPY.filtered.description}
        actionNode={
          <CustomLink
            href={ADMIN_CATEGORIES_LIST_PATH}
            variant="navUnderline"
            className="text-brand"
          >
            {CATEGORY_LIST_COPY.resetFiltersLabel}
          </CustomLink>
        }
      />
    );
  }

  return (
    <AdminEmptyState
      description={CATEGORY_LIST_EMPTY_STATE_COPY.initial.description}
      eyebrow={CATEGORY_LIST_EMPTY_STATE_COPY.initial.eyebrow}
      title={CATEGORY_LIST_EMPTY_STATE_COPY.initial.title}
      actionNode={
        <CustomLink href={ADMIN_CATEGORIES_NEW_PATH} variant="navUnderline" className="text-brand">
          {CATEGORY_LIST_EMPTY_STATE_COPY.initial.ctaLabel}
        </CustomLink>
      }
    />
  );
}
