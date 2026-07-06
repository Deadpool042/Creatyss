"use client";

import { useMemo, useState } from "react";

import { AdminConfigDataTableToolbar } from "@/components/admin/tables/admin-config-data-table-toolbar";
import type { AdminPaymentSummary } from "@/features/admin/commerce/payments/list/types/admin-payment-list.types";

import { AdminPaymentsList } from "./admin-payments-list";

type AdminPaymentsPanelProps = Readonly<{
  payments: ReadonlyArray<AdminPaymentSummary>;
  canManageManualPayments: boolean;
}>;

function matchesPaymentSearch(payment: AdminPaymentSummary, query: string): boolean {
  const customerName = [payment.customerFirstName, payment.customerLastName]
    .filter(Boolean)
    .join(" ");

  return [payment.orderReference, customerName, payment.customerEmail].some((value) =>
    value.toLocaleLowerCase("fr-FR").includes(query)
  );
}

export function AdminPaymentsPanel({ payments, canManageManualPayments }: AdminPaymentsPanelProps) {
  const [search, setSearch] = useState("");

  const normalizedQuery = search.trim().toLocaleLowerCase("fr-FR");
  const isFiltered = normalizedQuery.length > 0;

  const filteredPayments = useMemo(
    () =>
      payments.filter(
        (payment) => normalizedQuery.length === 0 || matchesPaymentSearch(payment, normalizedQuery)
      ),
    [payments, normalizedQuery]
  );

  return (
    <div className="flex flex-col gap-3">
      <AdminConfigDataTableToolbar
        search={search}
        onSearchChange={setSearch}
        mobileSearchPlaceholder="Rechercher un paiement…"
        desktopSearchPlaceholder="Rechercher une commande, un client…"
        resultsCount={filteredPayments.length}
        resultsFullLabel={(count) => `${count} paiement${count > 1 ? "s" : ""}`}
        resultsShortLabel={(count) => `${count} paiement${count > 1 ? "s" : ""}`}
      />

      <AdminPaymentsList
        payments={filteredPayments}
        canManageManualPayments={canManageManualPayments}
        {...(isFiltered ? { emptyMessage: "Aucun paiement ne correspond à la recherche." } : {})}
      />
    </div>
  );
}
