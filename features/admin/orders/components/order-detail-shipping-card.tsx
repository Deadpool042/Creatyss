import { SectionIntro } from "@/components/shared/section-intro";

type OrderDetailShippingCardProps = Readonly<{
  shippedAtLabel: string | null;
  trackingReference: string | null;
}>;

export function OrderDetailShippingCard({
  shippedAtLabel,
  trackingReference
}: OrderDetailShippingCardProps) {
  return (
    <article className="grid gap-3 rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm">
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
