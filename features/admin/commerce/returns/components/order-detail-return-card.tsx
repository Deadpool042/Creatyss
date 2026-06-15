"use client";

import { useState, useTransition } from "react";

import {
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-section-card";
import type { ReturnRequestStatus } from "@/prisma-generated/client";
import {
  getReturnStatusLabel,
  type AdminReturnSummary,
} from "@/features/admin/commerce/returns/types/admin-return.types";
import { createReturnAction } from "@/features/admin/commerce/returns/actions/create-return-action";
import { advanceReturnAction } from "@/features/admin/commerce/returns/actions/advance-return-action";

type Props = Readonly<{
  request: AdminReturnSummary | null;
  orderId: string;
}>;

const buttonClass =
  "w-fit rounded-lg border border-surface-border bg-surface-panel px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-interactive-hover disabled:cursor-not-allowed disabled:opacity-50";

const NEXT_ACTIONS: Record<ReturnRequestStatus, ReadonlyArray<{ status: ReturnRequestStatus; label: string }>> = {
  REQUESTED: [
    { status: "UNDER_REVIEW", label: "Mettre en examen" },
    { status: "APPROVED", label: "Approuver" },
    { status: "REJECTED", label: "Refuser" },
    { status: "CANCELLED", label: "Annuler" },
  ],
  UNDER_REVIEW: [
    { status: "APPROVED", label: "Approuver" },
    { status: "REJECTED", label: "Refuser" },
    { status: "CANCELLED", label: "Annuler" },
  ],
  APPROVED: [
    { status: "RECEIVED", label: "Marquer reçu" },
    { status: "CANCELLED", label: "Annuler" },
  ],
  RECEIVED: [
    { status: "REFUNDED", label: "Marquer remboursé" },
    { status: "CLOSED", label: "Clôturer" },
  ],
  REFUNDED: [{ status: "CLOSED", label: "Clôturer" }],
  REJECTED: [],
  CLOSED: [],
  CANCELLED: [],
  ARCHIVED: [],
};

export function OrderDetailReturnCard({ request, orderId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  function run(action: () => Promise<{ success: boolean; error?: string }>, okMessage: string): void {
    setFeedback(null);
    startTransition(async () => {
      const result = await action();
      setFeedback(
        result.success
          ? { type: "success", message: okMessage }
          : { type: "error", message: result.error ?? "Erreur." }
      );
    });
  }

  return (
    <AdminSplitDetailSectionCard tone="secondary">
      <AdminSplitDetailSectionHeader
        eyebrow="Retour"
        title="Demande de retour"
        description="Gestion du retour (hors remboursement et stock, traités séparément)."
      />

      {request === null ? (
        <p className="card-copy leading-snug text-foreground">
          Aucune demande de retour pour cette commande.
        </p>
      ) : (
        <div className="grid gap-2">
          <p className="card-meta leading-snug text-text-muted-strong">
            {request.returnNumber} · {getReturnStatusLabel(request.status)} · ouvert le{" "}
            {request.createdAtLabel}
          </p>
          <ol className="grid gap-1">
            {request.items.map((item) => (
              <li key={item.id} className="card-meta leading-snug text-text-muted-strong">
                {item.quantity} × {item.productName}
                {item.variantName ? ` (${item.variantName})` : ""}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-3 grid gap-2">
        {request === null ? (
          <button
            type="button"
            className={buttonClass}
            disabled={isPending}
            onClick={() => run(() => createReturnAction(orderId), "Demande de retour ouverte.")}
          >
            {isPending ? "Ouverture…" : "Ouvrir un retour"}
          </button>
        ) : (
          NEXT_ACTIONS[request.status].map((action) => (
            <button
              key={action.status}
              type="button"
              className={buttonClass}
              disabled={isPending}
              onClick={() =>
                run(
                  () => advanceReturnAction(request.id, orderId, action.status),
                  `Retour : ${getReturnStatusLabel(action.status)}.`
                )
              }
            >
              {isPending ? "…" : action.label}
            </button>
          ))
        )}

        {feedback !== null ? (
          <p
            className={`card-meta leading-snug ${
              feedback.type === "success" ? "text-text-success" : "text-text-alert"
            }`}
          >
            {feedback.message}
          </p>
        ) : null}
      </div>
    </AdminSplitDetailSectionCard>
  );
}
