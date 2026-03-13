import { SectionIntro } from "@/components/section-intro";

type OrderDetailShippingCardProps = Readonly<{
  shippedAtLabel: string | null;
  trackingReference: string | null;
}>;

export function OrderDetailShippingCard({
  shippedAtLabel,
  trackingReference
}: OrderDetailShippingCardProps) {
  return (
    <article className="store-card checkout-line rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm">
      <div className="stack gap-2">
        <SectionIntro
          description={
            shippedAtLabel
              ? `Expédiée le ${shippedAtLabel}`
              : "La commande n'a pas encore été expédiée."
          }
          eyebrow="Expédition"
          title="Suivi simple"
        />

        {trackingReference ? (
          <p className="card-meta">
            Référence de suivi : {trackingReference}
          </p>
        ) : null}
      </div>
    </article>
  );
}
