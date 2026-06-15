"use client";

import { useState, useTransition } from "react";

import {
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-section-card";
import type { FulfillmentStatus } from "@/prisma-generated/client";
import {
  getFulfillmentStatusLabel,
  type AdminFulfillmentSummary,
} from "@/features/admin/commerce/fulfillment/types/admin-fulfillment.types";
import { createFulfillmentAction } from "@/features/admin/commerce/fulfillment/actions/create-fulfillment-action";
import { advanceFulfillmentAction } from "@/features/admin/commerce/fulfillment/actions/advance-fulfillment-action";

type Props = Readonly<{
  fulfillment: AdminFulfillmentSummary | null;
  orderId: string;
}>;

const buttonClass =
  "w-fit rounded-lg border border-surface-border bg-surface-panel px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-interactive-hover disabled:cursor-not-allowed disabled:opacity-50";

export function OrderDetailFulfillmentCard({ fulfillment, orderId }: Props) {
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

  function advance(next: FulfillmentStatus, okMessage: string): void {
    if (fulfillment === null) return;
    run(() => advanceFulfillmentAction(fulfillment.id, orderId, next), okMessage);
  }

  const status = fulfillment?.status ?? null;

  return (
    <AdminSplitDetailSectionCard tone="secondary">
      <AdminSplitDetailSectionHeader
        eyebrow="Préparation"
        title="Préparation logistique"
        description="Suivi de la préparation de la commande (indépendant de l'expédition et du stock)."
      />

      {fulfillment === null ? (
        <p className="card-copy leading-snug text-foreground">
          Aucune préparation pour cette commande.
        </p>
      ) : (
        <div className="grid gap-2">
          <p className="card-meta leading-snug text-text-muted-strong">
            Statut : {getFulfillmentStatusLabel(fulfillment.status)}
            {fulfillment.fulfilledAtLabel ? ` · préparée le ${fulfillment.fulfilledAtLabel}` : ""}
          </p>
          <ol className="grid gap-1">
            {fulfillment.items.map((item) => (
              <li key={item.id} className="card-meta leading-snug text-text-muted-strong">
                {item.quantity} × {item.productName}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-3 grid gap-2">
        {fulfillment === null ? (
          <button
            type="button"
            className={buttonClass}
            disabled={isPending}
            onClick={() => run(() => createFulfillmentAction(orderId), "Préparation créée.")}
          >
            {isPending ? "Création…" : "Créer la préparation"}
          </button>
        ) : null}

        {status === "PENDING" ? (
          <button
            type="button"
            className={buttonClass}
            disabled={isPending}
            onClick={() => advance("READY", "Préparation marquée prête.")}
          >
            {isPending ? "…" : "Marquer prête"}
          </button>
        ) : null}

        {status === "PENDING" || status === "READY" ? (
          <>
            <button
              type="button"
              className={buttonClass}
              disabled={isPending}
              onClick={() => advance("FULFILLED", "Préparation terminée.")}
            >
              {isPending ? "…" : "Marquer préparée"}
            </button>
            <button
              type="button"
              className={buttonClass}
              disabled={isPending}
              onClick={() => advance("CANCELLED", "Préparation annulée.")}
            >
              {isPending ? "…" : "Annuler la préparation"}
            </button>
          </>
        ) : null}

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
