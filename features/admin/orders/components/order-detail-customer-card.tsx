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
      <SectionIntro className="grid gap-2" eyebrow="Cliente" title={customer.fullName} />
      <p className="card-copy text-sm leading-6 text-foreground">{customer.email}</p>
      {customer.phone ? (
        <p className="card-meta text-sm leading-6 text-muted-foreground">{customer.phone}</p>
      ) : null}
    </article>
  );
}
