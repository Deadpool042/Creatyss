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
  type OrderLineForReturn,
} from "@/features/admin/commerce/returns/types/admin-return.types";
import { createReturnAction } from "@/features/admin/commerce/returns/actions/create-return-action";
import { advanceReturnAction } from "@/features/admin/commerce/returns/actions/advance-return-action";

type Props = Readonly<{
  request: AdminReturnSummary | null;
  orderId: string;
  orderLines: ReadonlyArray<OrderLineForReturn>;
}>;

const buttonClass =
  "w-fit rounded-lg border border-surface-border bg-surface-panel px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-interactive-hover disabled:cursor-not-allowed disabled:opacity-50";

const NEXT_ACTIONS: Record<
  ReturnRequestStatus,
  ReadonlyArray<{ status: ReturnRequestStatus; label: string }>
> = {
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
    { status: "RECEIVED", label: "Marquer reçu (restock auto)" },
    { status: "CANCELLED", label: "Annuler" },
  ],
  RECEIVED: [
    { status: "REFUNDED", label: "Rembourser via Stripe" },
    { status: "CLOSED", label: "Clôturer sans remboursement" },
  ],
  REFUNDED: [{ status: "CLOSED", label: "Clôturer" }],
  REJECTED: [],
  CLOSED: [],
  CANCELLED: [],
  ARCHIVED: [],
};

export function OrderDetailReturnCard({ request, orderId, orderLines }: Props) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(orderLines.map((l) => [l.id, l.quantity]))
  );

  function run(
    action: () => Promise<{ success: boolean; error?: string }>,
    okMessage: string
  ): void {
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

  function handleCreate(): void {
    const lines = orderLines
      .map((l) => ({ orderLineId: l.id, quantity: quantities[l.id] ?? l.quantity }))
      .filter((l) => l.quantity > 0);

    const isFullOrder = orderLines.every((l) => (quantities[l.id] ?? l.quantity) === l.quantity);

    run(
      () => createReturnAction(orderId, isFullOrder ? undefined : lines),
      "Demande de retour ouverte."
    );
  }

  return (
    <AdminSplitDetailSectionCard tone="secondary">
      <AdminSplitDetailSectionHeader
        eyebrow="Retour"
        title="Demande de retour"
        description="Gestion du retour. Le restock est automatique à réception. Le remboursement Stripe est déclenché manuellement."
      />

      {request === null ? (
        <div className="grid gap-3">
          <p className="card-copy leading-snug text-foreground">
            Sélectionnez les lignes à retourner :
          </p>
          <ol className="grid gap-2">
            {orderLines.map((line) => (
              <li key={line.id} className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={line.quantity}
                  value={quantities[line.id] ?? line.quantity}
                  onChange={(e) =>
                    setQuantities((prev) => ({
                      ...prev,
                      [line.id]: Math.min(line.quantity, Math.max(0, Number(e.target.value))),
                    }))
                  }
                  className="w-16 rounded border border-surface-border bg-surface-panel px-2 py-1 text-sm text-foreground"
                  disabled={isPending}
                />
                <span className="card-meta text-text-muted-strong">
                  / {line.quantity} × {line.productName}
                  {line.variantName ? ` (${line.variantName})` : ""}
                </span>
              </li>
            ))}
          </ol>
        </div>
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
            disabled={isPending || orderLines.every((l) => (quantities[l.id] ?? l.quantity) === 0)}
            onClick={handleCreate}
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
