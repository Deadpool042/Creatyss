"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { AdminSortableTableHead } from "@/components/admin/tables/head/admin-sortable-table-head";
import { AdminTableIdentityStack } from "@/components/admin/tables/layout/admin-table-identity-stack";
import { ADMIN_TABLE_HEAD_CLASSNAME } from "@/components/admin/tables/styles/admin-table-head.styles";
import {
  CUSTOMER_EMAIL_CONSENT_LABEL,
  type CustomerSortOption,
  CUSTOMER_STATUS_LABELS,
  getCustomerDisplayInitial,
  getCustomerEmailOptInLabel,
  getCustomerFullName,
} from "@/entities/customer";
import { ADMIN_ORDERS_LIST_PATH } from "@/features/admin/commerce/orders/shared/admin-orders-routes";
import type { AdminCustomerSummary } from "@/features/admin/customers/types/admin-customer.types";
import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
});

const statusClassNames = {
  LEAD: "bg-surface-subtle text-muted-foreground",
  ACTIVE: "bg-feedback-success-surface/75 text-feedback-success-foreground",
  INACTIVE: "bg-surface-subtle text-muted-foreground/70",
  BLOCKED: "bg-feedback-danger-surface/75 text-feedback-danger-foreground",
  ARCHIVED: "bg-surface-subtle text-muted-foreground/60",
} as const;

const CUSTOMER_SORTABLE_COLUMNS = {
  identity: {
    label: "Client",
    asc: "name-asc",
    desc: "name-desc",
    className: "min-w-64",
  },
  status: {
    label: "Statut",
    asc: "status-asc",
    desc: "status-desc",
    className: "w-28",
  },
  orders: {
    label: "Commandes",
    asc: "orders-asc",
    desc: "orders-desc",
    className: "w-32",
  },
  acceptsEmail: {
    label: CUSTOMER_EMAIL_CONSENT_LABEL,
    asc: "email-opt-in-asc",
    desc: "email-opt-in-desc",
    className: "w-28",
  },
  createdAt: {
    label: "Cree le",
    asc: "created-asc",
    desc: "created-desc",
    className: "w-28",
  },
  lastSeenAt: {
    label: "Derniere activite",
    asc: "last-seen-asc",
    desc: "last-seen-desc",
    className: "w-32",
  },
} as const satisfies Record<string, import("@/components/admin/tables/head/admin-sortable-table-head").SortableColumnConfig<CustomerSortOption>>;

function renderDate(value: string | null): string {
  if (value === null) {
    return "—";
  }

  return dateFormatter.format(new Date(value));
}

type CustomerTableDesktopColumnsInput = Readonly<{
  sort: CustomerSortOption;
  onSortChange: (sort: CustomerSortOption) => void;
}>;

export function createCustomerTableDesktopColumns({
  sort,
  onSortChange,
}: CustomerTableDesktopColumnsInput): ColumnDef<AdminCustomerSummary>[] {
  return [
    {
      id: "identity",
      header: () => (
        <AdminSortableTableHead
          column={CUSTOMER_SORTABLE_COLUMNS.identity}
          currentSort={sort}
          onSort={onSortChange}
        />
      ),
      cell: ({ row }) => {
        const customer = row.original;
        const fullName = getCustomerFullName(customer);

        return (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-surface-border/60 bg-surface-subtle text-[13px] font-semibold text-muted-foreground">
              {getCustomerDisplayInitial(customer)}
            </div>

            <AdminTableIdentityStack
              title={fullName ?? <span className="text-muted-foreground/70">Sans nom</span>}
              titleClassName="line-clamp-1 leading-snug"
              caption={<p className="mt-1 truncate text-xs text-muted-foreground">{customer.email}</p>}
            />
          </div>
        );
      },
      meta: {
        headerClassName: `${ADMIN_TABLE_HEAD_CLASSNAME} min-w-64`,
        cellClassName: "px-4 py-3 align-middle",
      },
    },
    {
      id: "status",
      header: () => (
        <AdminSortableTableHead
          column={CUSTOMER_SORTABLE_COLUMNS.status}
          currentSort={sort}
          onSort={onSortChange}
        />
      ),
      cell: ({ row }) => (
        <span
          className={cn(
            "inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium",
            statusClassNames[row.original.status]
          )}
        >
          {CUSTOMER_STATUS_LABELS[row.original.status]}
        </span>
      ),
      meta: {
        headerClassName: `${ADMIN_TABLE_HEAD_CLASSNAME} w-28`,
        cellClassName: "px-4 py-3 align-middle",
      },
    },
    {
      id: "orders",
      header: () => (
        <AdminSortableTableHead
          column={CUSTOMER_SORTABLE_COLUMNS.orders}
          currentSort={sort}
          onSort={onSortChange}
        />
      ),
      cell: ({ row }) => {
        const { email, ordersCount } = row.original;

        if (ordersCount === 0) {
          return <span className="text-[13px] text-muted-foreground/60">Aucune</span>;
        }

        return (
          <Link
            className="text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            href={`${ADMIN_ORDERS_LIST_PATH}?search=${encodeURIComponent(email)}`}
          >
            {ordersCount} commande{ordersCount > 1 ? "s" : ""}
          </Link>
        );
      },
      meta: {
        headerClassName: `${ADMIN_TABLE_HEAD_CLASSNAME} w-32`,
        cellClassName: "px-4 py-3 align-middle",
        stopRowClick: true,
      },
    },
    {
      id: "acceptsEmail",
      header: () => (
        <AdminSortableTableHead
          column={CUSTOMER_SORTABLE_COLUMNS.acceptsEmail}
          currentSort={sort}
          onSort={onSortChange}
        />
      ),
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground">{getCustomerEmailOptInLabel(row.original.acceptsEmail)}</span>
      ),
      meta: {
        headerClassName: `${ADMIN_TABLE_HEAD_CLASSNAME} w-28`,
        cellClassName: "px-4 py-3 align-middle",
      },
    },
    {
      id: "createdAt",
      header: () => (
        <AdminSortableTableHead
          column={CUSTOMER_SORTABLE_COLUMNS.createdAt}
          currentSort={sort}
          onSort={onSortChange}
        />
      ),
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground">{renderDate(row.original.createdAt)}</span>
      ),
      meta: {
        headerClassName: `hidden xl:table-cell ${ADMIN_TABLE_HEAD_CLASSNAME} w-28`,
        cellClassName: "hidden xl:table-cell px-4 py-3 align-middle",
      },
    },
    {
      id: "lastSeenAt",
      header: () => (
        <AdminSortableTableHead
          column={CUSTOMER_SORTABLE_COLUMNS.lastSeenAt}
          currentSort={sort}
          onSort={onSortChange}
        />
      ),
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground">
          {renderDate(row.original.lastSeenAt)}
        </span>
      ),
      meta: {
        headerClassName: `hidden xl:table-cell ${ADMIN_TABLE_HEAD_CLASSNAME} w-32`,
        cellClassName: "hidden xl:table-cell px-4 py-3 align-middle",
      },
    },
  ];
}
