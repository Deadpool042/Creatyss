"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminOrderSummary } from "@/features/admin/orders/types/order-detail-types";
import type { OrderStatus } from "@/entities/order/order-status-transition";
import {
  getOrderStatusLabel,
} from "@/entities/order/order-status-presentation";
import { cn } from "@/lib/utils";

const compactDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
});

const ALL_STATUSES_VALUE = "all";
const ORDER_STATUS_FILTERS = [
  "pending",
  "paid",
  "preparing",
  "shipped",
  "cancelled",
] as const satisfies readonly OrderStatus[];

function getOrderStatusBadgeVariant(status: AdminOrderSummary["status"]) {
  if (status === "cancelled") return "destructive" as const;
  if (status === "pending") return "outline" as const;
  return "secondary" as const;
}

type OrdersPanelListProps = {
  orders: AdminOrderSummary[];
};

export function OrdersPanelList({ orders }: OrdersPanelListProps) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL_STATUSES_VALUE);

  const filtered = orders.filter((order) => {
    const matchesStatus =
      statusFilter === ALL_STATUSES_VALUE || order.status === statusFilter;

    if (!matchesStatus) return false;

    if (!search.trim()) return true;

    const query = search.trim().toLowerCase();
    return [order.reference, order.customerFirstName, order.customerLastName, order.customerEmail]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 space-y-2 border-b border-surface-border px-3 py-2">
        <Input
          placeholder="Référence, client…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 text-sm"
        />
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="h-8 w-full text-sm" size="sm">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUSES_VALUE}>Tous les statuts</SelectItem>
            {ORDER_STATUS_FILTERS.map((status) => (
              <SelectItem key={status} value={status}>
                {getOrderStatusLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto">
        {filtered.map((order) => {
          const href = `/admin/commerce/orders/${order.id}`;
          const isActive = pathname === href;

          return (
            <li key={order.id} className="border-b border-surface-border last:border-b-0">
              <Link
                href={href}
                className={cn(
                  "flex min-h-[72px] flex-col justify-center gap-1 px-3 py-2 transition-colors",
                  isActive
                    ? "bg-interactive-selected"
                    : "hover:bg-interactive-hover"
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium text-page-foreground">
                    {order.reference}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {compactDateFormatter.format(new Date(order.createdAt))}
                  </span>
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm text-muted-foreground">
                    {order.customerFirstName} {order.customerLastName}
                  </span>
                  <span className="shrink-0 text-sm font-medium text-page-foreground">
                    {order.totalAmount}
                  </span>
                </div>

                <div>
                  <Badge variant={getOrderStatusBadgeVariant(order.status)}>
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                </div>
              </Link>
            </li>
          );
        })}

        {filtered.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-muted-foreground">
            Aucune commande trouvée.
          </li>
        )}
      </ul>
    </div>
  );
}
