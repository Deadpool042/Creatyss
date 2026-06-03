import { SectionIntro } from "@/components/shared/display";

type OrderDetailShippingCardProps = Readonly<{
  shippedAtLabel: string | null;
  trackingReference: string | null;
}>;

export function OrderDetailShippingCard({
  shippedAtLabel,
  trackingReference,
}: OrderDetailShippingCardProps) {
  return (
    <article className="grid gap-3 rounded-xl border border-surface-border/60 bg-surface-panel/80 p-5 shadow-sm">
      <SectionIntro
        className="grid gap-2"
        description={
          shippedAtLabel
            ? `Expédiée le ${shippedAtLabel}`
            : "La commande n'a pas encore été expédiée."
        }
        eyebrow="Expédition"
        title="Suivi simple"
      />

      {trackingReference ? (
        <p className="card-meta text-sm leading-6 text-muted-foreground">
          Référence de suivi : {trackingReference}
        </p>
      ) : null}
    </article>
  );
}
