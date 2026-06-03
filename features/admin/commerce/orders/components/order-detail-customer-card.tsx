import { SectionIntro } from "@/components/shared/display";

type OrderDetailCustomerCardProps = Readonly<{
  customer: {
    fullName: string;
    email: string;
    phone: string | null;
  };
}>;

export function OrderDetailCustomerCard({ customer }: OrderDetailCustomerCardProps) {
  return (
    <article className="grid gap-3 rounded-xl border border-surface-border/60 bg-surface-panel/80 p-5 shadow-sm">
      <SectionIntro className="grid gap-2" eyebrow="Client" title={customer.fullName} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted-soft">
            Email
          </p>
          <p className="mt-1 text-sm font-medium leading-6 text-foreground">{customer.email}</p>
        </div>

        <div className="rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted-soft">
            Téléphone
          </p>
          <p className="mt-1 text-sm font-medium leading-6 text-foreground">
            {customer.phone ?? "Non renseigné"}
          </p>
        </div>
      </div>
    </article>
  );
}
