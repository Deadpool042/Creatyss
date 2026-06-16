"use client";

import Link from "next/link";
import type { JSX, ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AdminConfigDataTable } from "@/components/admin/tables/admin-config-data-table";
import { AdminConfigDataTableFrame } from "@/components/admin/tables/layout/admin-config-data-table-frame";
import { AdminPaginationBar } from "@/components/admin/tables/layout/admin-pagination-bar";
import { AdminTableIdentityStack } from "@/components/admin/tables/layout/admin-table-identity-stack";
import {
  CUSTOMER_DEFAULT_SORT,
  CUSTOMER_EMAIL_CONSENT_LABEL,
  CUSTOMER_PER_PAGE_OPTIONS,
  CUSTOMER_STATUS_LABELS,
  type CustomerSortOption,
  getCustomerDisplayInitial,
  getCustomerEmailOptInLabel,
  getCustomerFullName,
} from "@/entities/customer";
import { ADMIN_ORDERS_LIST_PATH } from "@/features/admin/commerce/orders/shared/admin-orders-routes";
import { getAdminCustomerDetailPath } from "@/features/admin/customers/shared";
import type { AdminCustomerSummary } from "@/features/admin/customers/types/admin-customer.types";
import { cn } from "@/lib/utils";

import { createCustomerTableDesktopColumns } from "./customer-table-desktop.config";

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

type CustomerTableProps = Readonly<{
  customers: readonly AdminCustomerSummary[];
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
  sort: CustomerSortOption;
  toolbar?: ReactNode;
}>;

export function CustomerTable({
  customers,
  currentPage,
  totalPages,
  perPage,
  totalItems,
  sort,
  toolbar,
}: CustomerTableProps): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParams(input: { page?: number; perPage?: number; sort?: CustomerSortOption }) {
    const params = new URLSearchParams(searchParams.toString());

    if (input.page !== undefined) {
      if (input.page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(input.page));
      }
    }

    if (input.perPage !== undefined) {
      if (input.perPage === CUSTOMER_PER_PAGE_OPTIONS[1]) {
        params.delete("perPage");
      } else {
        params.set("perPage", String(input.perPage));
      }
      params.delete("page");
    }

    if (input.sort !== undefined) {
      if (input.sort === CUSTOMER_DEFAULT_SORT) {
        params.delete("sort");
      } else {
        params.set("sort", input.sort);
      }
      params.delete("page");
    }

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <AdminConfigDataTableFrame
      toolbar={toolbar}
      desktopClassName="gap-0 p-1"
      desktopContent={
        <AdminConfigDataTable
          data={[...customers]}
          columns={createCustomerTableDesktopColumns({
            sort,
            onSortChange: (nextSort) => updateParams({ sort: nextSort }),
          })}
          getRowId={(customer) => customer.id}
          getRowHref={(customer) => getAdminCustomerDetailPath(customer)}
          wrapperClassName="flex min-h-0 flex-1 flex-col"
          viewportClassName="min-h-0 flex-1"
          headerClassName="backdrop-blur-xl"
          bodyClassName="[&_tr:last-child]:border-0"
          ariaLabel="Tableau des clients"
        />
      }
      pagination={
        <AdminPaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          perPage={perPage}
          totalItems={totalItems}
          perPageOptions={CUSTOMER_PER_PAGE_OPTIONS}
          onPageChange={(page) => updateParams({ page })}
          onPerPageChange={(nextPerPage) => updateParams({ perPage: nextPerPage })}
        />
      }
      mobileClassName="gap-0 p-1"
      mobileContent={
        <div className="grid gap-3 px-1 pb-1">
          {customers.map((customer) => {
            const fullName = getCustomerFullName(customer);

            return (
              <article
                key={customer.id}
                className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-4 shadow-sm backdrop-blur-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-surface-border/60 bg-surface-subtle text-[13px] font-semibold text-muted-foreground">
                    {getCustomerDisplayInitial(customer)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <AdminTableIdentityStack
                      title={
                        <Link
                          href={getAdminCustomerDetailPath(customer)}
                          className="hover:underline"
                        >
                          {fullName ?? <span className="text-muted-foreground/70">Sans nom</span>}
                        </Link>
                      }
                      titleClassName="line-clamp-1 leading-snug"
                      caption={<p className="mt-1 truncate text-xs text-muted-foreground">{customer.email}</p>}
                    />
                  </div>

                  <span
                    className={cn(
                      "inline-flex h-6 shrink-0 items-center rounded-md px-2 text-[11px] font-medium",
                      statusClassNames[customer.status]
                    )}
                  >
                    {CUSTOMER_STATUS_LABELS[customer.status]}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div className="grid gap-0.5">
                    <span className="text-muted-foreground/60">Commandes</span>
                    {customer.ordersCount > 0 ? (
                      <Link
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                        href={`${ADMIN_ORDERS_LIST_PATH}?search=${encodeURIComponent(customer.email)}`}
                      >
                        {customer.ordersCount} commande{customer.ordersCount > 1 ? "s" : ""}
                      </Link>
                    ) : (
                      <span className="text-foreground">Aucune</span>
                    )}
                  </div>

                  <div className="grid gap-0.5">
                    <span className="text-muted-foreground/60">{CUSTOMER_EMAIL_CONSENT_LABEL}</span>
                    <span className="text-foreground">
                      {getCustomerEmailOptInLabel(customer.acceptsEmail)}
                    </span>
                  </div>

                  <div className="grid gap-0.5">
                    <span className="text-muted-foreground/60">Cree le</span>
                    <span className="text-foreground">
                      {dateFormatter.format(new Date(customer.createdAt))}
                    </span>
                  </div>

                  <div className="grid gap-0.5">
                    <span className="text-muted-foreground/60">Derniere activite</span>
                    <span className="text-foreground">
                      {customer.lastSeenAt
                        ? dateFormatter.format(new Date(customer.lastSeenAt))
                        : "—"}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      }
    />
  );
}
