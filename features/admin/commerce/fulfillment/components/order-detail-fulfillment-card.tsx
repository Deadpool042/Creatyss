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
  type OrderLineForFulfillment,
} from "@/features/admin/commerce/fulfillment/types/admin-fulfillment.types";
import { createFulfillmentAction } from "@/features/admin/commerce/fulfillment/actions/create-fulfillment-action";
import { advanceFulfillmentAction } from "@/features/admin/commerce/fulfillment/actions/advance-fulfillment-action";

type Props = Readonly<{
  fulfillment: AdminFulfillmentSummary | null;
  orderId: string;
  orderLines: ReadonlyArray<OrderLineForFulfillment>;
  /** Niveau `partial` de `commerce.fulfillment` — autorise les quantités partielles à la création. */
  allowPartial: boolean;
}>;

const buttonClass =
  "w-fit rounded-lg border border-surface-border bg-surface-panel px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-interactive-hover disabled:cursor-not-allowed disabled:opacity-50";

export function OrderDetailFulfillmentCard({
  fulfillment,
  orderId,
  orderLines,
  allowPartial,
}: Props) {
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

  function advance(next: FulfillmentStatus, okMessage: string): void {
    if (fulfillment === null) return;
    run(() => advanceFulfillmentAction(fulfillment.id, orderId, next), okMessage);
  }

  function handleCreate(): void {
    if (!allowPartial) {
      run(() => createFulfillmentAction(orderId, undefined), "Préparation créée.");
      return;
    }

    const lines = orderLines
      .map((l) => ({ orderLineId: l.id, quantity: quantities[l.id] ?? l.quantity }))
      .filter((l) => l.quantity > 0);

    const isFullOrder = orderLines.every((l) => (quantities[l.id] ?? l.quantity) === l.quantity);

    run(
      () => createFulfillmentAction(orderId, isFullOrder ? undefined : lines),
      "Préparation créée."
    );
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
        <div className="grid gap-3">
          <p className="card-copy leading-snug text-foreground">
            {allowPartial
              ? "Sélectionnez les quantités à préparer :"
              : "Lignes à préparer (commande complète) :"}
          </p>
          <ol className="grid gap-2">
            {orderLines.map((line) =>
              allowPartial ? (
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
                  </span>
                </li>
              ) : (
                <li key={line.id} className="card-meta text-text-muted-strong">
                  {line.quantity} × {line.productName}
                </li>
              )
            )}
          </ol>
        </div>
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
            disabled={isPending || orderLines.every((l) => (quantities[l.id] ?? l.quantity) === 0)}
            onClick={handleCreate}
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
