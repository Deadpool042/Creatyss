import {
  AdminSplitDetailFact,
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-section-card";

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
        <AdminSplitDetailFact
          className="rounded-none border-0 bg-transparent px-0 py-0 shadow-none"
          label="Email"
          value={customer.email}
        />
        <AdminSplitDetailFact
          className="rounded-none border-0 bg-transparent px-0 py-0 shadow-none"
          label="Téléphone"
          value={customer.phone ?? "Non renseigné"}
        />
      </div>
    </AdminSplitDetailSectionCard>
  );
}
