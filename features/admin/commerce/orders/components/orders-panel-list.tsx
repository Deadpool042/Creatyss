"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminOrderSummary } from "@/features/admin/commerce/orders/types/order-detail-types";
import {
  getOrderStatusLabel,
  getPaymentStatusLabel,
} from "@/entities/order/order-status-presentation";
import { cn } from "@/lib/utils";
import {
  getOrderStatusBadgeVariant,
  getPaymentStatusBadgeVariant,
} from "@/features/admin/commerce/orders/config/order-ui.config";
import { ORDER_STATUS_FILTERS } from "@/features/admin/commerce/orders/config/order-list.config";
import {
  ADMIN_ORDERS_LIST_PATH,
  getAdminOrderDetailPath,
  withAdminOrderListParams,
} from "@/features/admin/commerce/orders/shared/admin-orders-routes";
import { buildAdminFilterHref } from "@/components/admin/layout/admin-build-filter-href";

const compactDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
});

type OrdersPanelListProps = {
  orders: readonly AdminOrderSummary[];
};

export function OrdersPanelList({ orders }: OrdersPanelListProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 space-y-3 border-b border-surface-border px-3 py-3">
        <div className="grid gap-2">
          <form action={ADMIN_ORDERS_LIST_PATH} method="GET">
            {currentStatus && (
              <input type="hidden" name="status" value={currentStatus} />
            )}
            <Input
              name="search"
              placeholder="Référence, client…"
              defaultValue={currentSearch}
              className="h-9 text-sm"
            />
          </form>

          <Select
            value={currentStatus || "all"}
            onValueChange={(value) => {
              const nextStatus = value === "all" ? null : value;
              const params: { search?: string; status?: string } = {};
              if (currentSearch) params.search = currentSearch;
              if (nextStatus) params.status = nextStatus;
              const nextUrl = buildAdminFilterHref(ADMIN_ORDERS_LIST_PATH, params);
              router.replace(nextUrl, { scroll: false });
            }}
          >
            <SelectTrigger size="default" className="w-full">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {ORDER_STATUS_FILTERS.map((status) => (
                <SelectItem key={status} value={status}>
                  {getOrderStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2 sm:grid-cols-1">
          <div className="rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted-soft">
              Affichées
            </p>
            <p className="mt-1 text-lg font-semibold text-foreground">{orders.length}</p>
          </div>
        </div>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto">
        {orders.map((order) => {
          const detailHref = getAdminOrderDetailPath(order.id);
          const isActive = pathname === detailHref;
          const href = withAdminOrderListParams(
            isActive ? ADMIN_ORDERS_LIST_PATH : detailHref,
            searchParams
          );

          return (
            <li key={order.id} className="border-b border-surface-border last:border-b-0">
              <Link
                href={href}
                className={cn(
                  "flex min-h-[112px] flex-col justify-center gap-3 px-3 py-3 transition-colors",
                  isActive
                    ? "border-l-2 border-l-primary bg-interactive-selected"
                    : "hover:bg-interactive-hover"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid gap-1">
                    <span className="truncate text-sm font-semibold text-page-foreground">
                      {order.reference}
                    </span>
                    <span className="truncate text-sm text-muted-foreground">
                      {[order.customerFirstName, order.customerLastName]
                        .filter(Boolean)
                        .join(" ") || order.customerEmail}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {compactDateFormatter.format(new Date(order.createdAt))}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getOrderStatusBadgeVariant(order.status)}>
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                  <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </Badge>
                </div>

                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-xs uppercase tracking-widest text-text-muted-soft">
                    {order.lineCount} article{order.lineCount > 1 ? "s" : ""}
                  </span>
                  <span className="shrink-0 text-base font-semibold text-page-foreground">
                    {order.totalAmount}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}

        {orders.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-muted-foreground">
            Aucune commande trouvée.
          </li>
        )}
      </ul>
    </div>
  );
}
