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
    <article className="grid gap-3 rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm">
      <SectionIntro
        className="grid gap-2"
        eyebrow="Livraison"
        title="Adresse de livraison"
      />
      <p className="card-copy text-sm leading-6 text-foreground">{address.line1}</p>
      {address.line2 ? (
        <p className="card-copy text-sm leading-6 text-foreground">
          {address.line2}
        </p>
      ) : null}
      <p className="card-copy text-sm leading-6 text-foreground">
        {address.postalCode} {address.city}
      </p>
      <p className="card-meta text-sm leading-6 text-muted-foreground">
        {address.countryCode}
      </p>
    </article>
  );
}
