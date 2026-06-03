import { SectionIntro } from "@/components/shared/display";

type OrderDetailShippingAddressCardProps = Readonly<{
  address: {
    line1: string;
    line2: string | null;
    postalCode: string;
    city: string;
    countryCode: string;
  };
}>;

export function OrderDetailShippingAddressCard({ address }: OrderDetailShippingAddressCardProps) {
  return (
    <article className="grid gap-3 rounded-xl border border-surface-border bg-surface-panel p-5 text-foreground shadow-card">
      <SectionIntro className="grid gap-2" eyebrow="Livraison" title="Adresse de livraison" />
      <div className="grid gap-1 text-sm leading-6 text-foreground">
        <p>{address.line1}</p>
        {address.line2 ? <p>{address.line2}</p> : null}
        <p>
          {address.postalCode} {address.city}
        </p>
        <p className="text-text-muted-strong">{address.countryCode}</p>
      </div>
    </article>
  );
}
