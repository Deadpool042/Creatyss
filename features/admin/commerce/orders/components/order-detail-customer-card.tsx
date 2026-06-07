import {
  AdminSplitDetailFact,
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-overview-content";

type OrderDetailCustomerCardProps = Readonly<{
  customer: {
    fullName: string;
    email: string;
    phone: string | null;
  };
}>;

export function OrderDetailCustomerCard({ customer }: OrderDetailCustomerCardProps) {
  return (
    <AdminSplitDetailSectionCard>
      <AdminSplitDetailSectionHeader eyebrow="Client" title={customer.fullName} />

      <div className="grid gap-3 sm:grid-cols-2">
        <AdminSplitDetailFact label="Email" value={customer.email} />
        <AdminSplitDetailFact label="Téléphone" value={customer.phone ?? "Non renseigné"} />
      </div>
    </AdminSplitDetailSectionCard>
  );
}
