import { SectionIntro } from "@/components/section-intro";

type OrderDetailShippingAddressCardProps = Readonly<{
  address: {
    line1: string;
    line2: string | null;
    postalCode: string;
    city: string;
    countryCode: string;
  };
}>;

export function OrderDetailShippingAddressCard({
  address
}: OrderDetailShippingAddressCardProps) {
  return (
    <article className="store-card checkout-line rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm">
      <div className="stack gap-2">
        <SectionIntro
          className="grid gap-2"
          eyebrow="Livraison"
          title="Adresse de livraison"
        />
        <p className="card-copy">{address.line1}</p>
        {address.line2 ? <p className="card-copy">{address.line2}</p> : null}
        <p className="card-copy">
          {address.postalCode} {address.city}
        </p>
        <p className="card-meta">{address.countryCode}</p>
      </div>
    </article>
  );
}
