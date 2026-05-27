"use client";

import type { JSX } from "react";

import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { CustomLink } from "@/components/shared";
import { PRODUCT_LIST_EMPTY_STATE_COPY } from "@/features/admin/products/config";
import type { ProductListView } from "@/features/admin/products/list/types";

type ProductTableEmptyStateProps = Readonly<{
  view: ProductListView;
  isFiltered: boolean;
}>;

export function ProductTableEmptyState({
  view,
  isFiltered,
}: ProductTableEmptyStateProps): JSX.Element {
  if (isFiltered) {
    return (
      <AdminEmptyState
        eyebrow={PRODUCT_LIST_EMPTY_STATE_COPY.filtered.eyebrow}
        title={PRODUCT_LIST_EMPTY_STATE_COPY.filtered.title}
        description={PRODUCT_LIST_EMPTY_STATE_COPY.filtered.description}
        actionNode={
          <CustomLink
            href={view === "trash" ? "/admin/products?view=trash" : "/admin/products"}
            variant="navUnderline"
            className="text-brand"
          >
            {PRODUCT_LIST_EMPTY_STATE_COPY.filtered.resetLabel}
          </CustomLink>
        }
      />
    );
  }

  if (view === "trash") {
    return (
      <AdminEmptyState
        eyebrow={PRODUCT_LIST_EMPTY_STATE_COPY.initial.trash.eyebrow}
        title={PRODUCT_LIST_EMPTY_STATE_COPY.initial.trash.title}
        description={PRODUCT_LIST_EMPTY_STATE_COPY.initial.trash.description}
        actionNode={
          <CustomLink href="/admin/products" variant="navUnderline" className="text-brand">
            {PRODUCT_LIST_EMPTY_STATE_COPY.initial.trash.ctaLabel}
          </CustomLink>
        }
      />
    );
  }

  return (
    <AdminEmptyState
      eyebrow={PRODUCT_LIST_EMPTY_STATE_COPY.initial.active.eyebrow}
      title={PRODUCT_LIST_EMPTY_STATE_COPY.initial.active.title}
      description={PRODUCT_LIST_EMPTY_STATE_COPY.initial.active.description}
      actionNode={
        <CustomLink href="/admin/products/new" variant="navUnderline" className="text-brand">
          {PRODUCT_LIST_EMPTY_STATE_COPY.initial.active.ctaLabel}
        </CustomLink>
      }
    />
  );
}
