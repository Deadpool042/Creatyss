import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { captureAdminPaymentAction } from "@/features/admin/commerce/payments/actions/capture-admin-payment.action";
import { cancelAdminPaymentAction } from "@/features/admin/commerce/payments/actions/cancel-admin-payment.action";
import type {
  AdminPaymentMethodType,
  AdminPaymentStatus,
  AdminPaymentSummary,
} from "@/features/admin/commerce/payments/list/types/admin-payment-list.types";

type AdminPaymentsListProps = {
  payments: ReadonlyArray<AdminPaymentSummary>;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

function getPaymentStatusLabel(status: AdminPaymentStatus): string {
  switch (status) {
    case "captured":
      return "Reçu";
    case "cancelled":
      return "Annulé";
    case "unknown":
      return "Statut inconnu";
    default:
      return "En attente";
  }
}

type PaymentBadgeVariant = "outline" | "secondary" | "destructive";

function getPaymentStatusBadgeVariant(status: AdminPaymentStatus): PaymentBadgeVariant {
  switch (status) {
    case "captured":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
}

function getPaymentMethodLabel(method: AdminPaymentMethodType): string {
  switch (method) {
    case "bank_transfer":
      return "Virement bancaire";
    case "cash_on_delivery":
      return "Paiement à l'atelier";
    case "card":
      return "Carte bancaire";
    case "wallet":
      return "Portefeuille électronique";
    case "other":
      return "Autre";
  }
}

async function captureFormAction(formData: FormData): Promise<void> {
  "use server";
  await captureAdminPaymentAction(formData);
}

async function cancelFormAction(formData: FormData): Promise<void> {
  "use server";
  await cancelAdminPaymentAction(formData);
}

export function AdminPaymentsList({ payments }: AdminPaymentsListProps) {
  if (payments.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Aucun paiement à traiter pour le moment.
      </p>
    );
  }

  return (
    <div className="divide-y divide-surface-border/40">
      {payments.map((payment) => {
        const customerName =
          [payment.customerFirstName, payment.customerLastName].filter(Boolean).join(" ") ||
          payment.customerEmail;

        const isPending = payment.status === "pending";

        return (
          <div
            key={payment.id}
            className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
          >
            {/* Infos principales */}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/commerce/orders/${payment.orderId}`}
                  className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
                >
                  {payment.orderReference}
                </Link>
                <Badge variant={getPaymentStatusBadgeVariant(payment.status)}>
                  {getPaymentStatusLabel(payment.status)}
                </Badge>
              </div>

              <p className="truncate text-xs text-muted-foreground">{customerName}</p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>
                  Autorisé :{" "}
                  <span className="font-medium text-foreground">
                    {payment.amountAuthorized} {payment.currencyCode}
                  </span>
                </span>
                <span>
                  Capturé :{" "}
                  <span className="font-medium text-foreground">
                    {payment.amountCaptured != null
                      ? `${payment.amountCaptured} ${payment.currencyCode}`
                      : "—"}
                  </span>
                </span>
                <span>{getPaymentMethodLabel(payment.methodType)}</span>
                <span>{dateFormatter.format(new Date(payment.createdAt))}</span>
              </div>
            </div>

            {/* Actions inline (pending uniquement) */}
            {isPending ? (
              <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
                {payment.methodType !== "card" ? (
                  <form action={captureFormAction}>
                    <input type="hidden" name="paymentId" value={payment.id} />
                    <button
                      type="submit"
                      className="inline-flex h-8 items-center rounded-lg border border-surface-border bg-surface-panel px-3 text-xs font-medium text-foreground transition-colors hover:bg-interactive-hover"
                    >
                      Marquer reçu
                    </button>
                  </form>
                ) : null}
                <form action={cancelFormAction}>
                  <input type="hidden" name="paymentId" value={payment.id} />
                  <button
                    type="submit"
                    className="inline-flex h-8 items-center rounded-lg border border-feedback-error-border bg-feedback-error-surface px-3 text-xs font-medium text-feedback-error-foreground transition-colors hover:bg-feedback-error-surface-strong"
                  >
                    Annuler
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
