import {
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-overview-content";

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
    <AdminSplitDetailSectionCard tone="secondary">
      <AdminSplitDetailSectionHeader eyebrow="Livraison" title="Adresse de livraison" />
      <div className="grid gap-1 rounded-xl border border-surface-border-subtle bg-surface-panel-soft p-3 text-sm leading-6 text-foreground">
        <p>{address.line1}</p>
        {address.line2 ? <p>{address.line2}</p> : null}
        <p>
          {address.postalCode} {address.city}
        </p>
        <p className="text-text-muted-strong">{address.countryCode}</p>
      </div>
    </AdminSplitDetailSectionCard>
  );
}
