import type { OrderStatus } from "@/db/repositories/order.repository";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SectionIntro } from "@/components/section-intro";
import { Notice } from "@/components/notice";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { shipOrderAction } from "@/features/admin/orders/actions/ship-order-action";
import { updateOrderStatusAction } from "@/features/admin/orders/actions/update-order-status-action";
import { getOrderTransitionLabel } from "./order-detail-helpers";

type OrderDetailActionsCardProps = Readonly<{
  order: {
    id: string;
    reference: string;
    trackingReference: string | null;
    createdAtLabel: string;
    statusLabel: string;
    paymentStatusLabel: string;
  };
  allowedTransitions: readonly OrderStatus[];
}>;

export function OrderDetailActionsCard({
  order,
  allowedTransitions
}: OrderDetailActionsCardProps) {
  const shippingFieldId = `tracking-reference-${order.id}`;
  const canShip = allowedTransitions.includes("shipped");
  const statusTransitions = allowedTransitions.filter(
    nextStatus => nextStatus !== "shipped"
  );

  return (
    <article className="store-card checkout-line rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm">
      <SectionIntro
        className="grid gap-2"
        description="Vérifiez le statut, puis utilisez l'action disponible si une étape reste à effectuer."
        eyebrow="Actions"
        title="État actuel"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="stack">
          <p className="meta-label">Référence</p>
          <p className="card-copy">{order.reference}</p>
        </div>

        <div className="stack">
          <p className="meta-label">Créée le</p>
          <p className="card-copy">{order.createdAtLabel}</p>
        </div>

        <div className="stack">
          <p className="meta-label">Statut</p>
          <p className="card-copy">{order.statusLabel}</p>
        </div>

        <div className="stack">
          <p className="meta-label">Paiement</p>
          <p className="card-copy">{order.paymentStatusLabel}</p>
        </div>
      </div>

      {allowedTransitions.length > 0 ? (
        <>
          <Separator />

          {canShip ? (
            <form
              action={shipOrderAction}
              className="admin-form grid gap-3 rounded-lg border border-border/60 bg-muted/20 p-4">
              <input
                name="orderId"
                type="hidden"
                value={order.id}
              />

              <AdminFormField
                htmlFor={shippingFieldId}
                label="Référence de suivi optionnelle">
                <Input
                  defaultValue={order.trackingReference ?? ""}
                  id={shippingFieldId}
                  name="trackingReference"
                  placeholder="Ex. COLISSIMO-123456"
                  type="text"
                />
              </AdminFormField>

              <Button
                className="button w-fit"
                type="submit">
                Marquer comme expédiée
              </Button>
            </form>
          ) : null}

          {statusTransitions.length > 0 ? (
            <AdminFormActions>
              {statusTransitions.map(nextStatus => (
                <form
                  action={updateOrderStatusAction}
                  key={nextStatus}>
                  <input
                    name="orderId"
                    type="hidden"
                    value={order.id}
                  />
                  <input
                    name="nextStatus"
                    type="hidden"
                    value={nextStatus}
                  />
                  <Button
                    className={
                      nextStatus === "cancelled"
                        ? "button admin-danger-button"
                        : "button"
                    }
                    type="submit">
                    {getOrderTransitionLabel(nextStatus)}
                  </Button>
                </form>
              ))}
            </AdminFormActions>
          ) : null}
        </>
      ) : (
        <Notice tone="note">
          Aucune autre action n&apos;est disponible pour cette commande.
        </Notice>
      )}
    </article>
  );
}
