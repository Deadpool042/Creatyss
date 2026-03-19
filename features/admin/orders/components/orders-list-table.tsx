"use client";

import type { SortingState } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import type { AdminOrderSummary } from "@/db/repositories/order.repository";
import type { OrderStatus } from "@/entities/order/order-status-transition";
import { getOrderStatusLabel } from "@/entities/order/order-status-presentation";
import { orderColumns } from "./order-columns";

type OrdersListTableProps = {
  orders: AdminOrderSummary[];
};

const ORDER_INITIAL_SORTING: SortingState = [{ id: "createdAt", desc: true }];
const ALL_STATUSES_VALUE = "all";
const ORDER_STATUS_FILTERS = [
  "pending",
  "paid",
  "preparing",
  "shipped",
  "cancelled",
] as const satisfies readonly OrderStatus[];

export function OrdersListTable({ orders }: OrdersListTableProps) {
  return (
    <DataTable
      columns={orderColumns}
      data={orders}
      filterColumn="reference"
      filterPlaceholder="Chercher par référence, cliente ou email..."
      initialSorting={ORDER_INITIAL_SORTING}
      renderToolbar={(table) => {
        const statusColumn = table.getColumn("status");
        const currentValue =
          (statusColumn?.getFilterValue() as string | undefined) ?? ALL_STATUSES_VALUE;

        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Statut</span>
            <Select
              value={currentValue}
              onValueChange={(value) =>
                statusColumn?.setFilterValue(value === ALL_STATUSES_VALUE ? undefined : value)
              }
            >
              <SelectTrigger className="w-56" size="sm">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value={ALL_STATUSES_VALUE}>Tous les statuts</SelectItem>
                {ORDER_STATUS_FILTERS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {getOrderStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      }}
    />
  );
}
