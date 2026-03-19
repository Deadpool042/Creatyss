import { SectionIntro } from "@/components/shared/section-intro";

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

export function OrderDetailBillingAddressCard({ billing }: OrderDetailBillingAddressCardProps) {
  return (
    <article className="grid gap-3 rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm">
      <SectionIntro className="grid gap-2" eyebrow="Facturation" title="Adresse de facturation" />

      {billing.sameAsShipping ? (
        <p className="card-copy text-sm leading-6 text-foreground">
          Identique à l&apos;adresse de livraison.
        </p>
      ) : (
        <>
          {billing.fullName ? (
            <p className="card-copy text-sm leading-6 text-foreground">{billing.fullName}</p>
          ) : null}
          {billing.phone ? (
            <p className="card-meta text-sm leading-6 text-muted-foreground">{billing.phone}</p>
          ) : null}
          {billing.line1 ? (
            <p className="card-copy text-sm leading-6 text-foreground">{billing.line1}</p>
          ) : null}
          {billing.line2 ? (
            <p className="card-copy text-sm leading-6 text-foreground">{billing.line2}</p>
          ) : null}
          {billing.postalCode && billing.city ? (
            <p className="card-copy text-sm leading-6 text-foreground">
              {billing.postalCode} {billing.city}
            </p>
          ) : null}
          {billing.countryCode ? (
            <p className="card-meta text-sm leading-6 text-muted-foreground">
              {billing.countryCode}
            </p>
          ) : null}
        </>
      )}
    </article>
  );
}
