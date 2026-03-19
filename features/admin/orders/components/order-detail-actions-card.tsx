import type { OrderStatus } from "@/entities/order/order-status-transition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SectionIntro } from "@/components/shared/section-intro";
import { Notice } from "@/components/shared/notice";
import { AdminFormActions } from "@/components/admin/admin-form-actions";
import { AdminFormField } from "@/components/admin/admin-form-field";
import { updateOrderStatusAction, shipOrderAction } from "@/features/admin/orders/actions";
import { OrderCancelConfirmDialog } from "./order-cancel-confirm-dialog";
import { getOrderTransitionLabel } from "@/features/admin/orders/mappers/order-detail-mappers";

const detailCardClassName = "grid gap-1 rounded-lg border border-border/60 bg-muted/10 p-3";

const detailLabelClassName =
  "text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground";

const detailValueClassName = "text-sm font-medium leading-6 text-foreground";

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

export function OrderDetailActionsCard({ order, allowedTransitions }: OrderDetailActionsCardProps) {
  const shippingFieldId = `tracking-reference-${order.id}`;
  const canShip = allowedTransitions.includes("shipped");
  const statusTransitions = allowedTransitions.filter((nextStatus) => nextStatus !== "shipped");

  return (
    <article className="grid gap-5 rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm">
      <SectionIntro
        className="grid gap-2"
        description="Vérifiez le statut, puis utilisez l'action disponible si une étape reste à effectuer."
        eyebrow="Actions"
        title="État actuel"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={detailCardClassName}>
          <p className={detailLabelClassName}>Référence</p>
          <p className={detailValueClassName}>{order.reference}</p>
        </div>

        <div className={detailCardClassName}>
          <p className={detailLabelClassName}>Créée le</p>
          <p className={detailValueClassName}>{order.createdAtLabel}</p>
        </div>

        <div className={detailCardClassName}>
          <p className={detailLabelClassName}>Statut</p>
          <p className={detailValueClassName}>{order.statusLabel}</p>
        </div>

        <div className={detailCardClassName}>
          <p className={detailLabelClassName}>Paiement</p>
          <p className={detailValueClassName}>{order.paymentStatusLabel}</p>
        </div>
      </div>

      {allowedTransitions.length > 0 ? (
        <>
          <Separator />

          {canShip ? (
            <form
              action={shipOrderAction}
              className="grid gap-4 rounded-lg border border-border/60 bg-muted/10 p-4"
            >
              <input name="orderId" type="hidden" value={order.id} />

              <AdminFormField htmlFor={shippingFieldId} label="Référence de suivi optionnelle">
                <Input
                  defaultValue={order.trackingReference ?? ""}
                  id={shippingFieldId}
                  name="trackingReference"
                  placeholder="Ex. COLISSIMO-123456"
                  type="text"
                />
              </AdminFormField>

              <Button className="w-full sm:w-fit" type="submit">
                Marquer comme expédiée
              </Button>
            </form>
          ) : null}

          {statusTransitions.length > 0 ? (
            <AdminFormActions className="gap-2">
              {statusTransitions.map((nextStatus) =>
                nextStatus === "cancelled" ? (
                  <OrderCancelConfirmDialog key={nextStatus} orderId={order.id} />
                ) : (
                  <form action={updateOrderStatusAction} key={nextStatus}>
                    <input name="orderId" type="hidden" value={order.id} />
                    <input name="nextStatus" type="hidden" value={nextStatus} />
                    <Button variant="outline" type="submit">
                      {getOrderTransitionLabel(nextStatus)}
                    </Button>
                  </form>
                )
              )}
            </AdminFormActions>
          ) : null}
        </>
      ) : (
        <Notice tone="note">Aucune autre action n&apos;est disponible pour cette commande.</Notice>
      )}
    </article>
  );
}
