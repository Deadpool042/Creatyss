"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { AdminSplitListPane } from "@/components/admin/layout/admin-split-list-pane";
import { AdminSplitListItem } from "@/components/admin/layout/admin-split-list-item";
import { AdminPanelListControls } from "@/components/admin/layout/admin-panel-list-controls";
import type { AdminOrderSummary } from "@/features/admin/commerce/orders/types/order-detail-types";
import {
  getOrderStatusLabel,
  getPaymentStatusLabel,
} from "@/entities/order/order-status-presentation";
import {
  getOrderStatusBadgeVariant,
} from "@/features/admin/commerce/orders/config/order-ui.config";
import { ORDER_STATUS_FILTERS } from "@/features/admin/commerce/orders/config/order-list.config";
import {
  ADMIN_ORDERS_LIST_PATH,
  getAdminOrderDetailPath,
  withAdminOrderListParams,
} from "@/features/admin/commerce/orders/shared/admin-orders-routes";
import { useRevealActiveOrderRow } from "../list/use-reveal-active-order-row";

const compactDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
});

type OrdersPanelListProps = {
  orders: readonly AdminOrderSummary[];
};

export function OrdersPanelList({ orders }: OrdersPanelListProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeSlug = pathname.startsWith(`${ADMIN_ORDERS_LIST_PATH}/`)
    ? pathname.slice(ADMIN_ORDERS_LIST_PATH.length + 1) || null
    : null;

  useRevealActiveOrderRow({ activeSlug });

  const controls = (
    <AdminPanelListControls
      listPath={ADMIN_ORDERS_LIST_PATH}
      searchPlaceholder="Référence, client…"
      statusOptions={ORDER_STATUS_FILTERS.map((status) => ({
        value: status,
        label: getOrderStatusLabel(status),
      }))}
      allStatusLabel="Tous les statuts"
      density="compact"
      filterAriaLabel="Filtrer les commandes"
    />
  );

  const emptyState = (
    <li className="px-3 py-6 text-center text-sm text-muted-foreground">
      Aucune commande trouvée.
    </li>
  );

  return (
    <AdminSplitListPane
      title="Commandes"
      resultCount={orders.length}
      controls={controls}
      isEmpty={orders.length === 0}
      emptyState={<ul>{emptyState}</ul>}
    >
      <ul className="px-1.5 py-2">
        {orders.map((order) => {
          const detailHref = getAdminOrderDetailPath(order.id);
          const isActive = pathname === detailHref;
          const href = withAdminOrderListParams(
            isActive ? ADMIN_ORDERS_LIST_PATH : detailHref,
            searchParams
          );

          return (
            <li
              key={order.id}
              className="border-b border-surface-border py-px last:border-b-0"
            >
              <AdminSplitListItem
                href={href}
                active={isActive}
                data-order-row={order.id}
                className="flex min-h-28 flex-col justify-center gap-3 rounded-r-[1rem] rounded-l-sm"
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
                  <Badge
                    variant={getOrderStatusBadgeVariant(order.status)}
                    className="px-1.5 py-0 text-[10px] font-medium"
                  >
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-xs italic tracking-widest text-text-muted-soft">
                    {order.lineCount} article{order.lineCount > 1 ? "s" : ""}
                  </span>
                  <span className="shrink-0 text-base font-semibold text-page-foreground">
                    {order.totalAmount}
                  </span>
                </div>
              </AdminSplitListItem>
            </li>
          );
        })}
      </ul>
    </AdminSplitListPane>
  );
}
