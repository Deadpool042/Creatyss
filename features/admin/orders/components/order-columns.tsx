"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminOrderSummary } from "@/db/repositories/order.repository";
import {
  getOrderStatusLabel,
  getPaymentStatusLabel,
} from "@/entities/order/order-status-presentation";
import { OrderRowActions } from "./order-row-actions";

const orderDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
});

function parseMoneyStringToCents(value: string): number {
  const [major, minor = "00"] = value.split(".");

  return Number.parseInt(major ?? "0", 10) * 100 + Number.parseInt(minor.padEnd(2, "0"), 10);
}

function getOrderStatusBadgeVariant(status: AdminOrderSummary["status"]) {
  if (status === "cancelled") {
    return "destructive" as const;
  }

  if (status === "pending") {
    return "outline" as const;
  }

  return "secondary" as const;
}

function getPaymentStatusBadgeVariant(status: AdminOrderSummary["paymentStatus"]) {
  if (status === "failed") {
    return "destructive" as const;
  }

  if (status === "pending") {
    return "outline" as const;
  }

  return "secondary" as const;
}

function SortableHeader<TData>({
  column,
  title,
}: {
  column: Column<TData, unknown>;
  title: string;
}) {
  const direction = column.getIsSorted();

  return (
    <Button
      className="h-8 px-2 -ml-2 font-semibold text-left text-foreground hover:bg-muted/60"
      size="sm"
      variant="ghost"
      onClick={() => column.toggleSorting(direction === "asc")}
    >
      {title}
      {direction === "asc" ? (
        <ArrowUpIcon className="size-3.5" />
      ) : direction === "desc" ? (
        <ArrowDownIcon className="size-3.5" />
      ) : (
        <ArrowUpDownIcon className="size-3.5 text-muted-foreground" />
      )}
    </Button>
  );
}

export const orderColumns: ColumnDef<AdminOrderSummary>[] = [
  {
    accessorKey: "reference",
    header: ({ column }) => <SortableHeader column={column} title="Commande" />,
    filterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue ?? "")
        .trim()
        .toLowerCase();

      if (!query) {
        return true;
      }

      const { reference, customerFirstName, customerLastName, customerEmail } = row.original;

      return [reference, customerFirstName, customerLastName, customerEmail]
        .join(" ")
        .toLowerCase()
        .includes(query);
    },
    cell: ({ row }) => {
      const order = row.original;

      return (
        <article className="grid min-w-60 gap-1.5 py-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">{order.reference}</h2>
            <Badge variant={getOrderStatusBadgeVariant(order.status)}>
              {getOrderStatusLabel(order.status)}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            {getPaymentStatusLabel(order.paymentStatus)}
          </p>

          <Link
            className="inline-flex items-center text-sm font-medium transition-colors w-fit text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
            href={`/admin/orders/${order.id}`}
          >
            Voir le détail
          </Link>
        </article>
      );
    },
  },
  {
    id: "customer",
    accessorFn: (order) =>
      `${order.customerFirstName} ${order.customerLastName} ${order.customerEmail}`,
    header: ({ column }) => <SortableHeader column={column} title="Client" />,
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="grid min-w-56 gap-1">
          <p className="text-sm font-medium text-foreground">
            {order.customerFirstName} {order.customerLastName}
          </p>
          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column} title="Statut" />,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) {
        return true;
      }

      return row.getValue(columnId) === filterValue;
    },
    cell: ({ row }) => (
      <Badge variant={getOrderStatusBadgeVariant(row.original.status)}>
        {getOrderStatusLabel(row.original.status)}
      </Badge>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => <SortableHeader column={column} title="Paiement" />,
    cell: ({ row }) => (
      <Badge variant={getPaymentStatusBadgeVariant(row.original.paymentStatus)}>
        {getPaymentStatusLabel(row.original.paymentStatus)}
      </Badge>
    ),
  },
  {
    id: "totalAmount",
    accessorFn: (order) => parseMoneyStringToCents(order.totalAmount),
    header: ({ column }) => <SortableHeader column={column} title="Montant" />,
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">{row.original.totalAmount}</span>
    ),
  },
  {
    id: "createdAt",
    accessorFn: (order) => new Date(order.createdAt),
    header: ({ column }) => <SortableHeader column={column} title="Date" />,
    sortingFn: "datetime",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {orderDateFormatter.format(new Date(row.original.createdAt))}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    cell: ({ row }) => <OrderRowActions order={row.original} />,
  },
];
