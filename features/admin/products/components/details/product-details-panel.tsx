import type { JSX } from "react";

import { ProductStatusBadge } from "../shared/product-status-badge";
import type { AdminProductDisplayStatus } from "@/features/admin/products/details";

type ProductDetailsPanelProps = {
  status: AdminProductDisplayStatus;
  isFeatured: boolean;
};

export function ProductDetailsPanel({
  status,
  isFeatured,
}: ProductDetailsPanelProps): JSX.Element {
  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <ProductStatusBadge status={status} />
        {isFeatured ? (
          <span className="rounded-full border border-border bg-muted px-2 py-1 text-xs text-foreground">
            Mis en avant
          </span>
        ) : null}
      </div>
    </div>
  );
}
