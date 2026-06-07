import type { OrderStatus } from "@/entities/order/order-status-transition";
import {
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-overview-content";
import { CustomButton } from "@/components/shared";
import { Input } from "@/components/ui/input";
import { Notice } from "@/components/shared/feedback";
import { AdminFormActions } from "@/components/admin/forms/admin-form-actions";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { updateOrderStatusAction, shipOrderAction } from "@/features/admin/commerce/orders/actions";
import { OrderCancelConfirmDialog } from "./order-cancel-confirm-dialog";
import { getOrderTransitionLabel } from "@/features/admin/commerce/orders/mappers/order-detail-mappers";

type OrderDetailActionsCardProps = Readonly<{
  order: {
    id: string;
    trackingReference: string | null;
  };
  allowedTransitions: readonly OrderStatus[];
}>;

export function OrderDetailActionsCard({ order, allowedTransitions }: OrderDetailActionsCardProps) {
  const shippingFieldId = `tracking-reference-${order.id}`;
  const canShip = allowedTransitions.includes("shipped");
  const statusTransitions = allowedTransitions.filter((nextStatus) => nextStatus !== "shipped");

  return (
    <AdminSplitDetailSectionCard tone="secondary">
      <AdminSplitDetailSectionHeader
        description="Les actions proposées suivent l'état actuel de la commande. Aucune étape métier n'est modifiée en dehors des transitions déjà autorisées."
        eyebrow="Actions"
        title="Actions disponibles"
      />

      {allowedTransitions.length > 0 ? (
        <div className="grid gap-4">
          {canShip ? (
            <form
              action={shipOrderAction}
              className="grid gap-4 rounded-xl border border-surface-border-subtle bg-surface-panel-soft p-4"
            >
              <div className="grid gap-1">
                <h3 className="text-sm font-semibold text-foreground">Expédier la commande</h3>
                <p className="text-sm leading-6 text-text-muted-strong">
                  Ajoutez une référence de suivi si vous l&apos;avez, puis confirmez
                  l&apos;expédition.
                </p>
              </div>

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

              <CustomButton type="submit" fullWidth className="sm:w-fit">
                Marquer comme expédiée
              </CustomButton>
            </form>
          ) : null}

          {statusTransitions.length > 0 ? (
            <div className="grid gap-3 rounded-xl border border-surface-border-subtle bg-surface-panel-soft p-4">
              <div className="grid gap-1">
                <h3 className="text-sm font-semibold text-foreground">Autres actions</h3>
                <p className="text-sm leading-6 text-text-muted-strong">
                  Utilisez uniquement l&apos;action qui correspond à l&apos;étape réellement en
                  cours.
                </p>
              </div>

              <AdminFormActions className="gap-2">
                {statusTransitions.map((nextStatus) =>
                  nextStatus === "cancelled" ? (
                    <OrderCancelConfirmDialog key={nextStatus} orderId={order.id} />
                  ) : (
                    <form action={updateOrderStatusAction} key={nextStatus}>
                      <input name="orderId" type="hidden" value={order.id} />
                      <input name="nextStatus" type="hidden" value={nextStatus} />
                      <CustomButton variant="outline" type="submit">
                        {getOrderTransitionLabel(nextStatus)}
                      </CustomButton>
                    </form>
                  )
                )}
              </AdminFormActions>
            </div>
          ) : null}
        </div>
      ) : (
        <Notice tone="note">Aucune autre action n&apos;est disponible pour cette commande.</Notice>
      )}
    </AdminSplitDetailSectionCard>
  );
}
