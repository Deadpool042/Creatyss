import {
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-overview-content";

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
    <AdminSplitDetailSectionCard tone="secondary">
      <AdminSplitDetailSectionHeader eyebrow="Facturation" title="Adresse de facturation" />

      {billing.sameAsShipping ? (
        <p className="rounded-xl border border-surface-border-subtle bg-surface-panel-soft p-3 text-sm leading-6 text-foreground">
          Identique à l&apos;adresse de livraison.
        </p>
      ) : (
        <div className="grid gap-1 rounded-xl border border-surface-border-subtle bg-surface-panel-soft p-3 text-sm leading-6 text-foreground">
          {billing.fullName ? (
            <p className="card-copy text-sm leading-6 text-foreground">{billing.fullName}</p>
          ) : null}
          {billing.phone ? (
            <p className="card-meta text-sm leading-6 text-text-muted-strong">{billing.phone}</p>
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
            <p className="card-meta text-sm leading-6 text-text-muted-strong">
              {billing.countryCode}
            </p>
          ) : null}
        </div>
      )}
    </AdminSplitDetailSectionCard>
  );
}
