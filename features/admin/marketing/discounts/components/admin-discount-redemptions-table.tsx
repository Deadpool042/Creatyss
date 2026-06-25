"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeader,
  AdminTableRow,
} from "@/components/admin/tables/admin-table";
import { Button } from "@/components/ui/button";
import type { AdminDiscountRedemptionPage } from "@/features/admin/marketing/discounts/types/admin-discount.types";

type AdminDiscountRedemptionsTableProps = {
  data: AdminDiscountRedemptionPage;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function AdminDiscountRedemptionsTable({ data }: AdminDiscountRedemptionsTableProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function buildPageHref(page: number): string {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  if (data.items.length === 0 && data.page === 1) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Aucune utilisation enregistrée pour cette remise.
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="hidden md:block">
        <AdminTable
          className="min-w-full"
          wrapperClassName="rounded-2xl border border-surface-border/60 bg-surface-panel/60 shadow-sm"
        >
          <AdminTableHeader>
            <AdminTableRow className="hover:bg-transparent">
              <AdminTableHead>Date</AdminTableHead>
              <AdminTableHead>Code utilisé</AdminTableHead>
              <AdminTableHead>Commande</AdminTableHead>
              <AdminTableHead>Client</AdminTableHead>
              <AdminTableHead>Montant appliqué</AdminTableHead>
            </AdminTableRow>
          </AdminTableHeader>
          <AdminTableBody>
            {data.items.map((redemption) => (
              <AdminTableRow key={redemption.id}>
                <AdminTableCell className="text-muted-foreground text-sm">
                  {dateFormatter.format(redemption.redeemedAt)}
                </AdminTableCell>
                <AdminTableCell>
                  {redemption.discountCode !== null ? (
                    <span className="font-mono text-sm text-foreground">
                      {redemption.discountCode}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Code principal</span>
                  )}
                </AdminTableCell>
                <AdminTableCell>
                  {redemption.orderId !== null && redemption.orderNumber !== null ? (
                    <Link
                      href={`/admin/commerce/orders/${redemption.orderId}`}
                      className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      {redemption.orderNumber}
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </AdminTableCell>
                <AdminTableCell>
                  {redemption.customerId !== null ? (
                    <Link
                      href={`/admin/commerce/customers/${redemption.customerId}`}
                      className="text-sm text-foreground underline-offset-4 hover:underline"
                    >
                      {redemption.customerDisplayName ?? redemption.customerEmail ?? "—"}
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </AdminTableCell>
                <AdminTableCell className="text-foreground text-sm">
                  {redemption.amountApplied !== null && redemption.currencyCode !== null
                    ? new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: redemption.currencyCode,
                      }).format(redemption.amountApplied)
                    : "—"}
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>

      <div className="grid gap-3 md:hidden">
        {data.items.map((redemption) => (
          <article
            key={redemption.id}
            className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {redemption.discountCode !== null ? (
                    <span className="font-mono">{redemption.discountCode}</span>
                  ) : (
                    "Code principal"
                  )}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {dateFormatter.format(redemption.redeemedAt)}
                </p>
              </div>
              {redemption.amountApplied !== null && redemption.currencyCode !== null ? (
                <span className="shrink-0 text-sm font-semibold text-foreground">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: redemption.currencyCode,
                  }).format(redemption.amountApplied)}
                </span>
              ) : null}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              {redemption.orderNumber !== null && redemption.orderId !== null ? (
                <div className="grid gap-0.5">
                  <span className="text-muted-foreground/60">Commande</span>
                  <Link
                    href={`/admin/commerce/orders/${redemption.orderId}`}
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    {redemption.orderNumber}
                  </Link>
                </div>
              ) : null}
              {redemption.customerId !== null ? (
                <div className="grid gap-0.5">
                  <span className="text-muted-foreground/60">Client</span>
                  <Link
                    href={`/admin/commerce/customers/${redemption.customerId}`}
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    {redemption.customerDisplayName ?? redemption.customerEmail ?? "—"}
                  </Link>
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {data.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Page {data.page} / {data.totalPages} — {data.total} utilisation
            {data.total > 1 ? "s" : ""}
          </p>
          <div className="flex gap-2">
            {data.page > 1 ? (
              <Button asChild variant="outline" size="sm">
                <Link href={buildPageHref(data.page - 1)}>Précédent</Link>
              </Button>
            ) : null}
            {data.page < data.totalPages ? (
              <Button asChild variant="outline" size="sm">
                <Link href={buildPageHref(data.page + 1)}>Suivant</Link>
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
