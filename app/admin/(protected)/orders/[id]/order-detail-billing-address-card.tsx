import { SectionIntro } from "@/components/section-intro";

type OrderDetailBillingAddressCardProps = Readonly<{
  billing: {
    sameAsShipping: boolean;
    fullName: string | null;
    phone: string | null;
    line1: string | null;
    line2: string | null;
    postalCode: string | null;
    city: string | null;
    countryCode: string | null;
  };
}>;

export function OrderDetailBillingAddressCard({
  billing
}: OrderDetailBillingAddressCardProps) {
  return (
    <article className="store-card checkout-line rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm">
      <div className="stack gap-2">
        <SectionIntro
          className="grid gap-2"
          eyebrow="Facturation"
          title="Adresse de facturation"
        />

        {billing.sameAsShipping ? (
          <p className="card-copy">Identique à l&apos;adresse de livraison.</p>
        ) : (
          <>
            {billing.fullName ? (
              <p className="card-copy">{billing.fullName}</p>
            ) : null}
            {billing.phone ? <p className="card-meta">{billing.phone}</p> : null}
            {billing.line1 ? <p className="card-copy">{billing.line1}</p> : null}
            {billing.line2 ? <p className="card-copy">{billing.line2}</p> : null}
            {billing.postalCode && billing.city ? (
              <p className="card-copy">
                {billing.postalCode} {billing.city}
              </p>
            ) : null}
            {billing.countryCode ? (
              <p className="card-meta">{billing.countryCode}</p>
            ) : null}
          </>
        )}
      </div>
    </article>
  );
}
